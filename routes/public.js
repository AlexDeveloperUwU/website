import express from "express";
import { promises as fs } from "fs"; // Usando `promises` para trabajar con promesas en lugar de callbacks
import path from "path";
import { fileURLToPath } from "url";
import { getLinkData } from "../utils/db.js"; // Importa la función para obtener datos del enlace

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const titlesPath = path.resolve(__dirname, "../public/json/titles.json");

// Ruta principal que maneja la visualización de páginas según el parámetro `view`
router.get("/", async (req, res) => {
  const view = req.query.view || "index";

  const extraQueries = { ...req.query };
  delete extraQueries.view;

  try {
    const data = await fs.readFile(titlesPath, "utf8");
    const titles = JSON.parse(data);

    if (titles[view]) {
      const pageTitle = titles[view];
      res.render("main", { view, pageTitle, data: extraQueries });
    } else {
      res.redirect("/error?code=404");
    }
  } catch (err) {
    const pageTitle = "Web Oficial";
    res.render("main", { view: "index", pageTitle, data: extraQueries });
  }
});

// Ruta para manejar los errores
router.get("/error", async (req, res) => {
  const view = req.query.code || "404";

  try {
    const data = await fs.readFile(titlesPath, "utf8");
    const titles = JSON.parse(data);

    if (titles[view]) {
      const pageTitle = titles[view];
      res.render("errors", { view, pageTitle });
    } else {
      res.redirect("/error?code=404");
    }
  } catch (err) {
    const pageTitle = "Web Oficial";
    res.render("errors", { view: "index", pageTitle });
  }
});

// Ruta para manejar redirecciones desde `/l?id=id`
router.get("/l", async (req, res) => {
  const id = req.query.id;

  if (!id) {
    return res.redirect("/error?code=400");
  }

  try {
    const linkData = getLinkData(id);

    if (linkData) {
      res.redirect(linkData.url);
    } else {
      res.redirect("/error?code=404");
    }
  } catch (err) {
    res.redirect("/error?code=500");
  }
});

// Ruta universal para redirigir cuando no se proporciona un `view` válido
router.get("/:viewName", async (req, res) => {
  const viewName = req.params.viewName;

  try {
    const data = await fs.readFile(titlesPath, "utf8");
    const titles = JSON.parse(data);

    if (titles[viewName]) {
      res.redirect(`/?view=${viewName}`);
    } else {
      res.redirect("/error?code=404");
    }
  } catch (err) {
    res.redirect("/error?code=500");
  }
});

export default router;
