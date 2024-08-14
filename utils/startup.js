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

    // Filtrar solo archivos .log y ordenarlos por fecha de creación
    const logFiles = files
      .filter((file) => file.endsWith(".log"))
      .map((file) => ({
        name: file,
        time: fs.statSync(path.join(directory, file)).mtime.getTime(),
      }))
      .sort((a, b) => b.time - a.time); // Ordenar de más reciente a más antiguo

    // Eliminar logs antiguos si hay más de `maxFiles`
    if (logFiles.length > maxFiles) {
      const filesToDelete = logFiles.slice(maxFiles);
      filesToDelete.forEach((file) => {
        fs.unlinkSync(path.join(directory, file.name));
      });
    }
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
