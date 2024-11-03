import { Typography, Button, Card, CardContent, Grid, MenuItem, Select, FormControl, InputLabel, TextField } from '@mui/material';
import { useState } from 'react';

const ListaProductos = ({ productos, categorias, onDelete, onToggleMenu }) => {
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
    const [searchTerm, setSearchTerm] = useState(''); // Estado para el término de búsqueda

    // Filtrar productos según la categoría seleccionada
    const productosFiltrados = categoriaSeleccionada 
        ? productos.filter(producto => producto.categoria && producto.categoria._id === categoriaSeleccionada) // Filtra por categoría
        : productos;

    // Filtrar productos según el término de búsqueda
    const productosFinales = productosFiltrados.filter(producto => 
        producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) // Filtra por nombre
    );

    return (
        <>
            {/* Barra de búsqueda */}
            <TextField
                label="Buscar Producto"
                variant="outlined"
                fullWidth
                margin="normal"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)} // Actualiza el estado al cambiar el texto
            />

           {/* Filtro de categoría */}
           <FormControl fullWidth sx={{ marginBottom: 2 }}>
                <InputLabel id="categoria-select-label">Categoría</InputLabel>
                <Select
                    labelId="categoria-select-label"
                    value={categoriaSeleccionada}
                    onChange={(e) => setCategoriaSeleccionada(e.target.value)}
                >
                    <MenuItem value="">
                        <em>Todos</em>
                    </MenuItem>
                    {categorias.map((categoria) => (
                        <MenuItem key={categoria._id} value={categoria.nombre_categoria}> {/* Usando nombre_categoria */}
                            {categoria.nombre_categoria} {/* Mostrando el nombre de la categoría */}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <Grid container spacing={2}>
                {productosFinales.length > 0 ? ( // Verifica si hay productos que mostrar
                    productosFinales.map((producto) => {
                        const categoria = producto.categoria || { nombre_categoria: 'Sin categoría' }; // Asegúrate de tener un nombre por defecto
                        const enMenu = producto.enMenu || false;

                        return (
                            <Grid item xs={12} sm={6} md={4} key={producto._id}>
                                <Card 
                                    sx={{ 
                                        display: 'flex', 
                                        flexDirection: 'column', 
                                        alignItems: 'flex-start', 
                                        padding: 1, 
                                        boxShadow: 3, 
                                        borderRadius: 2, 
                                        position: 'relative' 
                                    }} 
                                >
                                    <div style={{ 
                                        display: 'flex', 
                                        justifyContent: 'center', 
                                        alignItems: 'center', 
                                        width: '100%', 
                                        height: '150px' 
                                    }}>
                                        <img 
                                            src={`/imagenes/${producto.imagen}`} 
                                            alt={producto.nombre} 
                                            style={{ 
                                                maxWidth: '100%', 
                                                maxHeight: '100%', 
                                                objectFit: 'cover', 
                                                borderRadius: '4px 4px 0 0' 
                                            }} 
                                        />
                                    </div>
                                    <CardContent sx={{ textAlign: 'left', width: '100%' }}>
                                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                                            {producto.nombre}
                                        </Typography>
                                        <Typography variant="body2">
                                            Precio: {producto.precio.toLocaleString('es-CL')} CLP
                                        </Typography>
                                        <Typography variant="body2">
                                            Categoría: {categoria.nombre_categoria} {/* Cambiado para acceder al nombre correcto */}
                                        </Typography>
                                        <Typography variant="body2" sx={{ marginTop: 1 }}>
                                            Descripción: {producto.descripcion}
                                        </Typography>
                                    </CardContent>
                                    <Button
                                        variant="contained"
                                        sx={{ 
                                            backgroundColor: enMenu ? 'black' : 'gray',
                                            color: 'white', 
                                            width: 'auto', 
                                            padding: '6px 12px', 
                                            position: 'absolute', 
                                            bottom: '40px', 
                                            right: '8px' 
                                        }}
                                        onClick={() => onToggleMenu(producto._id)} 
                                    >
                                        {enMenu ? 'Eliminar del Menú' : 'Agregar al Menú'}
                                    </Button>
                                    <Button
                                        variant="contained"
                                        sx={{ 
                                            backgroundColor: 'black', 
                                            color: 'white', 
                                            width: 'auto', 
                                            padding: '6px 12px', 
                                            position: 'absolute', 
                                            bottom: '8px', 
                                            right: '8px' 
                                        }}
                                        onClick={() => onDelete(producto._id)}
                                    >
                                        Eliminar
                                    </Button>
                                </Card>
                            </Grid>
                        );
                    })
                ) : (
                    <Typography variant="body1" color="textSecondary">
                        No hay productos que coincidan con la búsqueda y/o la categoría seleccionada.
                    </Typography>
                )}
            </Grid>
        </>
    );
};

export default ListaProductos;
