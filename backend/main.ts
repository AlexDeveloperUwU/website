import express, { Request, Response, Application } from "express";
import apiRouter from "./routes/api.js";

const app: Application = express();
const PORT: number = 3000;

app.get('/', (req: Request, res: Response) => {
  res.json({ mensaje: "Bienvenido a la API básica de Express" });
});

app.use("/api", apiRouter);

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
