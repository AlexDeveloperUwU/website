import express from "express";
import * as webhook from "../serverUtils/js/webhook.js";
import * as db from "../serverUtils/js/db.js";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import fs from "fs";
import path from "path";
import axios from "axios";

const envPath = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "..", "env", ".env");
const logsDirectory = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "logs");
dotenv.config({ path: envPath });

const router = express.Router();

// Middleware de autenticación para Discord
const authenticateDiscord = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/auth/discord");
};

//* Rutas públicas

// Ruta para el formulario de contacto
router.post("/contactForm", (req, res) => {
  webhook.formSend(req.body);
  res.status(200).json({ message: "Datos del formulario recibidos correctamente." });
});

// Ruta para obtener todos los eventos (solo información básica)
router.get("/allEvents", (req, res) => {
  const events = db.getAllEvents("simple");
  res.status(200).json(events);
});

// Ruta para obtener todos los links
router.get("/allLinks", (req, res) => {
  const links = db.getAllLinks();
  res.status(200).json(links);
});

//* Rutas protegidas

// Ruta para añadir un evento
router.post("/addEvent", authenticateDiscord, (req, res) => {
  const event = req.body;
  const id = db.addEvent(event);
  webhook.apiAlert("eventAdded", { id, date: event.date, time: event.time });
  res.status(200).json({ message: `Event with ID ${id} added successfully` });
});

// Ruta para eliminar un evento
router.post("/removeEvent", authenticateDiscord, (req, res) => {
  const event = req.body;
  const result = db.removeEvent(event);
  if (result) {
    res.status(200).json({ message: "Event removed successfully" });
    webhook.apiAlert("eventRemoved", { id: event.id, date: event.date, time: event.time });
  } else {
    res.status(404).json({ error: "Event not found" });
  }
});

// Ruta para gestionar todos los eventos (información completa)
router.get("/manageAllEvents", authenticateDiscord, (req, res) => {
  const events = db.getAllEvents("full");
  res.status(200).json(events);
});

// Ruta para añadir un link
router.post("/addLink", authenticateDiscord, (req, res) => {
  const { id, url } = req.body;
  const result = db.addLink(id, url);

  if (result === false) {
    res.status(400).json({ message: `Link with ID ${id} already exists` });
  } else if (typeof result === "string") {
    res.status(200).json({ message: `Link added successfully with generated ID ${result}` });
    webhook.apiAlert("linkAdded", { id: result, url });
  } else {
    res.status(200).json({ message: `Link with ID ${id} added successfully` });
    webhook.apiAlert("linkAdded", { id, url });
  }
});

// Ruta para editar un link existente
router.post("/editLink", authenticateDiscord, (req, res) => {
  const { id, url } = req.body;
  const result = db.editLink(id, url);
  if (result === false) {
    res.status(404).json({ message: `Link with ID ${id} not found` });
  } else {
    res.status(200).json({ message: `Link with ID ${id} edited successfully` });
    webhook.apiAlert("linkEdited", { id, url });
  }
});

// Ruta para eliminar un link
router.post("/removeLink", authenticateDiscord, (req, res) => {
  const { id } = req.body;
  const url = db.getLink(id);
  const result = db.removeLink(id);
  if (result === false) {
    res.status(404).json({ message: `Link with ID ${id} not found` });
  } else {
    res.status(200).json({ message: `Link with ID ${id} removed successfully` });
    webhook.apiAlert("linkRemoved", { id, url });
  }
});

router.get("/serverStats", async (req, res) => {
  try {
    const urls = {
      homecore: `https://api.hetrixtools.com/v1/${process.env.hetrixApiToken}/server/stats/${process.env.homecoreId}/`,
      codenexis: `https://api.hetrixtools.com/v1/${process.env.hetrixApiToken}/server/stats/${process.env.codenexisId}/`,
      loadrunner: `https://api.hetrixtools.com/v1/${process.env.hetrixApiToken}/server/stats/${process.env.loadrunnerId}/`,
    };

    const [homecoreResponse, codenexisResponse, loadrunnerResponse] = await Promise.all([
      axios.get(urls.homecore),
      axios.get(urls.codenexis),
      axios.get(urls.loadrunner),
    ]);

    const filterStats = (stats) => {
      const { Minute, IOWait, Swap, NetIn, NetOut, ...filteredStats } = stats;
      return filteredStats;
    };

    const combinedStats = {
      HomeCore: filterStats(homecoreResponse.data.Stats[0]),
      CodeNexis: filterStats(codenexisResponse.data.Stats[0]),
      LoadRunner: filterStats(loadrunnerResponse.data.Stats[0]),
    };

    res.json(combinedStats);
  } catch (error) {
    console.error("Error fetching server stats:", error);

    if (error.response) {
      res.status(error.response.status).send(error.response.data);
    } else {
      res.status(500).send("Error fetching server stats");
    }
  }
});

router.get("/latestLog", authenticateDiscord, async (req, res) => {
  try {
    const files = fs.readdirSync(logsDirectory);
    const logFiles = files.filter((file) => file.endsWith(".log"));

    if (logFiles.length === 0) {
      return res.status(404).json({ message: "No log files found" });
    }

    logFiles.sort((a, b) => {
      const aPath = path.join(logsDirectory, a);
      const bPath = path.join(logsDirectory, b);
      return fs.statSync(bPath).mtime - fs.statSync(aPath).mtime;
    });

    const latestLogFile = logFiles[0];
    const latestLogFilePath = path.join(logsDirectory, latestLogFile);

    let logContent = fs.readFileSync(latestLogFilePath, "utf-8");

    logContent = logContent
      .split("\n")
      .filter(line => !line.includes("HetrixTools Uptime Monitoring Bot. https://hetrix.tools/uptime-monitoring-bot.html"))
      .join("\n");

    res.setHeader("Content-Type", "text/plain");
    res.status(200).send(logContent);
  } catch (error) {
    console.error("Error fetching latest log file:", error);
    res.status(500).json({ message: "Error fetching latest log file" });
  }
});

export default router;
