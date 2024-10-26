// pages/menu.js
import { useEffect, useState } from 'react';
import axios from 'axios';

const Menu = () => {
    const [productos, setProductos] = useState([]);

    const fetchProductos = async () => {
        const res = await axios.get('http://localhost:3000/menu');
        setProductos(res.data);
    };

    useEffect(() => {
        fetchProductos();
    }, []);

    return (
        <div>
            <h1>Menú</h1>
            {productos.length === 0 ? (
                <p>No hay productos disponibles.</p>
            ) : (
                productos.map((producto) => (
                    <div key={producto._id}>
                        <h3>{producto.nombre}</h3>
                        <p>Descripción: {producto.descripcion}</p>
                        <p>Precio: ${producto.precio.toFixed(2)}</p>
                        <p>Categoría: {producto.categoria}</p>
                        <img src={producto.imagen} alt={producto.nombre} style={{ width: '100px', height: '100px' }} /> {/* Muestra la imagen */}
                    </div>
                ))
            )}
        </div>
    );
};

export default Menu;
