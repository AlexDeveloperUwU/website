import express from "express";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import minify from "express-minify";

// Configuración del servidor Express
const app = express();
const port = 3000;

// Configuración del directorio y motor de vistas
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envFilePath = path.join(__dirname, "env", ".env");
dotenv.config({ path: envFilePath });

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware para servir archivos estáticos
app.use(express.static(path.join(__dirname, "public")));

// Minificación de archivos JS y CSS
app.use(
  minify({
    cache: path.join(__dirname, "cache"),
  })
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.disable("x-powered-by");

// Manejador de errores
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  const view = req.query.view || "index";
  res.render("main", { view: view });
});

// Rutas del servidor
import publicRoutes from "./routes/public.js";
app.use(publicRoutes);

import apiRoutes from "./routes/api.js";
app.use(apiRoutes);

// Verificar que las variables de entorno necesarias estén definidas
const requiredEnvVars = ["formWebhookUrl", "logsWebhookUrl", "authUser", "authPass"];
requiredEnvVars.forEach((varName) => {
  if (!process.env[varName]) {
    throw new Error(`La variable de entorno ${varName} no está definida o no tiene un valor.`);
  }
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
