import { useEffect, useState } from 'react';
import FormularioProducto from '../components/crearmenu/FormularioProducto';
import ListaProductos from '../components/crearmenu/ListaProductos';
import ListaCategorias from '../components/crearmenu/ListaCategorias';
import FormularioCategoria from '../components/crearmenu/FormularioCategoria';
import { Grid, Container } from '@mui/material';

const CrearMenu = () => {
    const [productos, setProductos] = useState([]);
    const [categorias, setCategorias] = useState([]);

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

    useEffect(() => {
        fetchCategorias();
        fetchProductos();
    }, []);

    const handleSubmitProducto = async (formData) => {
        const response = await fetch('http://localhost:3000/productos', {
            method: 'POST',
            body: formData,
        });

        if (response.ok) {
            await fetchProductos(); // Actualiza la lista de productos
        } else {
            console.error('Error al agregar el producto');
        }
    };

    const handleAddCategoria = async (nombreCategoria) => {
        const response = await fetch('http://localhost:3000/categorias', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre_categoria: nombreCategoria }),
        });

        if (response.ok) {
            await fetchCategorias();
        } else {
            console.error('Error al agregar la categoría');
        }
    };

    const handleDeleteCategoria = async (id) => {
        const response = await fetch(`http://localhost:3000/categorias/${id}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            await fetchCategorias();
        } else {
            console.error('Error al eliminar la categoría');
        }
    };

    const handleDelete = async (id) => {
        const response = await fetch(`http://localhost:3000/productos/${id}`, {
            method: 'DELETE',
        });
    
        if (response.ok) {
            // Llama a fetchProductos para actualizar la lista de productos
            await fetchProductos();
        } else {
            console.error('Error al eliminar el producto');
        }
    };

    // Nueva función para alternar el estado en el menú
    const handleToggleMenu = async (id) => {
        try {
            const response = await fetch(`http://localhost:3000/productos/${id}/toggleMenu`, {
                method: 'PATCH',
            });
            if (response.ok) {
                const updatedProducto = await response.json();
                setProductos((prevProductos) =>
                    prevProductos.map((producto) =>
                        producto._id === updatedProducto._id ? updatedProducto : producto
                    )
                );
            } else {
                console.error('Error al alternar el estado del menú');
            }
        } catch (error) {
            console.error('Error al alternar el estado del menú:', error);
        }
    };

    return (
        <div>
            {/* Banner negro en la parte superior que cubre todo el ancho de la página */}
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                backgroundColor: 'black',
                color: 'white',
                padding: '25px',
                textAlign: 'center',
                zIndex: 1000
            }}>
                <h1>Panel de Creación de Menú</h1>
            </div>

            {/* Contenido principal con margen superior para evitar superposición con el banner */}
            <Container style={{ marginTop: '100px' }}>
                <h2>Categorías</h2>
                <Grid container alignItems="center" spacing={2}>
                    <Grid item xs={12} sm={8}>
                        <ListaCategorias categorias={categorias} onDelete={handleDeleteCategoria} />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <FormularioCategoria onSubmit={handleAddCategoria} />
                    </Grid>
                </Grid>

                <h2>Agregar Producto</h2>
                <FormularioProducto categorias={categorias} onSubmit={handleSubmitProducto} />

                <h2>Productos</h2>
                <ListaProductos
                    productos={productos}
                    categorias={categorias}
                    onDelete={handleDelete}
                    onToggleMenu={handleToggleMenu} // Pasa la función aquí
                />
            </Container>
        </div>
    );
};

export default CrearMenu;
