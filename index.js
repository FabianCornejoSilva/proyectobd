const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const port = 3000;

// Configuración de multer para manejar la subida de archivos
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, 'public/imagenes/menu'));
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ 
    storage: storage,
    fileFilter: function (req, file, cb) {
        if (!file) {
            return cb(null, false);
        }
        cb(null, true);
    }
});

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
    categoria: {
        id: { type: mongoose.Schema.Types.ObjectId, ref: 'Categoria' },
        nombre: String 
    },
    imagen: String,
    enMenu: { type: Boolean, default: false } 
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
    try {
        const { nombre, descripcion, precio, categoriaNombre } = req.body;

        if (!req.file) {
            return res.status(400).json({ 
                error: 'Se requiere una imagen para el producto' 
            });
        }

        const imagen = req.file.filename;
        
        // Encontrar la categoría
        const categoria = await Categoria.findOne({ nombre_categoria: categoriaNombre });
        if (!categoria) {
            return res.status(400).json({ error: 'Categoría no encontrada' });
        }

        const nuevoProducto = new Producto({
            nombre,
            descripcion,
            precio: Number(precio),
            imagen,
            categoria: {
                id: categoria._id,
                nombre: categoria.nombre_categoria
            },
            enMenu: false
        });

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

// Agregar esta ruta en tu archivo del servidor
app.put('/categorias/:id', async (req, res) => {
    const { id } = req.params;
    const { nombre_categoria } = req.body;

    try {
        // Verificar si el nuevo nombre ya existe en otra categoría
        const categoriaExistente = await Categoria.findOne({
            _id: { $ne: id }, // excluir la categoría actual
            nombre_categoria: { 
                $regex: new RegExp(`^${nombre_categoria}$`, 'i') 
            }
        });

        if (categoriaExistente) {
            return res.status(400).json({ 
                error: 'Ya existe una categoría con este nombre' 
            });
        }

        const categoriaActualizada = await Categoria.findByIdAndUpdate(
            id,
            { nombre_categoria },
            { new: true }
        );

        if (!categoriaActualizada) {
            return res.status(404).json({ 
                error: 'Categoría no encontrada' 
            });
        }

        res.json(categoriaActualizada);
    } catch (err) {
        console.error(err);
        res.status(500).json({ 
            error: 'Error al actualizar la categoría' 
        });
    }
});

// Ruta PUT para actualizar productos
app.put('/productos/:id', upload.single('imagen'), async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, descripcion, precio, categoriaNombre } = req.body;
        
        console.log('Datos recibidos:', req.body); // Para debug

        // Encontrar la categoría por nombre
        const categoria = await Categoria.findOne({ nombre_categoria: categoriaNombre });
        
        const updateData = {
            nombre,
            descripcion,
            precio: Number(precio),
            categoria: {
                id: categoria ? categoria._id : null,
                nombre: categoriaNombre
            }
        };

        // Verificar si hay una nueva imagen
        if (req.file) {
            // Eliminar la imagen anterior
            const productoAnterior = await Producto.findById(id);
            if (productoAnterior && productoAnterior.imagen) {
                const imagePath = path.join(__dirname, 'public', 'imagenes', 'menu', productoAnterior.imagen);
                try {
                    await fs.promises.unlink(imagePath);
                } catch (err) {
                    console.error("Error al eliminar la imagen anterior:", err);
                }
            }
            updateData.imagen = req.file.filename;
        }

        console.log('Datos a actualizar:', updateData); // Para debug

        const productoActualizado = await Producto.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!productoActualizado) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        console.log('Producto actualizado:', productoActualizado); // Para debug
        res.json(productoActualizado);
    } catch (error) {
        console.error('Error al actualizar el producto:', error);
        res.status(500).json({ 
            error: 'Error al actualizar el producto',
            details: error.message 
        });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK' });
});

// Manejo de errores global
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Error interno del servidor',
        details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Manejo de proceso
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    // Registrar el error pero mantener el servidor funcionando
});

process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err);
    // Registrar el error pero mantener el servidor funcionando
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});