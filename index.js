// Importación de módulos necesarios
import express from "express";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import minify from "express-minify";
import helmet from "helmet";
import morgan from "morgan";
import fs from "fs";

// Inicialización del servidor Express
const app = express();
const port = 3000;

// Configuración de rutas y archivos del proyecto
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envFilePath = path.join(__dirname, "env", ".env");

// Cargar variables de entorno
dotenv.config({ path: envFilePath });

// Configuración del motor de plantillas
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware para servir archivos estáticos
app.use(express.static(path.join(__dirname, "public")));

// Configuración de minificación de archivos JS y CSS
const cacheDir = path.join(__dirname, "cache");
if (!fs.existsSync(cacheDir)) {
  fs.mkdirSync(cacheDir);
}
app.use(minify({ cache: cacheDir }));

// Configuración para el análisis de cuerpos de solicitudes
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Configuración para manejar proxies
app.enable("trust proxy");

// Configuración del directorio y archivo de logs
const logDir = path.join(__dirname, "logs");
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// Obtener timestamp en formato humano para el archivo de log
const now = new Date();
const formatNumber = (num) => num.toString().padStart(2, "0");
const timestamp = `${now.getFullYear()}-${formatNumber(now.getMonth() + 1)}-${formatNumber(
  now.getDate()
)}_${formatNumber(now.getHours())}-${formatNumber(now.getMinutes())}`;
const logFileName = `${timestamp}.log`;
const accessLogStream = fs.createWriteStream(path.join(logDir, logFileName), { flags: "a" });
app.use(morgan("combined", { stream: accessLogStream }));

// Configuración de seguridad con Helmet
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
    },
  })
);
app.disable("x-powered-by");

// Middleware de manejo de errores
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  const view = req.query.view || "index";
  res.render("main", { view });
});

// Importación y configuración de rutas
import publicRoutes from "./routes/public.js";
import apiRoutes from "./routes/api.js";
app.use(publicRoutes);
app.use(apiRoutes);

// Verificación de variables de entorno necesarias
const requiredEnvVars = ["formWebhookUrl", "logsWebhookUrl", "authUser", "authPass"];
requiredEnvVars.forEach((varName) => {
  if (!process.env[varName]) {
    throw new Error(`La variable de entorno ${varName} no está definida o no tiene un valor.`);
  }
});

// Inicio del servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
