import e from "express";

const app = e();
const PORT = 3000;

app.get('/', (req, res) => {
  res.json({ mensaje: "Bienvenido a la API básica de Express" });
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});