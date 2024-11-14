import { useEffect, useState } from 'react';
import FormularioProducto from '../components/crearmenu/FormularioProducto';
import ListaProductos from '../components/crearmenu/ListaProductos';
import FormularioCategoria from '../components/crearmenu/FormularioCategoria';
import { Container, Grid, Box, Divider } from '@mui/material';

const commonBoxStyles = {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    padding: '20px',
    border: '1px solid #e8e8e8',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    height: '100%'
};

const commonTitleStyles = {
    margin: '0 0 20px 0',
    color: '#333',
    fontSize: '1.5rem',
    textAlign: 'center',
    paddingBottom: '10px',
    borderBottom: '1px solid #f0f0f0'
};

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
        try {
            // Verificar que formData tenga todos los campos necesarios
            if (!formData.get('imagen')) {
                alert('Se requiere una imagen para el producto');
                return;
            }

            // Verificar longitud del nombre
            const nombre = formData.get('nombre');
            if (nombre.length > 50) {
                alert('El nombre del producto no puede exceder los 50 caracteres');
                return;
            }

            const response = await fetch('http://localhost:3000/productos', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                alert(errorData.error || 'Error al crear el producto');
                return;
            }

            await fetchProductos(); // Recargar la lista de productos
            
        } catch (error) {
            console.error('Error al agregar el producto:', error);
            alert('Error al crear el producto. Por favor, inténtelo de nuevo.');
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

    const handleEditCategoria = async (id, nuevoNombre) => {
        try {
            const response = await fetch(`http://localhost:3000/categorias/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ nombre_categoria: nuevoNombre }),
            });

            if (response.ok) {
                await fetchCategorias(); // Actualizar la lista
            } else {
                console.error('Error al editar la categoría');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleEditProducto = async (id, formData) => {
        try {
            console.log("Editando producto:", id); // Para debug
            const response = await fetch(`http://localhost:3000/productos/${id}`, {
                method: 'PUT',
                body: formData
            });

            if (response.ok) {
                console.log("Producto actualizado exitosamente");
                await fetchProductos(); // Recargar la lista de productos
            } else {
                console.error('Error al editar el producto');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    // Función para reconectar si el servidor se cae
    const checkServerConnection = async () => {
        try {
            const response = await fetch('http://localhost:3000/health');
            if (!response.ok) {
                console.log('Servidor no disponible, reintentando...');
                setTimeout(checkServerConnection, 5000); // Reintentar cada 5 segundos
            }
        } catch (error) {
            console.log('Error de conexión, reintentando...');
            setTimeout(checkServerConnection, 5000);
        }
    };

    // Agregar un endpoint de health check en el backend
    useEffect(() => {
        checkServerConnection();
    }, []);

    return (
        <div style={{ backgroundColor: '#ffffff' }}>
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                backgroundColor: '#000000',
                color: 'white',
                padding: '15px',
                textAlign: 'center',
                zIndex: 1000,
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
                <h1 style={{ 
                    margin: 0,
                    fontSize: '1.8rem',
                    fontWeight: 'bold'
                }}>
                    Panel de Creación de Menú
                </h1>
            </div>

            <Container style={{ 
                marginTop: '80px',
                paddingBottom: '40px'
            }}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={7}>
                        <Box sx={commonBoxStyles}>
                            <h2 style={commonTitleStyles}>
                                Agregar Producto
                            </h2>
                            <FormularioProducto 
                                categorias={categorias} 
                                onSubmit={handleSubmitProducto} 
                            />
                        </Box>
                    </Grid>

                    <Grid item xs={12} md={5}>
                        <Box sx={commonBoxStyles}>
                            <h2 style={commonTitleStyles}>
                                Gestión de Categorías
                            </h2>
                            <FormularioCategoria 
                                categorias={categorias}
                                onSubmit={handleAddCategoria}
                                onDelete={handleDeleteCategoria}
                                onEdit={handleEditCategoria}
                            />
                        </Box>
                    </Grid>
                </Grid>

                <Box sx={{ 
                    marginTop: 4,
                    ...commonBoxStyles
                }}>
                    <h2 style={commonTitleStyles}>
                        Productos
                    </h2>
                    <ListaProductos
                        productos={productos}
                        categorias={categorias}
                        onDelete={handleDelete}
                        onToggleMenu={handleToggleMenu}
                        onEdit={handleEditProducto}
                    />
                </Box>
            </Container>
        </div>
    );
};

export default CrearMenu;