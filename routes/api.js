import express from "express";
import { formSend } from "../utils/webhook.js";
const router = express.Router();

// POST /api/contactForm - Envía un mensaje a Discord con la información del formulario de contacto
router.post("/contactForm", (req, res) => {
  formSend(req.body);
  res.status(200).json({ message: "Datos del formulario recibidos correctamente." });
});

export default router;
