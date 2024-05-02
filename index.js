const express = require('express');
const path = require('path');

const app = express();

// Configuración del motor de plantillas EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Configuración de archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Ruta para servir la página principal
app.get('/', (req, res) => {
  res.render('index');
});

// Puerto en el que se ejecutará el servidor
const PORT = process.env.PORT || 80;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
