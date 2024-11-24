import React from 'react';
import { Box } from '@mui/material';
import Image from 'next/image';
import bannerImage from '../../public/imagenes/logo.png';

const LogoBanner = () => {
    return (
        <Box sx={{ my: 2, textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
            <Image
                src={bannerImage}
                alt="Logo de la Cafetería"
                layout="intrinsic"
                width={600}
                height={200}
            />
        </Box>
    );
};

export default LogoBanner;