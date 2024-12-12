import React, { useState } from 'react';
import { Box, Button, Container } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import LogoBanner from '../components/login/LogoBanner';
import LoginForm from '../components/login/loginform';
import RegisterForm from '../components/login/registerform';
import bannerImage2 from '../public/imagenes/logo2.png';

const Login = () => {
    const [correo, setCorreo] = useState('');
    const [contraseña, setContraseña] = useState('');
    const [mostrarRegistro, setMostrarRegistro] = useState(false);

    const cambiarFormulario = (esRegistro) => {
        setMostrarRegistro(esRegistro);
        setCorreo('');
        setContraseña('');
    };

    return (
        <Box sx={{ width: '100%' }}>
            {/* Barra negra superior */}
            <Box
                sx={{
                    position: 'sticky',
                    top: 0,
                    zIndex: 1000,
                    backgroundColor: 'black',
                    color: 'white',
                    padding: '8px 16px',
                    width: '100%',
                    minHeight: '80px',
                    display: 'flex',
                    alignItems: 'center'
                }}
            >
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2
                }}>
                    <Image
                        src={bannerImage2}
                        alt="Logo"
                        width={140}
                        height={119}
                        style={{
                            objectFit: 'contain',
                            width: '150px',
                            height: 'auto',
                            marginRight: '20px'
                        }}
                    />

                    <Box sx={{
                        display: 'flex',
                        gap: 2,
                        alignItems: 'center'
                    }}>
                        <Link href="/pedir" passHref>
                            <Box sx={{
                                backgroundColor: 'white',
                                color: 'black',
                                padding: { xs: '4px 12px', sm: '8px 16px' },
                                borderRadius: '20px',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                fontWeight: 'bold', // Make text bold
                                '&:hover': {
                                    transform: 'scale(1.05)',
                                    boxShadow: '0 0 10px rgba(255,255,255,0.3)'
                                }
                            }}>
                                PIDE AQUÍ
                            </Box>
                        </Link>

                        <Link href="/conocenos" passHref>
                            <Box sx={{
                                backgroundColor: 'white',
                                color: 'black',
                                padding: { xs: '4px 12px', sm: '8px 16px' },
                                borderRadius: '20px',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                fontWeight: 'bold', // Make text bold
                                '&:hover': {
                                    transform: 'scale(1.05)',
                                    boxShadow: '0 0 10px rgba(255,255,255,0.3)'
                                }
                            }}>
                                CONÓCENOS
                            </Box>
                        </Link>
                    </Box>
                </Box>
            </Box>

            {/* Contenedor principal del formulario */}
            <Container maxWidth="sm">
                <Box
                    sx={{
                        mt: 2,
                        mb: 8,
                        backgroundColor: 'white',
                        borderRadius: '15px',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                        overflow: 'hidden',
                    }}
                >
                    {/* Barra de navegación de formularios */}
                    <Box
                        sx={{
                            display: 'flex',
                            width: '100%',
                            borderBottom: '1px solid #e0e0e0',
                        }}
                    >
                        <Button
                            onClick={() => cambiarFormulario(false)}
                            sx={{
                                flex: 1,
                                padding: { xs: '4px 12px', sm: '8px 16px' },
                                borderRadius: '20px',
                                backgroundColor: !mostrarRegistro ? 'black' : 'transparent',
                                color: !mostrarRegistro ? 'white' : 'black',
                                '&:hover': {
                                    backgroundColor: !mostrarRegistro ? '#333' : '#f5f5f5',
                                },
                                transition: 'all 0.3s ease',
                                fontSize: '1rem',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                '&:hover': {
                                    transform: 'scale(1.05)',
                                    boxShadow: '0 0 10px rgba(255,255,255,0.3)'
                                }
                            }}
                        >
                            Iniciar Sesión
                        </Button>
                        <Button
                            onClick={() => cambiarFormulario(true)}
                            sx={{
                                flex: 1,
                                padding: { xs: '4px 12px', sm: '8px 16px' },
                                borderRadius: '20px',
                                backgroundColor: mostrarRegistro ? 'black' : 'transparent',
                                color: mostrarRegistro ? 'white' : 'black',
                                '&:hover': {
                                    backgroundColor: mostrarRegistro ? '#333' : '#f5f5f5',
                                },
                                transition: 'all 0.3s ease',
                                fontSize: '1rem',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                '&:hover': {
                                    transform: 'scale(1.05)',
                                    boxShadow: '0 0 10px rgba(255,255,255,0.3)'
                                }
                            }}
                        >
                            Registrarse
                        </Button>
                    </Box>

                    {/* Contenedor del formulario */}
                    <Box sx={{ padding: '2rem' }}>
                        {mostrarRegistro ? (
                            <RegisterForm 
                                correo={correo}
                                contraseña={contraseña}
                                setCorreo={setCorreo}
                                setContraseña={setContraseña}
                            />
                        ) : (
                            <LoginForm 
                                correo={correo}
                                contraseña={contraseña}
                                setCorreo={setCorreo}
                                setContraseña={setContraseña}
                            />
                        )}
                    </Box>
                </Box>
            </Container>

            {/* Banner negro inferior */}
            <Box
                sx={{
                    backgroundColor: 'black',
                    color: 'white',
                    width: '100%',
                    padding: '15px 0',
                    textAlign: 'center',
                    position: 'fixed',
                    bottom: 0
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: 8,
                        flexWrap: 'wrap',
                        maxWidth: '1200px',
                        margin: '0 auto',
                        padding: '0 20px',
                    }}
                >
                    <Box>
                        <Box sx={{ mb: 2 }}>Contacto</Box>
                        <Box>+56 9 6666 6666</Box>
                        <Box>contacto@cafeteria.cl</Box>
                    </Box>

                    <Box>
                        <Box sx={{ mb: 2 }}>Ubicación</Box>
                        <Box>Av.calle 123, Valparaíso</Box>
                        <Box>Valparaíso, Chile</Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default Login;