import fs from "fs";
import path from "path";

export function ensureDirExists(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
}

export function cleanOldLogs(directory, maxFiles) {
  fs.readdir(directory, (err, files) => {
    if (err) {
      console.error("Error leyendo el directorio de logs:", err);
      return;
    }

    const logFiles = files
      .filter((file) => file.endsWith(".log"))
      .map((file) => ({
        name: file,
        time: fs.statSync(path.join(directory, file)).mtime.getTime(),
      }))
      .sort((a, b) => b.time - a.time);

    if (logFiles.length > maxFiles) {
      const filesToDelete = logFiles.slice(maxFiles);
      filesToDelete.forEach((file) => {
        fs.unlinkSync(path.join(directory, file.name));
      });
    }
  });

  clearCacheDirectory(path.join(directory, "..", "cache"));
}

export function clearCacheDirectory(cacheDir) {
  fs.readdir(cacheDir, (err, files) => {
    if (err) {
      console.error("Error leyendo la carpeta de caché:", err);
      return;
    }

    files.forEach((file) => {
      fs.unlinkSync(path.join(cacheDir, file));
    });
  });
}