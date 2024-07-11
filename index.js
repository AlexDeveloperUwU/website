import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import Enmap from "enmap";

// Configuración del servidor Express
const app = express();
const port = 3000;

// Configuración del directorio y motor de vistas
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware para servir archivos estáticos
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

// Manejador de errores 404
app.use((req, res, next) => {
  const err = new Error("Página no encontrada");
  err.status = 404;
  next(err);
});

// Manejador de errores
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.render("error", {
    error: err,
  });
});

// Rutas del servidor
import publicRoutes from "./routes/public.js";
app.use(publicRoutes);

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
