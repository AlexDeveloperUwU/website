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

  try {
    const data = await fs.readFile(titlesPath, "utf8");
    const titles = JSON.parse(data);
    const pageTitle = titles[view] || "Web Oficial";
    res.render("main", { view, pageTitle });
  } catch (err) {
    pageTitle = "Web Oficial";
    res.render("main", { view, pageTitle });
  }
});

export default router;
