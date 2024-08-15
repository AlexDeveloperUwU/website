import express from "express";
import basicAuth from "basic-auth";
import { apiAlert, formSend } from "../utils/webhook.js";
import {
  addEvent,
  removeEvent,
  getAllEvents,
  addLink,
  updateLink,
  removeLink,
  getLinkData,
  getAllLinks,
} from "../utils/db.js";

const router = express.Router();

const authenticate = (req, res, next) => {
  const user = basicAuth(req);
  const username = process.env.authUser;
  const password = process.env.authPass;

  if (!user || user.name !== username || user.pass !== password) {
    res.set("WWW-Authenticate", 'Basic realm="401"');
    return res.redirect("/error?code=401");
  }

  next();
};

// Rutas del calendario
router.post("/contactForm", (req, res) => {
  formSend(req.body);
  res.status(200).json({ message: "Datos del formulario recibidos correctamente." });
});

router.post("/addEvent", authenticate, (req, res) => {
  const event = req.body;
  const id = addEvent(event);
  apiAlert("eventAdded", { id, date: event.date, time: event.time });
  res.status(200).json({ message: `Event with ID ${id} added successfully` });
});

router.post("/removeEvent", authenticate, (req, res) => {
  const event = req.body;
  const result = removeEvent(event);
  if (result) {
    res.status(200).json({ message: "Event removed successfully" });
    apiAlert("eventRemoved", { id: event.id, date: event.date, time: event.time });
  } else {
    res.status(404).json({ error: "Event not found" });
  }
});

router.get("/allEvents", (req, res) => {
  const events = getAllEvents("simple");
  res.status(200).json(events);
});

router.get("/manageAllEvents", (req, res) => {
  const events = getAllEvents("full");
  res.status(200).json(events);
});

// Rutas del acortador de enlaces

router.post("/createLink", authenticate, (req, res) => {
  const linkData = req.body;
  const id = linkData.id || addLink(linkData);
  res.status(200).json({ message: `Link with ID ${id} created successfully`, id });
});

router.post("/editLink", authenticate, (req, res) => {
  const linkData = req.body;
  const result = updateLink(linkData);
  if (result) {
    res.status(200).json({ message: "Link updated successfully" });
  } else {
    res.status(404).json({ error: "Link not found" });
  }
});

router.post("/removeLink", authenticate, (req, res) => {
  const { id } = req.body;
  const result = removeLink(id);
  if (result) {
    res.status(200).json({ message: "Link removed successfully" });
  } else {
    res.status(404).json({ error: "Link not found" });
  }
});

router.get("/manageAllLinks", (req, res) => {
  const links = getAllLinks(); 
  res.status(200).json(links);
});

export default router;
