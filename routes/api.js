import express from "express";
import { apiAlert, formSend } from "../serverUtils/js/webhook.js";
import {
  addEvent,
  removeEvent,
  getAllEvents,
  addLink,
  editLink,
  removeLink,
  getAllLinks,
  getLink,
} from "../serverUtils/js/db.js";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";
import axios from "axios";

const envPath = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "..", "env", ".env");
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
  formSend(req.body);
  res.status(200).json({ message: "Datos del formulario recibidos correctamente." });
});

// Ruta para obtener todos los eventos (solo información básica)
router.get("/allEvents", (req, res) => {
  const events = getAllEvents("simple");
  res.status(200).json(events);
});

// Ruta para obtener todos los links
router.get("/allLinks", (req, res) => {
  const links = getAllLinks();
  res.status(200).json(links);
});

//* Rutas protegidas

// Ruta para añadir un evento
router.post("/addEvent", authenticateDiscord, (req, res) => {
  const event = req.body;
  const id = addEvent(event);
  apiAlert("eventAdded", { id, date: event.date, time: event.time });
  res.status(200).json({ message: `Event with ID ${id} added successfully` });
});

// Ruta para eliminar un evento
router.post("/removeEvent", authenticateDiscord, (req, res) => {
  const event = req.body;
  const result = removeEvent(event);
  if (result) {
    res.status(200).json({ message: "Event removed successfully" });
    apiAlert("eventRemoved", { id: event.id, date: event.date, time: event.time });
  } else {
    res.status(404).json({ error: "Event not found" });
  }
});

// Ruta para gestionar todos los eventos (información completa)
router.get("/manageAllEvents", authenticateDiscord, (req, res) => {
  const events = getAllEvents("full");
  res.status(200).json(events);
});

// Ruta para añadir un link
router.post("/addLink", authenticateDiscord, (req, res) => {
  const { id, url } = req.body;
  const result = addLink(id, url);

  if (result === false) {
    res.status(400).json({ message: `Link with ID ${id} already exists` });
  } else if (typeof result === "string") {
    res.status(200).json({ message: `Link added successfully with generated ID ${result}` });
    apiAlert("linkAdded", { id: result, url });
  } else {
    res.status(200).json({ message: `Link with ID ${id} added successfully` });
    apiAlert("linkAdded", { id, url });
  }
});

// Ruta para editar un link existente
router.post("/editLink", authenticateDiscord, (req, res) => {
  const { id, url } = req.body;
  const result = editLink(id, url);
  if (result === false) {
    res.status(404).json({ message: `Link with ID ${id} not found` });
  } else {
    res.status(200).json({ message: `Link with ID ${id} edited successfully` });
    apiAlert("linkEdited", { id, url });
  }
});

// Ruta para eliminar un link
router.post("/removeLink", authenticateDiscord, (req, res) => {
  const { id } = req.body;
  const url = getLink(id);
  const result = removeLink(id);
  if (result === false) {
    res.status(404).json({ message: `Link with ID ${id} not found` });
  } else {
    res.status(200).json({ message: `Link with ID ${id} removed successfully` });
    apiAlert("linkRemoved", { id, url });
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

export default router;
