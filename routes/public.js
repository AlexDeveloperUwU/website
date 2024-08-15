import express from "express";
import { promises as fs } from "fs"; // Usando `promises` para trabajar con promesas en lugar de callbacks
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const titlesPath = path.resolve(__dirname, "../public/json/titles.json");

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

// Ruta universal, si por lo que sea el user no escribe el ?view=nombreView, entonces hacemos redirect || Mejora de la experiencia del usuario
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
    res.redirect('/error?code=500');  }
});

export default router;
