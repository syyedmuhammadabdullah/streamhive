import fs from "fs";
import path from "path";

export const createVideoFolder = (fileName: string,uploadTime:string) => {
    const processedFolder=path.join(__dirname,"..","..","processed");
   if (!fs.existsSync(processedFolder)) {
    fs.mkdirSync(processedFolder);
   }
    const safeName = fileName.replace(/\s+/g, '_').replace(/\.[^/.]+$/, ''); // remove extension
    const safeTimestamp = uploadTime.replace(/:/g, '_');
    const videoFolder=path.join(processedFolder,`${safeName}-${safeTimestamp}`);
   if (!fs.existsSync(videoFolder)) {
    fs.mkdirSync(videoFolder);
   }
   return{
    processedFolder,
    videoFolder,
    videoQualityFolder:videoFolder
   }
};

export default createVideoFolder;