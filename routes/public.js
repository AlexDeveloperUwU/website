import express from "express";
const router = express.Router();

router.get("/", (req, res) => {
  const view = req.query.view || "index";
  res.render("main", {view: view});
});

router.get("/test", (req, res) => {
  res.render("test");
});

export default router;
