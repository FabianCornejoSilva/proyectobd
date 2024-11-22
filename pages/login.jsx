import React, { useState } from 'react';
import { Box, Typography, Container, Button, TextField } from '@mui/material';
import Image from 'next/image';
import bannerImage from '../public/imagenes/logo.png'; // Primer banner
import tercerBannerImage from '../public/imagenes/publicidad2.png'; // Fondo

const Login = () => {
    const [correo, setCorreo] = useState('');
    const [contraseña, setContraseña] = useState('');

    const handleSubmit = () => {
        console.log('Datos enviados:', { correo, contraseña });
        // Aquí iría la lógica para enviar los datos
    };

    return (
        <Box>
            {/* Primer banner */}
            <Box sx={{ my: 2, textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}> {/* Limita el ancho del banner */}
                <Image
                    src={bannerImage}
                    alt="Logo de la Cafetería"
                    layout="intrinsic" // Cambiado a intrinsic para un tamaño fijo
                    width={600} // Ajusta el tamaño según sea necesario
                    height={200} // Ajusta el tamaño según sea necesario
                />
            </Box>

            {/* Campos de texto para login */}
            <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Typography variant="h6" sx={{ mb: 1 }}>
                    Correo electrónico
                </Typography>
                <TextField
                    fullWidth
                    variant="outlined"
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    sx={{ 
                        maxWidth: '400px',
                        mb: 3
                    }}
                />
                
                <Typography variant="h6" sx={{ mb: 1 }}>
                    Contraseña
                </Typography>
                <TextField
                    fullWidth
                    type="password"
                    variant="outlined"
                    value={contraseña}
                    onChange={(e) => setContraseña(e.target.value)}
                    sx={{ 
                        maxWidth: '400px',
                        mb: 2
                    }}
                />
            </Box>

            {/* Botón para enviar */}
            <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Button
                    variant="contained"
                    color="black"
                    onClick={handleSubmit}
                    sx={{
                        backgroundColor: "black",
                        color: "white",
                        fontSize: '1.5rem',
                        padding: '10px 20px',
                        borderRadius: '5px',
                    }}
                >
                    Continuar
                </Button>
            </Box>

            {/* Contenedor con el tercer banner como fondo */}
            <Box
                sx={{
                    backgroundImage: `url(${tercerBannerImage.src})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    padding: 4,
                    minHeight: '100vh',
                    color: 'white',
                }}
            >
                <Container>
                    <Typography 
                        variant="h3" 
                        gutterBottom 
                        sx={{ 
                            fontWeight: 'bold',
                            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)', // Sombra para el contorno
                        }}
                    >
                    </Typography>
                </Container>
            </Box>
        </Box>
    );
};

export default Login;
