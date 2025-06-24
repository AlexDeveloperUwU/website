import express, { Request, Response, Router, RequestHandler } from "express";
import { readFile } from "fs/promises";
import { join } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { Project } from "../interfaces/Project.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router: Router = express.Router();

router.get("/projects", (async (req: Request, res: Response) => {
  const lang: string = req.query.lang?.toString() || "es";
  const type: string | undefined = req.query.type?.toString();
  const projectsPath: string = join(__dirname, "..", "assets", "locales", lang, "jsons", "projects.json");

  try {
    const data: string = await readFile(projectsPath, "utf8");
    let projects: Project[] = JSON.parse(data);

    if (type === "homepage") {
      projects = projects.filter((p) => p.homepage);
    }
    res.json(projects);
  } catch (err: any) {
    if (err.code === "ENOENT") {
      return res.status(404).json({ error: "No se encontró el archivo de proyectos para el idioma solicitado." });
    }
    return res.status(500).json({ error: "Error al procesar el archivo de proyectos." });
  }
}) as RequestHandler);

export default router;
