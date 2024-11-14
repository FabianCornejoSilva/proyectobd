// ProductoCard.jsx
import React from 'react';
import { Box, Button, Typography, Card, CardMedia, CardContent, CardActions } from '@mui/material';
import Image from 'next/image';

const formatPrice = (precio) => {
    return precio.toLocaleString('es-CL'); // Formato normal
};

const ProductoCard = ({ producto, agregarAlCarrito }) => {
    return (
        <Card
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.3s ease',
                borderRadius: '15px',
                overflow: 'hidden',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                }
            }}
        >
            <Box
                component="img"
                src={`/imagenes/menu/${producto.imagen}`}
                alt={producto.nombre}
                sx={{
                    width: '100%',
                    height: '200px',
                    objectFit: 'cover',
                    transition: 'transform 0.3s ease',
                    '&:hover': {
                        transform: 'scale(1.05)',
                    }
                }}
            />
            
            <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <Typography 
                    variant="h6" 
                    sx={{ 
                        fontWeight: 'bold',
                        color: 'black',
                        marginBottom: 1 
                    }}
                >
                    {producto.nombre}
                </Typography>
                
                <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ 
                        marginBottom: 2,
                        maxHeight: '100px',
                        overflowY: 'auto',
                    }}
                >
                    {producto.descripcion}
                </Typography>
            </CardContent>

            <CardActions sx={{ padding: '16px', justifyContent: 'space-between' }}>
                <Typography 
                    variant="h6" 
                    className="precio"
                    sx={{ 
                        transition: 'all 0.3s ease',
                        fontWeight: 'bold',
                        color: 'black',
                    }}
                >
                    ${formatPrice(producto.precio)} CLP
                </Typography>
                <Button 
                    size="small"
                    variant="contained"
                    onClick={() => agregarAlCarrito(producto)}
                    sx={{
                        backgroundColor: '#0d47a1',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                            backgroundColor: '#0a3570',
                            transform: 'scale(1.02)',
                        }
                    }}
                >
                    Agregar al Carrito
                </Button>
            </CardActions>
        </Card>
    );
};

export default ProductoCard;
