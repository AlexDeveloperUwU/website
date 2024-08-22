import { promises as fs } from "fs";
import path from "path";
import express from "express";
import { fileURLToPath } from "url";
import { getLink } from "../utils/db.js";

const router = express.Router();

// Convierte import.meta.url a una ruta de sistema de archivos
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Usa __dirname para construir rutas
const contentRoutesPath = path.join(__dirname, "..", "server-utils", "contentRoutes.json");
const adminRoutesPath = path.join(__dirname, "..", "server-utils", "adminRoutes.json");
const errorRoutesPath = path.join(__dirname, "..", "server-utils", "errorRoutes.json");

router.get(["/admin/:viewName", "/admin"], async (req, res) => {
  const viewName = req.params.viewName || req.query.view || "index";

  try {
    const adminRoutesData = await fs.readFile(adminRoutesPath, "utf8");
    const adminRoutes = JSON.parse(adminRoutesData);

    const routeData = adminRoutes.routes.find((route) => route.view === viewName);

    if (routeData) {
      const { title, folder } = routeData;
      res.render("main", { route: folder, view: viewName, title, type: "admin" });
    } else {
      res.redirect("/error?code=404");
    }
  } catch (err) {
    res.redirect("/error?code=500");
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

router.get(["/error/:viewName", "/error"], async (req, res) => {
  const code = req.params.code || req.query.code;

  try {
    const errorRoutesData = await fs.readFile(errorRoutesPath, "utf8");
    const errorRoutes = JSON.parse(errorRoutesData);

    const routeData = errorRoutes.routes.find((route) => route.view === code);

    if (routeData) {
      const { title, folder } = routeData;
      res.render("main", { route: folder, code, title, view: code, type: "error" });
    } else {
      res.redirect("/error?code=500");
    }
  } catch (err) {
    console.error("Error reading or parsing errorRoutes.json:", err);
    res.redirect("/error?code=500");
  }
});

//! ESTA RUTA SIEMPRE DEBE IR AL FINAL
router.get(["/:viewName", "/"], async (req, res) => {
  const viewName = req.params.viewName || req.query.view || "index";

  try {
    const contentRoutesData = await fs.readFile(contentRoutesPath, "utf8");
    const contentRoutes = JSON.parse(contentRoutesData);

    const routeData = contentRoutes.routes.find((route) => route.view === viewName);

    if (routeData) {
      const { title, folder } = routeData;
      res.render("main", { route: folder, view: viewName, title, type: "content" });
    } else {
      res.redirect("/error?code=404");
    }
  } catch (err) {
    res.redirect("/error?code=404");
  }
});

export default router;
