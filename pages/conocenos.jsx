import React from 'react';
import { Box, Typography, Container, Button } from '@mui/material';
import Image from 'next/image';
import bannerImage from '../public/imagenes/logo.png'; // Primer banner
import tercerBannerImage from '../public/imagenes/publicidad2.png'; // Fondo
import Link from 'next/link';
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    overflow-x: hidden;
    width: 100%;
  }
`;

const Conocenos = () => {
    return (
        <>
            <GlobalStyle />
            <Box sx={{ 
                width: '100%',
                maxWidth: '100vw',
                margin: 0,
                padding: 0,
                overflowX: 'hidden',
                position: 'relative',
                boxSizing: 'border-box'
            }}>
                {/* Contenedor principal */}
                <Container 
                    disableGutters 
                    sx={{ 
                        maxWidth: '100% !important',
                        overflowX: 'hidden',
                        padding: 0,
                        margin: 0,
                        width: '100%'
                    }}
                >
                    {/* Barra blanca superior con logo y botones */}
                    <Box
                        sx={{
                            position: 'sticky',
                            top: 0,
                            zIndex: 1000,
                            backgroundColor: 'white',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                            padding: '8px 16px',
                            display: 'flex',
                            alignItems: 'center',
                            height: '80px',
                            width: '100%',
                            overflow: 'visible'
                        }}
                    >
                        {/* Contenedor para logo y botones */}
                        <Box sx={{
                            position: 'relative',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 3,
                            marginLeft: '20px'
                        }}>
                            {/* Logo */}
                            <Image
                                src={bannerImage}
                                alt="Logo"
                                width={150}
                                height={119}
                                style={{ 
                                    objectFit: 'contain',
                                }}
                            />

                            {/* Botón Pide Aquí */}
                            <Link href="/pedir" passHref>
                                <Box
                                    sx={{
                                        backgroundColor: 'black',
                                        color: 'white',
                                        padding: '8px 20px',
                                        borderRadius: '20px',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            transform: 'scale(1.05)',
                                            boxShadow: '0 0 10px rgba(0,0,0,0.3)'
                                        }
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            fontSize: '0.9rem',
                                            fontWeight: 'bold',
                                            textTransform: 'uppercase',
                                            letterSpacing: '1px',
                                            color: 'white'
                                        }}
                                    >
                                        Pide Aquí
                                    </Typography>
                                </Box>
                            </Link>

                            {/* Botón Conócenos */}
                            <Link href="/conocenos" passHref>
                                <Box
                                    sx={{
                                        backgroundColor: 'black',
                                        color: 'white',
                                        padding: '8px 20px',
                                        borderRadius: '20px',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            transform: 'scale(1.05)',
                                            boxShadow: '0 0 10px rgba(0,0,0,0.3)'
                                        }
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            fontSize: '0.9rem',
                                            fontWeight: 'bold',
                                            textTransform: 'uppercase',
                                            letterSpacing: '1px',
                                            color: 'white'
                                        }}
                                    >
                                        Conócenos
                                    </Typography>
                                </Box>
                            </Link>
                        </Box>
                    </Box>

                    {/* Contenedor con fondo */}
                    <Box
                        sx={{
                            backgroundImage: `url(${tercerBannerImage.src})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            padding: { xs: 2, sm: 4 },  // Padding responsive
                            minHeight: '100vh',
                            color: 'white',
                            width: '100%',
                            boxSizing: 'border-box'
                        }}
                    >
                        <Container maxWidth="lg" sx={{ py: 8 }}>
                            {/* Contenido principal */}
                            <Box sx={{ 
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 4,
                                maxWidth: '800px',
                                margin: '0 auto'
                            }}>
                                 {/* Horario */}
                                 <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2, color: 'white' }}>
                                    Conócenos
                                </Typography>
                                <Typography variant="h6" sx={{ mb: 4, color: 'white' }}>
                                    Nuestra cafetería ofrece un ambiente acogedor donde disfrutar de un café recién preparado, 
                                    acompañado de deliciosas opciones de repostería artesanal. Nos enfocamos en la calidad de nuestros productos y 
                                    en brindar un servicio cálido y personalizado. Un espacio perfecto para relajarse o trabajar con comodidad.
                                </Typography>
                                {/* Horario */}
                                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2, color: 'white' }}>
                                    Horario de Atención
                                </Typography>
                                <Typography variant="h6" sx={{ mb: 4, color: 'white' }}>
                                    Lunes a Viernes: 8:00 AM - 8:00 PM
                                    <br />
                                    Sábados y Domingos: 9:00 AM - 6:00 PM
                                </Typography>

                                {/* Dirección */}
                                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2, color: 'white' }}>
                                    Ubicación
                                </Typography>
                                <Typography variant="h6" sx={{ mb: 4, color: 'white' }}>
                                    Av.calle 123, Valparaíso
                                    <br />
                                    Región Valparaíso, Chile
                                </Typography>

                                {/* Teléfono */}
                                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2, color: 'white' }}>
                                    Contacto
                                </Typography>
                                <Typography variant="h6" sx={{ color: 'white' }}>
                                    Teléfono: +56 9 6666 6666
                                    <br />
                                    Email
                                </Typography>
                            </Box>
                        </Container>
                    </Box>
                </Container>
            </Box>
        </>
    );
};

export default Conocenos;