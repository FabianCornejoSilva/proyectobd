import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import tercerBannerImage from '../../public/imagenes/publicidad2.png';

const Banner = () => {
    return (
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
                    }}
                >
                </Typography>
            </Container>
        </Box>
    );
};

export default Banner;