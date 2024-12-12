import React from 'react';
import { Box, Typography, Divider, Button, IconButton } from '@mui/material';
import Image from 'next/image';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';

const Carrito = ({ 
    showCarrito, 
    carrito, 
    total, 
    agregarAlCarrito, 
    removerDelCarrito, 
    limpiarCarrito 
}) => {
    return (
        <Box
            sx={{
                position: 'fixed',
                right: showCarrito ? 0 : '-400px',
                top: '80px',
                width: '400px',
                height: 'calc(100vh - 80px)',
                backgroundColor: 'white',
                boxShadow: '-2px 0 5px rgba(0,0,0,0.1)',
                transition: 'right 0.3s ease',
                zIndex: 1000,
                display: 'flex',
                flexDirection: 'column',
                padding: '20px',
            }}
        >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Carrito de Compras</Typography>
                <Button 
                    variant="contained" 
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={limpiarCarrito}
                    size="small"
                >
                    Vaciar
                </Button>
            </Box>
            <Divider sx={{ mb: 2 }} />
            
            <Box sx={{ flex: 1, overflowY: 'auto' }}>
                {carrito.map((item) => (
                    <Box 
                        key={item._id}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                            mb: 2,
                            p: 1,
                            borderRadius: 1,
                            backgroundColor: '#f5f5f5'
                        }}
                    >
                        {item.imagen && (
                            <Box sx={{ width: 50, height: 50, position: 'relative' }}>
                                <Image
                                    src={item.imagen}
                                    alt={item.nombre}
                                    width={50}
                                    height={50}
                                    style={{ 
                                        borderRadius: '4px',
                                        objectFit: 'cover' 
                                    }}
                                />
                            </Box>
                        )}
                        <Box sx={{ flex: 1 }}>
                            <Typography variant="body1">{item.nombre}</Typography>
                            <Typography variant="body2" color="text.secondary">
                                ${item.precio.toLocaleString('es-CL')} x {item.cantidad}
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <IconButton 
                                size="small"
                                onClick={() => removerDelCarrito(item._id)}
                            >
                                <RemoveCircleOutlineIcon />
                            </IconButton>
                            <Typography>{item.cantidad}</Typography>
                            <IconButton 
                                size="small"
                                onClick={() => agregarAlCarrito(item)}
                            >
                                <AddCircleOutlineIcon />
                            </IconButton>
                        </Box>
                    </Box>
                ))}
            </Box>
            
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6">
                Total: ${total.toLocaleString('es-CL')}
            </Typography>
            <Button 
                variant="contained" 
                fullWidth 
                sx={{ mt: 2 }}
                disabled={carrito.length === 0}
            >
                Proceder al pago
            </Button>
        </Box>
    );
};

export default Carrito; 