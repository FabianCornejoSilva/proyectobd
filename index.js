const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const mime = require('mime-types'); // Para obtener el Content-Type
const { S3Client, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
require('dotenv').config();

const app = express();
const port = 3000;

// Configuración de S3
const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

// Configuración de multer para manejar la subida de archivos
const storage = multer.memoryStorage(); // Usar memoria para almacenar archivos temporalmente
const upload = multer({ storage: storage });

// Middleware
app.use(cors());
app.use(express.json());

// Conectar a MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("Conectado a MongoDB");
    })
    .catch(err => {
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
        const categorias = await Categoria.find();
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
        const productos = await Producto.find();
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
            return res.status(400).json({ error: 'Se requiere una imagen para el producto' });
        }

        // Subir la imagen a S3
        const uploadParams = {
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: Date.now().toString() + '-' + req.file.originalname,
            Body: req.file.buffer,
            ACL: 'public-read',
            ContentType: mime.lookup(req.file.originalname) || 'application/octet-stream'
        };
        const command = new PutObjectCommand(uploadParams);
        await s3.send(command);

        // Guardar la URL completa en la base de datos
        const imagenUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${uploadParams.Key}`;

        // Buscar la categoría
        const categoria = await Categoria.findOne({ nombre_categoria: categoriaNombre });
        if (!categoria) {
            return res.status(400).json({ error: 'Categoría no encontrada' });
        }

        // Crear el producto
        const nuevoProducto = new Producto({
            nombre,
            descripcion,
            precio: Number(precio),
            imagen: imagenUrl,
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

// Eliminar un producto y su imagen de S3
app.delete('/productos/:id', async (req, res) => {
    try {
        const producto = await Producto.findById(req.params.id);
        if (!producto) {
            return res.status(404).send('Producto no encontrado');
        }

        // Eliminar la imagen de S3
        const key = producto.imagen.split('/').pop(); // Obtén el Key desde la URL
        const deleteParams = {
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: key
        };
        await s3.send(new DeleteObjectCommand(deleteParams));

        // Eliminar el producto de la base de datos
        await Producto.findByIdAndDelete(req.params.id);

        res.send('Producto eliminado con éxito');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al eliminar el producto');
    }
});

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



// Actualizar un producto
app.put('/productos/:id', upload.single('imagen'), async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, descripcion, precio, categoriaNombre } = req.body;

        const producto = await Producto.findById(id);
        if (!producto) {
            return res.status(404).send('Producto no encontrado');
        }

        let imagenUrl = producto.imagen;

        if (req.file) {
            // Eliminar la imagen anterior de S3
            const key = producto.imagen.split('/').pop();
            const deleteParams = {
                Bucket: process.env.AWS_S3_BUCKET_NAME,
                Key: key
            };
            await s3.send(new DeleteObjectCommand(deleteParams));

            // Subir la nueva imagen a S3
            const uploadParams = {
                Bucket: process.env.AWS_S3_BUCKET_NAME,
                Key: Date.now().toString() + '-' + req.file.originalname,
                Body: req.file.buffer,
                ACL: 'public-read',
                ContentType: mime.lookup(req.file.originalname) || 'application/octet-stream'
            };
            const command = new PutObjectCommand(uploadParams);
            await s3.send(command);

            imagenUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${uploadParams.Key}`;
        }

        const categoria = await Categoria.findOne({ nombre_categoria: categoriaNombre });

        producto.nombre = nombre;
        producto.descripcion = descripcion;
        producto.precio = Number(precio);
        producto.imagen = imagenUrl;
        producto.categoria = categoria ? { id: categoria._id, nombre: categoria.nombre_categoria } : producto.categoria;

        await producto.save();
        res.json(producto);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al actualizar el producto');
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
