import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Alert } from '@mui/material';

const RegisterForm = ({ correo, contraseña, setCorreo, setContraseña }) => {
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [confirmarContraseña, setConfirmarContraseña] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setIsLoading(true);

        // Validar que las contraseñas coincidan
        if (contraseña !== confirmarContraseña) {
            setError('Las contraseñas no coinciden');
            setIsLoading(false);
            return;
        }

        const datos = {
            email: correo.toLowerCase(),
            password: contraseña
        };

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(datos)
            });
            
            const data = await response.json();

            if (!data.success) {
                throw new Error(data.message || 'Error en el registro');
            }

            setSuccess('¡Registro exitoso! Ya puedes iniciar sesión');
            
            // Limpiar formulario
            setCorreo('');
            setContraseña('');
            setConfirmarContraseña('');
            setTimeout(() => {
                window.location.href = '/pedir';
            }, 1500);

        } catch (error) {
            setError(error.message || 'Error al intentar registrarse');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleRegister}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}
                {success && (
                    <Alert severity="success" sx={{ mb: 2 }}>
                        {success}
                    </Alert>
                )}

                <Typography variant="h6" sx={{ mb: 1 }}>
                    Correo electrónico
                </Typography>
                <TextField
                    required
                    fullWidth
                    type="email"
                    variant="outlined"
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    placeholder="ejemplo@correo.com"
                    sx={{ maxWidth: '400px', mb: 3 }}
                />
                
                <Typography variant="h6" sx={{ mb: 1 }}>
                    Contraseña
                </Typography>
                <TextField
                    required
                    fullWidth
                    type="password"
                    variant="outlined"
                    value={contraseña}
                    onChange={(e) => setContraseña(e.target.value)}
                    sx={{ maxWidth: '400px', mb: 3 }}
                />

                <Typography variant="h6" sx={{ mb: 1 }}>
                    Confirmar Contraseña
                </Typography>
                <TextField
                    required
                    fullWidth
                    type="password"
                    variant="outlined"
                    value={confirmarContraseña}
                    onChange={(e) => setConfirmarContraseña(e.target.value)}
                    sx={{ maxWidth: '400px', mb: 3 }}
                />
            </Box>

            <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Button
                    type="submit"
                    variant="contained"
                    disabled={isLoading}
                    sx={{
                        backgroundColor: "black",
                        color: "white",
                        fontSize: '1.5rem',
                        padding: '10px 20px',
                        borderRadius: '5px',
                        '&:hover': {
                            backgroundColor: '#333',
                        },
                        '&:disabled': {
                            backgroundColor: '#666',
                        }
                    }}
                >
                    {isLoading ? 'Registrando...' : 'Registrarse'}
                </Button>
            </Box>
        </form>
    );
};

export default RegisterForm;