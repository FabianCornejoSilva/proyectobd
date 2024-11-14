import { useState } from 'react';
import {
    TextField,
    Button,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    Box,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const FormularioProducto = ({ categorias, onSubmit }) => {
    const [nombre, setNombre] = useState('');
    const [precio, setPrecio] = useState(0);
    const [categoriaNombre, setCategoriaNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [imagen, setImagen] = useState(null);
    const [imagenPreview, setImagenPreview] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImagen(file);
        
        if (file) {
            const previewUrl = URL.createObjectURL(file);
            setImagenPreview(previewUrl);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('imagen', imagen);
        formData.append('nombre', nombre);
        formData.append('precio', precio);
        
        // Encontrar la categoría seleccionada
        const categoriaSeleccionada = categorias.find(cat => cat.nombre_categoria === categoriaNombre);
        
        // Agregar tanto el ID como el nombre de la categoría
        if (categoriaSeleccionada) {
            formData.append('categoriaId', categoriaSeleccionada._id);
            formData.append('categoriaNombre', categoriaSeleccionada.nombre_categoria);
        }
        
        formData.append('descripcion', descripcion);

        onSubmit(formData);

        // Resetear el formulario
        setNombre('');
        setPrecio(0);
        setCategoriaNombre('');
        setDescripcion('');
        setImagen(null);
        setImagenPreview(null);
    };

    return (
        <div style={{ 
            maxWidth: '600px',
            margin: '0 auto'
        }}>
            <form onSubmit={handleSubmit}>
                <Box sx={{ 
                    display: 'grid', 
                    gap: 2,
                    gridTemplateColumns: '1fr 1fr',
                    '& .MuiTextField-root': { backgroundColor: 'white' },
                    '& .MuiFormControl-root': { backgroundColor: 'white' }
                }}>
                    {/* Nombre del producto */}
                    <TextField
                        label="Nombre del producto"
                        variant="outlined"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        required
                        size="small"
                        sx={{ gridColumn: 'span 2' }}
                    />
                    <TextField
                        label="Precio"
                        variant="outlined"
                        type="number"
                        value={precio}
                        onChange={(e) => setPrecio(e.target.value)}
                        required
                        size="small"
                        sx={{ gridColumn: 'span 2' }}
                    />
                    <FormControl fullWidth required size="small" sx={{ gridColumn: 'span 2' }}>
                        <InputLabel id="categoria-select-label">Categoría</InputLabel>
                        <Select
                            labelId="categoria-select-label"
                            value={categoriaNombre}
                            onChange={(e) => setCategoriaNombre(e.target.value)}
                        >
                            <MenuItem value="">
                                <em>Selecciona una categoría</em>
                            </MenuItem>
                            {categorias.map((categoria) => (
                                <MenuItem key={categoria._id} value={categoria.nombre_categoria}>
                                    {categoria.nombre_categoria}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <TextField
                        label="Descripción"
                        variant="outlined"
                        multiline
                        rows={2}
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
                        required
                        size="small"
                        sx={{ gridColumn: 'span 2' }}
                    />

                    <Box sx={{ 
                        gridColumn: 'span 2',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2
                    }}>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            required
                            style={{ margin: '8px 0' }}
                        />
                        {imagenPreview && (
                            <img
                                src={imagenPreview}
                                alt="Vista previa"
                                style={{
                                    width: '100%',
                                    maxHeight: '200px',
                                    objectFit: 'contain',
                                    margin: '8px 0',
                                }}
                            />
                        )}
                    </Box>

                    <Box sx={{ 
                        gridColumn: 'span 2',
                        height: '20px'
                    }} />

                    <Button
                        variant="contained"
                        sx={{ 
                            backgroundColor: '#1976d2',
                            color: 'white',
                            '&:hover': {
                                backgroundColor: '#1565c0'
                            },
                            gridColumn: 'span 2',
                            height: '40px',
                            marginTop: '10px'
                        }}
                        type="submit"
                        fullWidth
                    >
                        Agregar
                    </Button>
                </Box>
            </form>
        </div>
    );
};

export default FormularioProducto;