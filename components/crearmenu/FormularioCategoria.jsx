import { useState } from 'react';
import { Box, TextField, Button, IconButton, Snackbar, Alert } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';

const FormularioCategoria = ({ onSubmit, categorias = [], onDelete, onEdit }) => {
    const [nuevaCategoria, setNuevaCategoria] = useState('');
    const [busqueda, setBusqueda] = useState('');
    const [error, setError] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [editando, setEditando] = useState(null);
    const [categoriaEditada, setCategoriaEditada] = useState('');

    const normalizarTexto = (texto) => {
        return texto
            .toLowerCase()
            .trim()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const categoriaOriginal = nuevaCategoria.trim();
        const categoriaNormalizada = normalizarTexto(categoriaOriginal);
        
        const categoriaExiste = categorias.some(cat => 
            normalizarTexto(cat.nombre_categoria) === categoriaNormalizada
        );

        if (categoriaExiste) {
            setError('Esta categoría ya existe');
            setOpenSnackbar(true);
            return;
        }

        if (categoriaOriginal) {
            onSubmit(categoriaOriginal);
            setNuevaCategoria('');
            setError('');
        }
    };

    const handleStartEdit = (categoria) => {
        setEditando(categoria._id);
        setCategoriaEditada(categoria.nombre_categoria);
    };

    const handleCancelEdit = () => {
        setEditando(null);
        setCategoriaEditada('');
    };

    const handleSaveEdit = async (id) => {
        const categoriaNormalizada = normalizarTexto(categoriaEditada);
        
        const categoriaExiste = categorias.some(cat => 
            cat._id !== id && 
            normalizarTexto(cat.nombre_categoria) === categoriaNormalizada
        );

        if (categoriaExiste) {
            setError('Esta categoría ya existe');
            setOpenSnackbar(true);
            return;
        }

        await onEdit(id, categoriaEditada);
        setEditando(null);
        setCategoriaEditada('');
    };

    // Filtrar categorías basado en la búsqueda
    const categoriasFiltradas = categorias.filter(categoria =>
        normalizarTexto(categoria.nombre_categoria)
            .includes(normalizarTexto(busqueda))
    );

    // Función para manejar la búsqueda
    const handleBusqueda = (valor) => {
        setBusqueda(valor);
    };

    return (
        <div>
            {/* Formulario para agregar */}
            <Box sx={{ marginBottom: '20px' }}>
                <form onSubmit={handleSubmit}>
                    <Box sx={{
                        display: 'flex',
                        gap: '10px'
                    }}>
                        <TextField
                            placeholder="Nueva categoría"
                            variant="outlined"
                            size="small"
                            value={nuevaCategoria}
                            onChange={(e) => setNuevaCategoria(e.target.value)}
                            required
                            fullWidth
                            sx={{ 
                                backgroundColor: 'white',
                                '& .MuiOutlinedInput-root': {
                                    '&:hover fieldset': {
                                        borderColor: '#1976d2',
                                    },
                                }
                            }}
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            sx={{
                                backgroundColor: '#1976d2',
                                '&:hover': {
                                    backgroundColor: '#1565c0'
                                },
                                minWidth: '120px'
                            }}
                        >
                            Agregar
                        </Button>
                    </Box>
                </form>
            </Box>

            {/* Lista de categorías */}
            <div style={{
                backgroundColor: '#f8f8f8',
                borderRadius: '8px',
                overflow: 'hidden'
            }}>
                <div style={{
                    padding: '10px 15px',
                    backgroundColor: 'white',
                    borderBottom: '1px solid #e0e0e0',
                    color: '#666',
                    fontSize: '0.9rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <span>Total de categorías: {categorias.length}</span>
                </div>

                <div style={{ 
                    marginTop: '20px', 
                    maxHeight: '300px',
                    overflowY: 'auto'
                }}>
                    <style jsx global>{`
                        .categorias-container::-webkit-scrollbar {
                            width: 8px;
                        }
                        .categorias-container::-webkit-scrollbar-track {
                            background: #f1f1f1;
                            border-radius: 4px;
                        }
                        .categorias-container::-webkit-scrollbar-thumb {
                            background: #888;
                            border-radius: 4px;
                        }
                        .categorias-container::-webkit-scrollbar-thumb:hover {
                            background: #555;
                        }
                    `}</style>
                    {categoriasFiltradas.length > 0 ? (
                        categoriasFiltradas.map((categoria) => (
                            <div
                                key={categoria._id}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '15px',
                                    borderBottom: '1px solid #eee',
                                    backgroundColor: 'white',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                {editando === categoria._id ? (
                                    <Box sx={{ 
                                        display: 'flex', 
                                        alignItems: 'center',
                                        flex: 1,
                                        gap: 1 
                                    }}>
                                        <TextField
                                            value={categoriaEditada}
                                            onChange={(e) => setCategoriaEditada(e.target.value)}
                                            variant="outlined"
                                            size="small"
                                            fullWidth
                                            autoFocus
                                        />
                                        <IconButton 
                                            onClick={() => handleSaveEdit(categoria._id)}
                                            sx={{ color: 'green' }}
                                        >
                                            <SaveIcon />
                                        </IconButton>
                                        <IconButton 
                                            onClick={handleCancelEdit}
                                            sx={{ color: '#666' }}
                                        >
                                            <CancelIcon />
                                        </IconButton>
                                    </Box>
                                ) : (
                                    <>
                                        <span style={{
                                            flex: 1,
                                            color: '#333',
                                            fontSize: '0.95rem'
                                        }}>
                                            {categoria.nombre_categoria}
                                        </span>
                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                            <IconButton
                                                onClick={() => handleStartEdit(categoria)}
                                                sx={{
                                                    color: '#666',
                                                    '&:hover': { color: '#2196f3' }
                                                }}
                                            >
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton
                                                onClick={() => onDelete(categoria._id)}
                                                sx={{
                                                    color: '#666',
                                                    '&:hover': { color: '#f44336' }
                                                }}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </Box>
                                    </>
                                )}
                            </div>
                        ))
                    ) : (
                        <div style={{
                            padding: '20px',
                            textAlign: 'center',
                            color: '#666'
                        }}>
                            {busqueda ? 
                                `No se encontraron categorías con "${busqueda}"` : 
                                'No hay categorías disponibles'}
                        </div>
                    )}
                </div>
            </div>

            <Snackbar 
                open={openSnackbar} 
                autoHideDuration={4000} 
                onClose={() => setOpenSnackbar(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert 
                    onClose={() => setOpenSnackbar(false)} 
                    severity="error" 
                    sx={{ width: '100%' }}
                >
                    {error}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default FormularioCategoria;