import express from "express";
const router = express.Router();

router.get("/", (req, res) => {
  res.render("frontpage/index");
});

export default router;
