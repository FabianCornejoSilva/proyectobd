// ProductoCard.jsx
import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import Image from 'next/image';

const ProductoCard = ({ producto, agregarAlCarrito }) => {
    return (
        <Box 
            sx={{
                border: '1px solid #ccc',
                borderRadius: '8px',
                padding: 2,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: '350px',
                overflow: 'hidden'
            }}
        >
            {/* Imagen del producto */}
            <Box sx={{ position: 'relative', width: '100%', height: '200px' }}>
                <Image 
                    src={`/imagenes/menu/${producto.imagen}`} // Asegúrate de que la ruta sea correcta
                    alt={producto.nombre}
                    layout="fill" // Esto hará que la imagen se ajuste al contenedor
                    objectFit="cover" // Esto mantendrá la relación de aspecto
                />
            </Box>

            <Typography variant="h6" sx={{ mt: 1 }}>{producto.nombre}</Typography>
            <Typography variant="body1">{producto.precio.toLocaleString('es-CL')} CLP</Typography>
            <Button 
                variant="contained" 
                sx={{ 
                    backgroundColor: 'black', // Cambiar color de fondo a negro
                    color: 'white', // Color del texto a blanco
                    marginTop: 'auto', 
                    width: '100%', 
                    padding: 1 
                }} 
                onClick={() => agregarAlCarrito(producto)}
            >
                Agregar al carrito
            </Button>
        </Box>
    );
};

export default ProductoCard;
