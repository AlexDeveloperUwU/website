import express from "express";
const router = express.Router();

router.get("/", (req, res) => {
  const view = req.query.view || "index";
  const page = "main"
  res.render("main", {view: view, page: page});
});

export default router;
