// pages/crearmenu.js
import { useEffect, useState } from 'react';

const CrearMenu = () => {
    const [nombre, setNombre] = useState('');
    const [precio, setPrecio] = useState(0);
    const [categoriaId, setCategoriaId] = useState('');
    const [imagen, setImagen] = useState(null);
    const [productos, setProductos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [nuevaCategoria, setNuevaCategoria] = useState('');

    useEffect(() => {
        const fetchCategorias = async () => {
            try {
                const response = await fetch('http://localhost:3000/categorias');
                if (response.ok) {
                    const data = await response.json();
                    setCategorias(data);
                } else {
                    console.error('Error al obtener las categorías');
                }
            } catch (error) {
                console.error('Error al obtener las categorías:', error);
            }
        };

        const fetchProductos = async () => {
            try {
                const response = await fetch('http://localhost:3000/productos');
                if (response.ok) {
                    const data = await response.json();
                    setProductos(data);
                } else {
                    console.error('Error al obtener los productos');
                }
            } catch (error) {
                console.error('Error al obtener los productos:', error);
            }
        };

        fetchCategorias();
        fetchProductos();
    }, []);

    const handleSubmitProducto = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('imagen', imagen);
        formData.append('nombre', nombre);
        formData.append('precio', precio);
        formData.append('categoria', categoriaId);

        const response = await fetch('http://localhost:3000/productos', {
            method: 'POST',
            body: formData,
        });

        if (response.ok) {
            const nuevoProducto = await response.json();
            setProductos((prevProductos) => [...prevProductos, nuevoProducto]);
            setNombre('');
            setPrecio(0);
            setCategoriaId('');
            setImagen(null);
        } else {
            console.error('Error al agregar el producto');
        }
    };

    const handleImageChange = (e) => {
        setImagen(e.target.files[0]);
    };

    const handleDeleteProducto = async (id) => {
        const response = await fetch(`http://localhost:3000/productos/${id}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            setProductos((prevProductos) => prevProductos.filter(producto => producto._id !== id));
        } else {
            console.error('Error al eliminar el producto');
        }
    };

    const handleSubmitCategoria = async (e) => {
        e.preventDefault();

        const response = await fetch('http://localhost:3000/categorias', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nombre_categoria: nuevaCategoria }),
        });

        if (response.ok) {
            const categoriaCreada = await response.json();
            setCategorias((prevCategorias) => [...prevCategorias, categoriaCreada]);
            setNuevaCategoria('');
        } else {
            console.error('Error al agregar la categoría');
        }
    };

    return (
        <div>
            <h1>Crear Menú</h1>
            <form onSubmit={handleSubmitProducto}>
                <input
                    type="text"
                    placeholder="Nombre del producto"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                />
                <input
                    type="number"
                    placeholder="Precio en centavos"
                    value={precio}
                    onChange={(e) => setPrecio(e.target.value)}
                    required
                />
                <select
                    value={categoriaId}
                    onChange={(e) => setCategoriaId(e.target.value)}
                    required
                >
                    <option value="">Selecciona una categoría</option>
                    {categorias.map(categoria => (
                        <option key={categoria._id} value={categoria._id}>
                            {categoria.nombre_categoria}
                        </option>
                    ))}
                </select>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    required
                />
                <button type="submit">Agregar Producto</button>
            </form>

            <h2>Productos</h2>
            <ul>
                {productos.map((producto) => (
                    <li key={producto._id}>
                        <img src={`/imagenes/${producto.imagen}`} alt={producto.nombre} />
                        <p>{producto.nombre}</p>
                        <p>{producto.precio.toLocaleString('es-CL')} CLP</p>
                        <p>{producto.categoria.nombre_categoria}</p>
                        <button onClick={() => handleDeleteProducto(producto._id)}>Eliminar</button>
                    </li>
                ))}
            </ul>

            <h2>Agregar Categoría</h2>
            <form onSubmit={handleSubmitCategoria}>
                <input
                    type="text"
                    placeholder="Nombre de la nueva categoría"
                    value={nuevaCategoria}
                    onChange={(e) => setNuevaCategoria(e.target.value)}
                    required
                />
                <button type="submit">Agregar Categoría</button>
            </form>

            <h2>Categorías</h2>
            <ul>
                {categorias.map(categoria => (
                    <li key={categoria._id}>{categoria.nombre_categoria}</li>
                ))}
            </ul>
        </div>
    );
};

export default CrearMenu;
