// import React, { useEffect, useRef, useState } from "react";
// import Hls from "hls.js";

// const VideoPlayer = () => {
//     const videoUrl = "http://localhost:4000/processed/short_video-2025-06-08T15_47_54.087Z/master.m3u8";
//   const videoRef: any = useRef(null);
//   const [level, setLevel] = useState(Hls.levels);

//   useEffect(() => {
//     const hls = new Hls();
//     hls.loadSource(videoUrl);
//     hls.on(Hls.Events.LEVEL_UPDATED, () => {
//       setLevel(hls.levels);
//     });
//     console.log("level", level);
    
//   }, []);

//   useEffect(() => {
//     if (Hls.isSupported()) {
//       const hls = new Hls();
//       hls.loadSource(videoUrl);   // videoUrl = backend se milne wala master.m3u8 ka URL
//       hls.attachMedia(videoRef.current);
//       hls.on(Hls.Events.MANIFEST_PARSED, () => {
//         videoRef.current.play();
//       });
//     } else if (videoRef.current.canPlayType("application/vnd.apple.mpegurl")) {
//       // Safari native support
//       videoRef.current.src = videoUrl;
//       videoRef.current.addEventListener("loadedmetadata", () => {
//         videoRef.current.play();
//       });
//     }
//   }, [videoUrl]);

//   return <video ref={videoRef} controls style={{ width: "100%", maxHeight: "400px" }} />;
// };

// export default VideoPlayer;


import React, { useEffect, useRef, useState } from "react";
import Hls from "hls.js";

const VideoPlayer = () => {
  const videoUrl = "http://localhost:4000/processed/short_video-2025-06-08T15_47_54.087Z/master.m3u8";
  const videoRef: any = useRef(null);
  const hlsRef = useRef<Hls | null>(null); // for global hls reference
  const [levels, setLevels] = useState<any[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<number>(-1); // -1 = Auto

  useEffect(() => {
    if (Hls.isSupported()) {
      const hls = new Hls();
      hlsRef.current = hls;

      hls.loadSource(videoUrl);
      hls.attachMedia(videoRef.current);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setLevels(hls.levels);
        setSelectedLevel(-1); // default to auto
        videoRef.current.play();
      });

      hls.on(Hls.Events.LEVEL_SWITCHED, (event, data) => {
        console.log("Switched to level:", data.level);
      });
    } else if (videoRef.current.canPlayType("application/vnd.apple.mpegurl")) {
      videoRef.current.src = videoUrl;
      videoRef.current.addEventListener("loadedmetadata", () => {
        videoRef.current.play();
      });
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
    };
  }, [videoUrl]);

  const handleQualityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const level = parseInt(e.target.value);
    setSelectedLevel(level);

    if (hlsRef.current) {
      hlsRef.current.currentLevel = level; // -1 means auto
    }
  };

  return (
    <div className="relative w-full max-w-3xl mx-auto">
      <video ref={videoRef} controls className="w-full max-h-[400px]" />

      {levels.length > 0 && (
        <select
          value={selectedLevel}
          onChange={handleQualityChange}
          className="absolute top-2 right-2 z-10 bg-white text-black px-2 py-1 rounded shadow"
        >
          <option value={-1}>Auto</option>
          {levels.map((level, index) => (
            <option key={index} value={index}>
              {level.height}p
            </option>
          ))}
        </select>
      )}
    </div>
  );
};

export default VideoPlayer;
