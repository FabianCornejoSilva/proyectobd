const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
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

// Definición del modelo para Productos
const Producto = mongoose.model('Producto', new mongoose.Schema({
    nombre: String,
    descripcion: String,
    precio: Number,
    categoria: { type: mongoose.Schema.Types.ObjectId, ref: 'Categoria' }, // Referencia a la categoría
    imagen: String 
}));

// Definición del modelo para Categorías
const Categoria = mongoose.model('Categoria', new mongoose.Schema({
    nombre_categoria: String
}));

// Obtener todas las categorías
app.get('/categorias', async (req, res) => {
    try {
        const categorias = await Categoria.find(); // Obtener todas las categorías
        res.json(categorias);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al obtener las categorías');
    }
});

// Agregar una nueva categoría
app.post('/categorias', async (req, res) => {
    const { nombre_categoria } = req.body;

    const nuevaCategoria = new Categoria({ nombre_categoria });
    try {
        await nuevaCategoria.save();
        res.status(201).send('Categoría agregada con éxito');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al agregar categoría');
    }
});


// Obtener todos los productos
app.get('/productos', async (req, res) => {
    try {
        const productos = await Producto.find().populate('categoria'); // Obtener productos y llenar la categoría
        res.json(productos);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al obtener los productos');
    }
});

// Agregar un nuevo producto
app.post('/productos', upload.single('imagen'), async (req, res) => {
    const { nombre, descripcion, precio, categoria } = req.body;
    const imagen = req.file.filename; // Obtener el nombre del archivo de la imagen

    const nuevoProducto = new Producto({ nombre, descripcion, precio, categoria, imagen });
    try {
        await nuevoProducto.save();
        res.status(201).send('Producto agregado con éxito');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al agregar producto');
    }
});

// Eliminar un producto
app.delete('/productos/:id', async (req, res) => {
    try {
        await Producto.findByIdAndDelete(req.params.id);
        res.send('Producto eliminado con éxito');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al eliminar el producto');
    }
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
