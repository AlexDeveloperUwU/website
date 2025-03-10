import express from "express";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import minify from "express-minify";
import compression from "compression";
import rateLimiter from "./utils/js/ratelimiter.js";
import { ensureDirExists} from "./utils/js/startup.js";
import setupAuth from "./utils/js/auth.js";
import { setupLogging } from "./utils/js/logging.js";
import setupHelmet from "./utils/js/helmet.js";

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
setupLogging(app, __dirname);

// Configuración de seguridad con Helmet
setupHelmet(app, sitesFilePath);

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

// Inicio del servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
