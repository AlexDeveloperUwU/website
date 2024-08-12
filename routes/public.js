import express from "express";
const router = express.Router();

// Un poco xD tener un fichero para una sola ruta, pero bueno, maybe en el futuro me hacen falta más 
router.get("/", (req, res) => {
  const view = req.query.view || "index";
  res.render("main", { view: view });
});

export default router;
