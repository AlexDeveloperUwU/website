import express from "express";
import { promises as fs } from "fs"; // Usando `promises` para trabajar con promesas en lugar de callbacks
import path from "path";
import { fileURLToPath } from "url";
import { getLink } from "../utils/db.js";

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const titlesPath = path.resolve(__dirname, "../public/json/titles.json");

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

// Ruta para manejar redirecciones
router.get("/l/:id?", async (req, res) => {
  const id = req.params.id || req.query.id;

  if (!id) {
    return res.redirect("/error?code=400");
  }

  try {
    let linkData = getLink(id);

    if (linkData) {
      const destinationUrl = new URL(linkData);
      destinationUrl.searchParams.set("referrer", "alexdevuwu.com");

      if (
        destinationUrl.hostname === "www.youtube.com" ||
        destinationUrl.hostname === "youtube.com"
      ) {
        res.setHeader("X-Robots-Tag", "noindex, nofollow");
        res.setHeader("Referrer-Policy", "no-referrer");
      } else {
        res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
      }

      res.redirect(destinationUrl.toString());
    } else {
      res.redirect("/error?code=404");
    }
  } catch (err) {
    res.redirect("/error?code=500");
  }
});

// Ruta para el archivo robots.txt
router.get("/robots.txt", (req, res) => {
  res.status(404).end();
});

// Ruta universal para redirigir cuando no se proporciona un `view` válido
router.get(["/:viewName", "/"], async (req, res) => {
  const viewName = req.params.viewName || req.query.view || "index";

  const extraQueries = { ...req.query };
  delete extraQueries.view;

  try {
    const data = await fs.readFile(titlesPath, "utf8");
    const titles = JSON.parse(data);

    if (titles[viewName]) {
      if (req.params.viewName) {
        res.redirect(`/?view=${viewName}`);
      } else {
        const pageTitle = titles[viewName];
        res.render("main", { view: viewName, pageTitle, data: extraQueries });
      }
    } else {
      res.redirect("/error?code=404");
    }
  } catch (err) {
    res.redirect("/error?code=500");
  }
});

export default router;
