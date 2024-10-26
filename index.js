// app.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer'); // Importar multer
const path = require('path'); // Importar path
require('dotenv').config();

const app = express();
const port = 3000;

// Configuración de multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/imagenes'); // Carpeta donde se guardarán las imágenes
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Renombrar archivo con timestamp
    }
});

const upload = multer({ storage: storage });

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public')); 

// Conectar a MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("Conectado a MongoDB");
    }).catch(err => {
        console.error("Error al conectar a MongoDB:", err);
    });

// Definición de un modelo (Ejemplo para la colección "menu")
const Menu = mongoose.model('Menu', new mongoose.Schema({
    nombre: String,
    descripcion: String,
    precio: Number,
    categoria: String,
    imagen: String 
}));

app.get('/menu', async (req, res) => {
    try {
        const productos = await Menu.find(); // Cambiar Producto a Menu
        res.json(productos);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al obtener los productos');
    }
});

app.post('/menu', upload.single('imagen'), async (req, res) => {
    const { nombre, descripcion, precio, categoria } = req.body;
    const imagen = req.file.filename; // Obtener el nombre del archivo de la imagen

    const nuevoMenu = new Menu({ nombre, descripcion, precio, categoria, imagen });
    try {
        await nuevoMenu.save();
        res.status(201).send('Producto agregado con éxito');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al agregar producto');
    }
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
