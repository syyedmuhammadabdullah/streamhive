
import fs from "fs";
import path from "path";
import { spawn } from "child_process";
import ffmpeg from 'fluent-ffmpeg';
import ApiError from "./apiError";
interface ProcessOptions {
  inputPath: string;
  outputDir: string;
  fileNameWithoutExt: string;
  newThumbnailPath: string;
}

const resolutions = [
  { height: 240, bitrate: 400000, maxrate: 450000, bufsize: 600000, width: 426 },
  { height: 360, bitrate: 800000, maxrate: 856000, bufsize: 1200000, width: 640 },
  { height: 480, bitrate: 1400000, maxrate: 1498000, bufsize: 2100000, width: 854 },
];

const runFFmpeg = (inputPath: string, outputDir: string, fileName: string, res: typeof resolutions[0]) => {
  return new Promise<void>((resolve, reject) => {
    const resDir = path.join(outputDir, `${res.height}p`);
    fs.mkdirSync(resDir, { recursive: true });

    const outputPath = path.join(resDir, "index.m3u8");

    const ffmpeg = spawn("ffmpeg", [
      "-i", inputPath,
      "-vf", `scale=-2:${res.height}`,
      "-c:a", "aac",
      "-ar", "48000",
      "-c:v", "h264",
      "-profile:v", "main",
      "-crf", "20",
      "-sc_threshold", "0",
      "-g", "48",
      "-keyint_min", "48",
      "-hls_time", "4",
      "-hls_playlist_type", "vod",
      "-b:v", `${res.bitrate}`,
      "-maxrate", `${res.maxrate}`,
      "-bufsize", `${res.bufsize}`,
      "-hls_segment_filename", path.join(resDir, "segment_%03d.ts"),
      outputPath
    ]);

    ffmpeg.stderr.on("data", (data) => {
      console.log(`FFmpeg stderr: ${data}`);
    });

    ffmpeg.on("close", (code) => {
      if (code === 0) {
       
        resolve();
      } else {
        reject(`FFmpeg exited with code ${code} for ${res.height}p`);
      }
    });
  });
};


const createMasterPlaylist = (outputDir: string, availableRes: typeof resolutions) => {
  const lines = ["#EXTM3U", "#EXT-X-VERSION:3"];

  for (const res of availableRes) {
    lines.push(`#EXT-X-STREAM-INF:BANDWIDTH=${res.bitrate},RESOLUTION=${res.width}x${res.height}`);
    lines.push(`${res.height}p/index.m3u8`);
  }
  const masterPlaylist = path.join(outputDir, "master.m3u8");

  fs.writeFileSync(path.join(masterPlaylist), lines.join("\n"), "utf8");
  return masterPlaylist;
};

const getVideoHeight=(inputPath: string): Promise<number> => {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(inputPath, (err: any, metadata: any) => {
      if (err) return reject(err);
      const stream = metadata.streams.find(s => s.width && s.height);
      resolve(stream?.height || 0);
    });
  });
}

const createThumbnail = (inputPath: string, outputDir: string, newThumbnailPath: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (newThumbnailPath!=="") {
      fs.renameSync(newThumbnailPath, path.join(outputDir, 'thumb.jpg'));
      return resolve(path.join(outputDir, 'thumb.jpg'));
    }
    ffmpeg(inputPath)
      .on('end', () => {
        resolve(path.join(outputDir, 'thumb.jpg'));
      })
      .on('error', reject)
      .screenshots({
        timestamps: ['00:00:01'],
        filename: 'thumb.jpg',
        folder: outputDir,
        size: '320x?'
      });
  });
};

const processVideo = async ({ inputPath, outputDir, fileNameWithoutExt,newThumbnailPath }: ProcessOptions) => {
  
  const inputHeight = await getVideoHeight(inputPath);

  const availableVariants = resolutions.filter(r => inputHeight >= r.height);

  if (availableVariants.length === 0) throw new ApiError("video error",400,"Video resolution not supported")

  // Ensure base folder exists
  fs.mkdirSync(outputDir, { recursive: true });

  // Process each resolution
 await Promise.all(
  availableVariants.map(res =>
    runFFmpeg(inputPath, outputDir, fileNameWithoutExt, res)
  )
);
const thumbnailPath = await createThumbnail(inputPath,outputDir,newThumbnailPath)

  // Create master playlist
const masterPlaylist =  createMasterPlaylist(outputDir, availableVariants);
  
  fs.unlinkSync(inputPath);
  return {
    variants: availableVariants.map(r => `${r.height}p/index.m3u8`),
    masterPlaylist: masterPlaylist,
    thumbnailPath,
    videoFolderId: outputDir
  };
};

export default processVideo;
