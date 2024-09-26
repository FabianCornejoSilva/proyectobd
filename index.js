const express = require('express');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const port = 3000;

// Configuración de la conexión a PostgreSQL
const pool = new Pool({
    connectionString: process.env.DATABASE_URL, // Usamos la variable de entorno para la URL
});

// Middleware para servir archivos estáticos y parsear JSON
app.use(express.static('public'));
app.use(express.json());

// Ruta principal
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

// Ruta para obtener datos desde la base de datos

app.get('/data1', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM usuario');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al obtener datos');
  }
});




app.get('/data2', async (req, res) => {
  try {
    const result = await pool.query('SELECT usuario.nombre, usuario.correo, pedido.estado_pedido, pedido.fecha_pedido FROM usuario JOIN pedido ON usuario.id_usuario = pedido.id_usuario');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al obtener datos');
  }
});

app.get('/data3', async (req, res) => {
  try {
    const result = await pool.query('SELECT producto.descripcion, producto.precio, categoria.nombre_categoria FROM producto JOIN categoria ON producto.id_categoria = categoria.id_categoria;');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al obtener datos');
  }
});


// Inicia el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
