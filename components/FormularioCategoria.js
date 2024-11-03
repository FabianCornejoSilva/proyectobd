// pages/crearMenu/FormularioCategoria.js
import { useState } from 'react';
import { Box, TextField, Button } from '@mui/material';

const FormularioCategoria = ({ onSubmit }) => {
    const [nuevaCategoria, setNuevaCategoria] = useState('');
    const [mostrarFormulario, setMostrarFormulario] = useState(false); // Estado para mostrar/ocultar el formulario

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(nuevaCategoria);
        setNuevaCategoria('');
        setMostrarFormulario(false); // Oculta el formulario al enviar
    };

    return (
        <div>
            {!mostrarFormulario ? (
                <Box
                    onClick={() => setMostrarFormulario(true)} // Muestra el formulario al hacer clic
                    sx={{
                        backgroundColor: 'black',
                        color: 'white',
                        padding: '6px 12px',
                        borderRadius: '15px',
                        textAlign: 'center',
                        fontSize: '0.875rem',
                        display: 'inline-block',
                        cursor: 'pointer', // Cambia el cursor para indicar que es interactivo
                        whiteSpace: 'nowrap',
                    }}
                >
                    Añadir Categoría
                </Box>
            ) : (
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Nombre de la nueva categoría"
                        variant="outlined"
                        size="small"
                        value={nuevaCategoria}
                        onChange={(e) => setNuevaCategoria(e.target.value)}
                        required
                        sx={{ marginBottom: 1 }}
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        sx={{
                            backgroundColor: 'black',
                            color: 'white',
                            fontSize: '0.875rem',
                            padding: 'px 12px',
                        }}
                    >
                        Agregar
                    </Button>
                    <Button
                        onClick={() => setMostrarFormulario(false)} // Cierra el formulario
                        sx={{
                            color: 'black',
                            fontSize: '0.875rem',
                            marginLeft: 1,
                        }}
                    >
                        Cancelar
                    </Button>
                </form>
            )}
        </div>
    );
};

export default FormularioCategoria;
