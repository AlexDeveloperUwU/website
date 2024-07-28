import { body, param } from "express-validator";

export const validateEvent = [
  body("date").isISO8601().withMessage("Date must be in the format YYYY-MM-DD"),
  body("time")
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .withMessage("Time must be in the format HH:MM"),
  body("type")
    .isIn(["Twitch", "YouTube", "Multistream"])
    .withMessage("Type must be Twitch, YouTube, or Multistream"),
  body("description").isString().withMessage("Description must be a string"),
];

export const validateEventId = [
  body("id")
    .matches(/^[A-Z0-9]{6}$/)
    .withMessage(
      "Event ID must be a string of 6 characters containing only uppercase letters and numbers"
    ),
];
