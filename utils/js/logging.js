import fs from "fs";
import path from "path";
import morgan from "morgan";
import { ensureDirExists, cleanOldLogs } from "./startup.js";

export function setupLogging(app, __dirname) {
  // Configuración del directorio y archivo de logs
  const logDir = path.join(__dirname, "logs");
  ensureDirExists(logDir);

  // Obtener timestamp en formato humano para el archivo de log
  const now = new Date();
  const formatNumber = (num) => num.toString().padStart(2, "0");
  const timestamp = `${now.getFullYear()}-${formatNumber(now.getMonth() + 1)}-${formatNumber(
    now.getDate()
  )}_${formatNumber(now.getHours())}-${formatNumber(now.getMinutes())}`;
  const logFileName = `${timestamp}.log`;
  const accessLogStream = fs.createWriteStream(path.join(logDir, logFileName), { flags: "a" });

  // Configuración de los logs de acceso
  app.use(morgan("combined", { stream: accessLogStream }));

  // Llamar a la función para limpiar los logs antiguos
  cleanOldLogs(logDir, 5);
}
