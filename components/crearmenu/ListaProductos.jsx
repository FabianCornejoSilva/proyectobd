import { Typography, Button, Card, CardContent, Grid, MenuItem, Select, FormControl, InputLabel, TextField, IconButton, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useState } from 'react';

const ListaProductos = ({ productos, categorias, onDelete, onToggleMenu, onEdit }) => {
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [editFormData, setEditFormData] = useState({
        nombre: '',
        precio: '',
        categoriaNombre: '',
        descripcion: '',
        imagen: null
    });
    const [previewImage, setPreviewImage] = useState(null);

    // Filtrar productos según la categoría seleccionada
    const productosFiltrados = categoriaSeleccionada 
        ? productos.filter(producto => 
            producto.categoria && 
            producto.categoria.nombre_categoria === categoriaSeleccionada
        )
        : productos;

    // Filtrar productos según el término de búsqueda
    const productosFinales = productosFiltrados.filter(producto => 
        producto.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleEditClick = (producto) => {
        setEditingProduct(producto);
        setEditFormData({
            nombre: producto.nombre,
            precio: producto.precio,
            categoriaNombre: producto.categoria?.nombre || '',
            descripcion: producto.descripcion,
            imagen: null
        });
        setPreviewImage(`/imagenes/menu/${producto.imagen}`);
        setEditModalOpen(true);
    };

    const handleEditSubmit = async () => {
        try {
            const formData = new FormData();
            formData.append('nombre', editFormData.nombre);
            formData.append('precio', editFormData.precio);
            formData.append('descripcion', editFormData.descripcion);

            // Encontrar la categoría seleccionada
            const categoriaSeleccionada = categorias.find(
                cat => cat.nombre_categoria === editFormData.categoriaNombre
            );
            
            if (categoriaSeleccionada) {
                formData.append('categoriaId', categoriaSeleccionada._id);
                formData.append('categoriaNombre', categoriaSeleccionada.nombre_categoria);
            }

            // Agregar la imagen solo si se seleccionó una nueva
            if (editFormData.imagen) {
                formData.append('imagen', editFormData.imagen);
            }

            // Llamar a la función de edición
            await onEdit(editingProduct._id, formData);
            
            // Cerrar el modal y limpiar el estado
            setEditModalOpen(false);
            setEditingProduct(null);
            setEditFormData({
                nombre: '',
                precio: '',
                categoriaNombre: '',
                descripcion: '',
                imagen: null
            });
            setPreviewImage(null);
        } catch (error) {
            console.error('Error al guardar los cambios:', error);
            // Aquí podrías agregar una notificación de error para el usuario
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setEditFormData(prev => ({ ...prev, imagen: file }));
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    return (
        <>
            {/* Barra de búsqueda */}
            <TextField
                label="Buscar Producto"
                variant="outlined"
                fullWidth
                margin="normal"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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
                        <MenuItem key={categoria._id} value={categoria.nombre_categoria}>
                            {categoria.nombre_categoria}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <Grid container spacing={2}>
                {productosFinales.length > 0 ? (
                    productosFinales.map((producto) => {
                        const enMenu = producto.enMenu || false;
                        const nombreCategoria = producto.categoria?.nombre || 'Sin categoría';
                        
                        return (
                            <Grid item xs={12} sm={6} md={4} key={producto._id}>
                                <Card 
                                    sx={{ 
                                        display: 'flex', 
                                        flexDirection: 'column',
                                        height: '400px',
                                        padding: 1, 
                                        boxShadow: 3, 
                                        borderRadius: 2, 
                                        position: 'relative',
                                        '& > *:not(button)': {
                                            filter: enMenu ? 'none' : 'grayscale(100%)',
                                            opacity: enMenu ? 1 : 0.8,
                                        }
                                    }} 
                                >
                                    <div style={{
                                        position: 'absolute',
                                        top: '8px',
                                        right: '8px',
                                        zIndex: 2,
                                        display: 'flex',
                                        gap: '8px',
                                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                        borderRadius: '4px',
                                        padding: '4px'
                                    }}>
                                        <IconButton
                                            onClick={() => handleEditClick(producto)}
                                            size="small"
                                            sx={{
                                                '&:hover': {
                                                    color: '#1976d2'
                                                }
                                            }}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton
                                            onClick={() => onDelete(producto._id)}
                                            size="small"
                                            sx={{
                                                '&:hover': {
                                                    color: '#d32f2f'
                                                }
                                            }}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </div>

                                    <div style={{ 
                                        display: 'flex', 
                                        justifyContent: 'center', 
                                        alignItems: 'center', 
                                        width: '100%', 
                                        height: '200px',
                                        position: 'relative'
                                    }}>
                                        <img 
                                            src={`/imagenes/menu/${producto.imagen}`} 
                                            alt={producto.nombre} 
                                            style={{ 
                                                maxWidth: '100%', 
                                                maxHeight: '100%', 
                                                objectFit: 'cover', 
                                                borderRadius: '4px 4px 0 0'
                                            }} 
                                        />
                                    </div>

                                    <CardContent sx={{ 
                                        textAlign: 'left', 
                                        width: '100%',
                                        opacity: enMenu ? 1 : 0.9
                                    }}>
                                        <Typography variant="h6" gutterBottom sx={{ 
                                            fontWeight: 'bold',
                                            color: enMenu ? 'text.primary' : 'text.secondary'
                                        }}>
                                            {producto.nombre}
                                        </Typography>
                                        <Typography variant="body2" color={enMenu ? 'text.primary' : 'text.secondary'}>
                                            Precio: CLP ${producto.precio.toLocaleString('es-CL')}
                                        </Typography>
                                        <Typography variant="body2" color={enMenu ? 'text.primary' : 'text.secondary'}>
                                            Categoría: {nombreCategoria}
                                        </Typography>
                                        <Typography variant="body2" sx={{ marginTop: 1 }} color={enMenu ? 'text.primary' : 'text.secondary'}>
                                            {producto.descripcion}
                                        </Typography>
                                    </CardContent>

                                    <Button
                                        variant="contained"
                                        sx={{ 
                                            backgroundColor: enMenu ? '#d32f2f' : '#1976d2',
                                            color: 'white', 
                                            width: 'auto', 
                                            padding: '6px 12px', 
                                            position: 'absolute', 
                                            bottom: '8px', 
                                            right: '8px',
                                            zIndex: 1,
                                            '&:hover': {
                                                backgroundColor: enMenu ? '#c62828' : '#1565c0'
                                            }
                                        }}
                                        onClick={() => onToggleMenu(producto._id)} 
                                    >
                                        {enMenu ? 'Quitar del Menú' : 'Agregar al Menú'}
                                    </Button>
                                </Card>
                            </Grid>
                        );
                    })
                ) : (
                    <Grid item xs={12}>
                        <Typography variant="body1" color="textSecondary" textAlign="center">
                            No hay productos que coincidan con la búsqueda y/o la categoría seleccionada.
                        </Typography>
                    </Grid>
                )}
            </Grid>

            {/* Modal de Edición */}
            <Dialog open={editModalOpen} onClose={() => setEditModalOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Editar Producto</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Nombre"
                                value={editFormData.nombre}
                                onChange={(e) => setEditFormData(prev => ({
                                    ...prev,
                                    nombre: e.target.value
                                }))}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Precio"
                                type="number"
                                value={editFormData.precio}
                                onChange={(e) => setEditFormData(prev => ({
                                    ...prev,
                                    precio: e.target.value
                                }))}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel>Categoría</InputLabel>
                                <Select
                                    value={editFormData.categoriaNombre}
                                    label="Categoría"
                                    onChange={(e) => setEditFormData(prev => ({
                                        ...prev,
                                        categoriaNombre: e.target.value
                                    }))}
                                >
                                    {categorias.map((categoria) => (
                                        <MenuItem 
                                            key={categoria._id} 
                                            value={categoria.nombre_categoria}
                                        >
                                            {categoria.nombre_categoria}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Descripción"
                                multiline
                                rows={3}
                                value={editFormData.descripcion}
                                onChange={(e) => setEditFormData(prev => ({
                                    ...prev,
                                    descripcion: e.target.value
                                }))}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                style={{ marginBottom: '10px' }}
                            />
                            {previewImage && (
                                <img
                                    src={previewImage}
                                    alt="Preview"
                                    style={{
                                        maxWidth: '100%',
                                        maxHeight: '200px',
                                        objectFit: 'contain',
                                        marginTop: '10px'
                                    }}
                                />
                            )}
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button 
                        onClick={() => {
                            setEditModalOpen(false);
                            setEditingProduct(null);
                            setEditFormData({
                                nombre: '',
                                precio: '',
                                categoriaNombre: '',
                                descripcion: '',
                                imagen: null
                            });
                            setPreviewImage(null);
                        }}
                        color="inherit"
                    >
                        Cancelar
                    </Button>
                    <Button 
                        onClick={handleEditSubmit} 
                        variant="contained"
                        color="primary"
                    >
                        Guardar Cambios
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default ListaProductos;
