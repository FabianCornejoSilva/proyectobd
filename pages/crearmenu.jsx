import { useEffect, useState } from 'react';
import FormularioProducto from '../components/crearmenu/FormularioProducto';
import ListaProductos from '../components/crearmenu/ListaProductos';
import FormularioCategoria from '../components/crearmenu/FormularioCategoria';
import { Container, Grid, Box, Divider, Button, List, ListItem, ListItemText, ListItemIcon, IconButton, TextField, Switch, FormControlLabel } from '@mui/material';
import Link from 'next/link';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

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
    const [usuarios, setUsuarios] = useState([]); // Nuevo estado para los usuarios
    const [editingUser, setEditingUser] = useState(null); // Estado para el usuario en edición
    const [newUser, setNewUser] = useState({ nombre: '', correo: '', admin: false, contraseña: '' }); // Estado para el nuevo usuario

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

    const fetchUsuarios = async () => {
        try {
            const response = await fetch('http://localhost:3000/usuario');
            if (response.ok) {
                const data = await response.json();
                setUsuarios(data);
            } else {
                console.error('Error al obtener los usuarios');
            }
        } catch (error) {
            console.error('Error al obtener los usuarios:', error);
        }
    };

    useEffect(() => {
        fetchCategorias();
        fetchProductos();
        fetchUsuarios(); // Llamar a la función para obtener usuarios
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

    const handleDeleteUsuario = async (id) => {
        try {
            const response = await fetch(`http://localhost:3000/usuario/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setUsuarios(usuarios.filter(usuario => usuario.id !== id));
            } else {
                console.error('Error al eliminar el usuario');
            }
        } catch (error) {
            console.error('Error al eliminar el usuario:', error);
        }
    };

    const handleEditUsuario = (usuario) => {
        setEditingUser(usuario);
    };

    const handleSaveUsuario = async () => {
        try {
            const response = await fetch(`http://localhost:3000/usuario/${editingUser.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editingUser),
            });

            if (response.ok) {
                setUsuarios(usuarios.map(usuario => (usuario.id === editingUser.id ? editingUser : usuario)));
                setEditingUser(null);
            } else {
                console.error('Error al editar el usuario');
            }
        } catch (error) {
            console.error('Error al editar el usuario:', error);
        }
    };

    const handleAddUsuario = async () => {
        try {
            const response = await fetch('http://localhost:3000/usuario', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newUser),
            });

            if (response.ok) {
                const addedUser = await response.json();
                setUsuarios([...usuarios, addedUser]);
                setNewUser({ nombre: '', correo: '', admin: false, contraseña: '' });
            } else {
                console.error('Error al agregar el usuario');
            }
        } catch (error) {
            console.error('Error al agregar el usuario:', error);
        }
    };

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
                zIndex: 1000,
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <h1 style={{ 
                    margin: 0,
                    fontSize: '1.8rem',
                    fontWeight: 'bold'
                }}>
                    Panel de Administrador
                </h1>

                <Link href="/pedir" passHref>
                    <Button
                        variant="contained"
                        startIcon={<RestaurantMenuIcon />}
                        sx={{
                            backgroundColor: 'white',
                            color: 'black',
                            '&:hover': {
                                backgroundColor: '#e0e0e0',
                            },
                            fontWeight: 'bold',
                            borderRadius: '20px' // Añadir esta línea para redondear el botón
                        }}
                    >
                        Ver Menú
                    </Button>
                </Link>
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

                <Box sx={{ 
                    marginTop: 4,
                    ...commonBoxStyles
                }}>
                    <h2 style={commonTitleStyles}>
                        Usuarios
                    </h2>
                    <List>
                        {usuarios.map(usuario => (
                            <ListItem key={usuario.id}>
                                <ListItemIcon>
                                    <AccountCircleIcon />
                                </ListItemIcon>
                                <ListItemText
                                    primary={editingUser && editingUser.id === usuario.id ? (
                                        <>
                                            <TextField
                                                label="Nombre"
                                                value={editingUser.nombre}
                                                onChange={(e) => setEditingUser({ ...editingUser, nombre: e.target.value })}
                                            />
                                            <TextField
                                                label="Correo"
                                                value={editingUser.correo}
                                                onChange={(e) => setEditingUser({ ...editingUser, correo: e.target.value })}
                                            />
                                            <FormControlLabel
                                                control={
                                                    <Switch
                                                        checked={editingUser.admin}
                                                        onChange={(e) => setEditingUser({ ...editingUser, admin: e.target.checked })}
                                                    />
                                                }
                                                label="Admin"
                                            />
                                        </>
                                    ) : (
                                        <>
                                            <span>{usuario.nombre}</span>
                                            <br />
                                            <span>{usuario.correo}</span>
                                            <br />
                                            <span>{usuario.admin ? 'Admin' : 'Usuario'}</span>
                                        </>
                                    )}
                                />
                                {editingUser && editingUser.id === usuario.id ? (
                                    <>
                                        <IconButton onClick={handleSaveUsuario}>
                                            <SaveIcon />
                                        </IconButton>
                                        <IconButton onClick={() => setEditingUser(null)}>
                                            <CancelIcon />
                                        </IconButton>
                                    </>
                                ) : (
                                    <>
                                        <IconButton onClick={() => handleEditUsuario(usuario)}>
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton onClick={() => handleDeleteUsuario(usuario.id)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </>
                                )}
                            </ListItem>
                        ))}
                    </List>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 4 }}>
                        <TextField
                            label="Nombre"
                            value={newUser.nombre}
                            onChange={(e) => setNewUser({ ...newUser, nombre: e.target.value })}
                        />
                        <TextField
                            label="Correo"
                            value={newUser.correo}
                            onChange={(e) => setNewUser({ ...newUser, correo: e.target.value })}
                        />
                        <TextField
                            label="Contraseña"
                            type="password"
                            value={newUser.contraseña}
                            onChange={(e) => setNewUser({ ...newUser, contraseña: e.target.value })}
                        />
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={newUser.admin}
                                    onChange={(e) => setNewUser({ ...newUser, admin: e.target.checked })}
                                />
                            }
                            label="Admin"
                        />
                        <Button variant="contained" onClick={handleAddUsuario}>
                            Agregar Usuario
                        </Button>
                    </Box>
                </Box>
            </Container>
        </div>
    );
};

export default CrearMenu;