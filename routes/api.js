import express from "express";
import basicAuth from "basic-auth";
import { apiAlert, formSend } from "../utils/webhook.js";
import { validationResult } from "express-validator";
import { validateEvent, validateEventId } from "../utils/validator.js";
import { addEvent, removeEvent, getAllEvents, getAllEventsId } from "../utils/db.js";
const router = express.Router();

const authenticate = (req, res, next) => {
  const user = basicAuth(req);
  const username = process.env.authUser;
  const password = process.env.authPass;

  if (!user || user.name !== username || user.pass !== password) {
    res.set("WWW-Authenticate", 'Basic realm="401"');
    return res.status(401).json({ error: "Unauthorized" });
  }

  next();
};

router.post("/contactForm", (req, res) => {
  formSend(req.body);
  res.status(200).json({ message: "Datos del formulario recibidos correctamente." });
});

router.post("/addEvent", authenticate, validateEvent, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const event = req.body;
  const id = addEvent(event);
  apiAlert("eventAdded", { id, date: event.date, time: event.time });
  res.status(200).json({ message: `Event with ID ${id} added succesfully` });
});

router.post("/removeEvent", authenticate, validateEventId, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

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

export default router;
