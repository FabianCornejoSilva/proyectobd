// pages/crearmenu.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CrearMenu = () => {
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [precio, setPrecio] = useState('');
    const [categoria, setCategoria] = useState('');
    const [imagen, setImagen] = useState(null);
    const [productos, setProductos] = useState([]);

    useEffect(() => {
        const fetchProductos = async () => {
            const response = await axios.get('http://localhost:3000/menu');
            setProductos(response.data);
        };
        fetchProductos();
    }, []);

    const handleNombreChange = (e) => setNombre(e.target.value);
    const handleDescripcionChange = (e) => setDescripcion(e.target.value);
    const handlePrecioChange = (e) => setPrecio(e.target.value);
    const handleCategoriaChange = (e) => setCategoria(e.target.value);
    const handleImagenChange = (e) => setImagen(e.target.files[0]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('nombre', nombre);
        formData.append('descripcion', descripcion);
        formData.append('precio', precio);
        formData.append('categoria', categoria);
        formData.append('imagen', imagen);

        try {
            await axios.post('http://localhost:3000/menu', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            alert('Producto agregado con éxito');
            setNombre('');
            setDescripcion('');
            setPrecio('');
            setCategoria('');
            setImagen(null);
        } catch (error) {
            console.error('Error al agregar el producto:', error);
            alert('Hubo un error al agregar el producto');
        }
    };

    return (
        <div>
            <h1>Crear Menú</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Nombre del Producto:
                    <input type="text" value={nombre} onChange={handleNombreChange} required />
                </label>
                <br />
                <label>
                    Descripción del Producto:
                    <input type="text" value={descripcion} onChange={handleDescripcionChange} required />
                </label>
                <br />
                <label>
                    Precio del Producto:
                    <input type="number" value={precio} onChange={handlePrecioChange} required />
                </label>
                <br />
                <label>
                    Categoría del Producto:
                    <input type="text" value={categoria} onChange={handleCategoriaChange} required />
                </label>
                <br />
                <label>
                    Imagen del Producto:
                    <input type="file" onChange={handleImagenChange} accept="image/*" required />
                </label>
                <br />
                <button type="submit">Agregar Producto</button>
            </form>

            <h2>Productos Agregados</h2>
            {productos.map((producto) => (
                <div key={producto._id}>
                    <h3>{producto.nombre}</h3>
                    <p>Descripción: {producto.descripcion}</p>
                    <p>Precio: ${producto.precio}</p>
                    <p>Categoría: {producto.categoria}</p>
                    <img src={`/imagenes/${producto.imagen}`} alt={producto.nombre} style={{ width: '100px' }} />
                </div>
            ))}
        </div>
    );
};

export default CrearMenu;
