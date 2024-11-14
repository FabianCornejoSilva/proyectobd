import React from 'react';
import { Box, Typography, Container, Button } from '@mui/material';
import Image from 'next/image';
import bannerImage from '../public/imagenes/logo.png'; // Primer banner
import tercerBannerImage from '../public/imagenes/publicidad2.png'; // Fondo

const Conocenos = () => {
    return (
        <Box>
            {/* Primer banner */}
            <Box sx={{ my: 2, textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
                <Image
                    src={bannerImage}
                    alt="Logo de la Cafetería"
                    layout="responsive"
                    width={500}
                    height={800}
                />
            </Box>

            {/* Botón para ir a la página de pedir */}
            <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Button
                    variant="contained"
                    color="black"
                    href="/pedir" 
                    sx={{
                        backgroundColor: "black",
                        color: "white",
                        fontSize: '1.5rem',
                        padding: '10px 20px',
                        borderRadius: '5px',
                    }}
                >
                    Conócenos
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
                            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)',
                            position: 'relative', // Para el subrayado
                        }}
                    >
                        Conócenos
                        <Box 
                            sx={{
                                position: 'absolute',
                                bottom: '-5px', // Ajusta la posición del subrayado
                                left: 0,
                                right: 0,
                                height: '2px', // Grosor del subrayado
                                backgroundColor: 'white', // Color del subrayado
                            }}
                        />
                    </Typography>
                    <Typography 
                        variant="h5" 
                        gutterBottom 
                        sx={{ 
                            textShadow: '1px 1px 2px rgba(0, 0, 0, 0.7)',
                        }}
                    >
                        Bienvenidos a nuestra cafetería, un lugar donde la pasión por el café y la calidez del hogar se combinan para ofrecerte una experiencia única. Desde nuestros inicios, nos hemos comprometido a seleccionar los mejores granos de café, y a prepararlos con amor y dedicación.
                    </Typography>
                    <Typography 
                        variant="h5" 
                        gutterBottom 
                        sx={{ 
                            textShadow: '1px 1px 2px rgba(0, 0, 0, 0.7)',
                        }}
                    >
                        Nuestra misión es brindarte un espacio acogedor donde puedas disfrutar de un delicioso café, acompañado de pasteles y bocados elaborados con ingredientes frescos y de alta calidad. Creemos en la importancia de ofrecer no solo productos deliciosos, sino también un ambiente en el que nuestros clientes se sientan como en casa.
                    </Typography>
                    <Typography 
                        variant="h5" 
                        gutterBottom 
                        sx={{ 
                            textShadow: '1px 1px 2px rgba(0, 0, 0, 0.7)',
                        }}
                    >
                        En nuestra cafetería, cada taza de café cuenta una historia. Te invitamos a venir, relajarte y disfrutar de la compañía de amigos y familiares. ¡Esperamos verte pronto!
                    </Typography>
                </Container>
            </Box>
        </Box>
    );
};

export default Conocenos;