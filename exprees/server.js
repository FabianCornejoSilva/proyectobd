require('dotenv').config(); // Para usar variables de entorno
const express = require('express');
const { Pool } = require('pg'); // Cliente de PostgreSQL

// Crear una instancia de Express
const app = express();
const port = 3000;

// Configurar la conexión a PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Usamos la variable de entorno para la URL
});

// Ruta de prueba para verificar la conexión
app.get('/usuario', async (req, res) => {
  try {
    console.log("Intentando conectarse a la base de datos...");
    const result = await pool.query('SELECT * FROM usuario');
    console.log("Resultado de la consulta:", result.rows);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener los usuarios' });
  }
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});