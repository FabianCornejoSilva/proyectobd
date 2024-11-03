const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const port = 3000;

// Configuración de multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/imagenes/menu'); // Carpeta donde se guardarán las imágenes
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
// Definición del modelo para Productos
const Producto = mongoose.model('Producto', new mongoose.Schema({
    nombre: String,
    descripcion: String,
    precio: Number,
    categoria: {
        id: { type: mongoose.Schema.Types.ObjectId, ref: 'Categoria' }, // Referencia a la categoría
        nombre: String // Campo adicional para el nombre de la categoría
    },
    imagen: String,
    enMenu: { type: Boolean, default: false } // Nuevo campo para el menú
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

// Eliminar una categoría
app.delete('/categorias/:id', async (req, res) => {
    try {
        await Categoria.findByIdAndDelete(req.params.id);
        res.send('Categoría eliminada con éxito');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al eliminar la categoría');
    }
});

// Obtener todos los productos
app.get('/productos', async (req, res) => {
    try {
        const productos = await Producto.find(); // Ya no necesitas .populate() porque tienes el nombre de la categoría en el producto
        res.json(productos);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al obtener los productos');
    }
});

// Agregar un nuevo producto
app.post('/productos', upload.single('imagen'), async (req, res) => {
    const { nombre, descripcion, precio, categoriaId, categoriaNombre } = req.body;
    const imagen = req.file.filename; // Obtener el nombre del archivo de la imagen

    const nuevoProducto = new Producto({
        nombre,
        descripcion,
        precio,
        categoria: {
            id: categoriaId, // ID de la categoría
            nombre: categoriaNombre // Nombre de la categoría
        },
        imagen
    });
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
        // Busca el producto en la base de datos
        const producto = await Producto.findById(req.params.id);
        if (!producto) {
            return res.status(404).send('Producto no encontrado');
        }

        // Elimina el producto de la base de datos
        await Producto.findByIdAndDelete(req.params.id);
        
        // Construir la ruta de la imagen a eliminar
        const imagePath = path.join(__dirname, 'public', 'imagenes','menu', producto.imagen);

        // Eliminar el archivo de imagen
        fs.unlink(imagePath, (err) => {
            if (err) {
                console.error("Error al eliminar la imagen:", err);
                return res.status(500).json({ message: "Error al eliminar la imagen" });
            }
            return res.status(200).json({ message: "Producto y su imagen eliminados correctamente" });
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al eliminar el producto');
    } // Aquí cerramos el bloque try-catch
}); // Aquí cerramos el manejador de ruta

// Actualizar un producto
app.patch('/productos/:id/toggleMenu', async (req, res) => {
    const { id } = req.params;
    try {
        const producto = await Producto.findById(id);
        if (!producto) {
            return res.status(404).send('Producto no encontrado');
        }
        producto.enMenu = !producto.enMenu; // Alternar el estado
        await producto.save();
        res.json(producto);
    } catch (error) {
        res.status(500).send('Error al actualizar el producto');
    }
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
