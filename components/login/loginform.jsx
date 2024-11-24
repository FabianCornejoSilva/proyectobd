import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Alert } from '@mui/material';

const LoginForm = ({ correo, contraseña, setCorreo, setContraseña, handleSubmit }) => {
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setIsLoading(true);

        const datos = {
            email: correo.toLowerCase(),
            password: contraseña
        };

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(datos)
            });
            
            const data = await response.json();

            if (!data.success) {
                throw new Error(data.message || 'Error en el inicio de sesión');
            }

            setSuccess('¡Bienvenido! Inicio de sesión exitoso');
            
            localStorage.setItem('usuario', JSON.stringify({
                email: data.user.email,
                token: data.token
            }));
            
            setTimeout(() => {
                window.location.href = '/pedir';
            }, 1500);

        } catch (error) {
            setError(error.message || 'Error al intentar iniciar sesión');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleLogin}>
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
                    sx={{ maxWidth: '400px', mb: 2 }}
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
                    {isLoading ? 'Verificando...' : 'Ingresar'}
                </Button>
            </Box>
        </form>
    );
};

export default LoginForm;