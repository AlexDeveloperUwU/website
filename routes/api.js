import express from "express";
import { apiAlert, formSend } from "../utils/webhook.js";
import {
  addEvent,
  removeEvent,
  getAllEvents,
  addLink,
  editLink,
  removeLink,
  getAllLinks,
  getLink,
} from "../utils/db.js";

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

export default router;
