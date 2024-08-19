import fs from "fs";
import path from "path";

// Función para asegurarse de que un directorio exista
export function ensureDirExists(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
}

// Función para eliminar logs antiguos y conservar solo los últimos `maxFiles`
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

  // Llamar a la función para vaciar la carpeta de caché
  clearCacheDirectory(path.join(directory, "..", "cache"));
}

// Función para vaciar la carpeta de caché
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

// Función para verificar variables de entorno necesarias
export function verifyEnvVars(requiredVars) {
  requiredVars.forEach((varName) => {
    if (!process.env[varName]) {
      throw new Error(`La variable de entorno ${varName} no está definida o no tiene un valor.`);
    }
  });
}
