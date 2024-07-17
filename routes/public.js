import express from "express";
const router = express.Router();

router.get("/", (req, res) => {
  const view = req.query.view || "index";
  const extraData = {twitch: valueTwitch, kick: valueKick};
  res.render("main", {view: view, data: extraData});
});

export default router;
