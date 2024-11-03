import { useState } from 'react';
import {
    TextField,
    Button,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    Card,
    CardContent,
    Typography,
} from '@mui/material';

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
        formData.append('categoriaNombre', categoriaNombre);
        formData.append('descripcion', descripcion);
        // Eliminar el estado de "enMenu" ya que no se necesita

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
        <Card variant="outlined" sx={{ margin: 1, padding: 2, maxWidth: 400 }}>
            <CardContent>
                <Typography variant="h6" component="div" gutterBottom>
                    Agregar Producto
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Nombre"
                        variant="outlined"
                        fullWidth
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        required
                        margin="dense"
                    />
                    <TextField
                        label="Precio"
                        variant="outlined"
                        fullWidth
                        type="number"
                        value={precio}
                        onChange={(e) => setPrecio(e.target.value)}
                        required
                        margin="dense"
                    />
                    <FormControl fullWidth required margin="dense">
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
                        fullWidth
                        multiline
                        rows={2}
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
                        required
                        margin="dense"
                    />
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
                    <Button
                        variant="contained"
                        sx={{ backgroundColor: 'black', color: 'white' }}
                        type="submit"
                        fullWidth
                    >
                        Agregar
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
};

export default FormularioProducto;
