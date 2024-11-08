import express from "express";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import minify from "express-minify";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import fs from "fs";
import rateLimiter from "./serverUtils/js/ratelimiter.js";
import { ensureDirExists, cleanOldLogs, verifyEnvVars } from "./serverUtils/js/startup.js";
import setupAuth from "./serverUtils/js/auth.js";

// Inicialización del servidor Express
const app = express();
const port = 3000;

// Configuración de rutas y archivos del proyecto
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envFilePath = path.join(__dirname, "env", ".env");
const sitesFilePath = path.join(__dirname, "public", "json", "sites.json");

// Cargar variables de entorno
dotenv.config({ path: envFilePath });

// Configuración del motor de plantillas
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware para servir archivos estáticos
app.use(express.static(path.join(__dirname, "public")));

// Configuración de minificación de archivos JS y CSS
const cacheDir = path.join(__dirname, "cache");
ensureDirExists(cacheDir);
app.use(minify({ cache: cacheDir }));

// Configuración para el análisis de cuerpos de solicitudes
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Configuración de compresión de respuestas
app.use(compression());

// Configuración de autenticación con Passport
setupAuth(app);

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

// Lectura de sitios para usar en Helmet
let additionalConnectSrc = [];
try {
  const data = fs.readFileSync(sitesFilePath, "utf8");
  const sites = JSON.parse(data);
  additionalConnectSrc = sites.map((site) => site.url);
} catch (err) {
  console.error("Error al leer o parsear el archivo JSON:", err);
}

// Configuración de seguridad con Helmet
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'", "https://static.cloudflareinsights.com/"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://static.cloudflareinsights.com/"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https://i.ytimg.com"],
      connectSrc: [
        "'self'",
        "https://api.rss2json.com",
        "https://alexdevuwu.com",
        "https://api.lanyard.rest",
        ...additionalConnectSrc,
      ],
      fontSrc: ["'self'"],
      frameSrc: [
        "'self'",
        "https://www.youtube.com",
        "https://www.twitch.tv/",
        "https://player.twitch.tv/",
        "https://kick.com/",
        "https://player.kick.com/",
      ],
    },
  })
);

app.use(helmet.xssFilter());
app.use(helmet.noSniff());
app.use(helmet.frameguard({ action: "deny" }));
app.use(helmet.hsts({ maxAge: 63072000, includeSubDomains: true, preload: true }));
app.disable("x-powered-by");
app.set("trust proxy", 1);

// Middleware de rate limiting
app.use(rateLimiter);

// Middleware de manejo de errores
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  const view = req.query.view || "index";
  res.render("main", { view });
});

// Importación y configuración de rutas
import publicRoutes from "./routes/public.js";
import apiRoutes from "./routes/api.js";
app.use(apiRoutes);
app.use(publicRoutes);

// Verificación de variables de entorno necesarias
const requiredEnvVars = [
  "formWebhookUrl",
  "logsWebhookUrl",
  "discordClientId",
  "discordClientSecret",
  "discordCallbackUrl",
  "sessionSecret",
  "hetrixApiToken",
  "homecoreId",
  "codenexisId",
  "loadrunnerId",
];

verifyEnvVars(requiredEnvVars);

// Inicio del servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
