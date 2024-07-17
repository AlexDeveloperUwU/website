import express from "express";
const router = express.Router();

router.get("/", (req, res) => {
  const view = req.query.view || "index";
  res.render("main", {view: view});
});

export default router;
