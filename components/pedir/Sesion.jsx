import React, { useState, useEffect } from 'react';
import { Box, Typography, Menu, MenuItem } from '@mui/material';
import Link from 'next/link';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

const Sesion = () => {
    const [usuario, setUsuario] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);

    useEffect(() => {
        const usuarioGuardado = localStorage.getItem('usuario');
        if (usuarioGuardado) {
            setUsuario(JSON.parse(usuarioGuardado));
        }
    }, []);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        localStorage.removeItem('usuario');
        handleClose();
        window.location.reload();
    };

    return (
        <Box sx={{
            display: 'flex',
            gap: 2,
            alignItems: 'center'
        }}>
            {!usuario ? (
                <Link href="/login" passHref>
                    <Box sx={{
                        backgroundColor: 'white',
                        color: 'black',
                        padding: { xs: '4px 12px', sm: '8px 16px' },
                        borderRadius: '20px',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                            transform: 'scale(1.05)',
                            boxShadow: '0 0 10px rgba(255,255,255,0.3)'
                        }
                    }}>
                        <Typography sx={{
                            fontSize: { xs: '0.8rem', sm: '0.9rem' },
                            fontWeight: 'bold',
                            whiteSpace: 'nowrap'
                        }}>
                            Iniciar sesión
                        </Typography>
                    </Box>
                </Link>
            ) : (
                <>
                    {usuario.admin && (
                        <Link href="/crearmenu" passHref>
                            <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                backgroundColor: '#4caf50',
                                color: 'white',
                                padding: { xs: '4px 12px', sm: '8px 16px' },
                                borderRadius: '20px',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    transform: 'scale(1.05)',
                                    boxShadow: '0 0 10px rgba(76,175,80,0.3)',
                                    backgroundColor: '#45a049'
                                }
                            }}>
                                <AdminPanelSettingsIcon sx={{ fontSize: '1.5rem' }} />
                                <Typography sx={{
                                    fontSize: { xs: '0.8rem', sm: '0.9rem' },
                                    fontWeight: 'bold',
                                    whiteSpace: 'nowrap'
                                }}>
                                    Panel Admin
                                </Typography>
                            </Box>
                        </Link>
                    )}

                    <Box
                        onClick={handleClick}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            backgroundColor: 'white',
                            color: 'black',
                            padding: { xs: '4px 12px', sm: '8px 16px' },
                            borderRadius: '20px',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                transform: 'scale(1.05)',
                                boxShadow: '0 0 10px rgba(255,255,255,0.3)'
                            }
                        }}
                    >
                        <AccountCircleIcon sx={{ fontSize: '1.5rem' }} />
                        <Typography sx={{
                            fontSize: { xs: '0.8rem', sm: '0.9rem' },
                            fontWeight: 'bold',
                            whiteSpace: 'nowrap'
                        }}>
                            {usuario.name}
                        </Typography>
                    </Box>

                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                        PaperProps={{
                            sx: {
                                mt: 1.5,
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                borderRadius: '8px',
                                minWidth: '150px'
                            }
                        }}
                        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    >
                        <MenuItem 
                            onClick={handleLogout}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                color: 'error.main',
                                '&:hover': {
                                    backgroundColor: 'error.light',
                                    color: 'error.dark'
                                }
                            }}
                        >
                            <LogoutIcon fontSize="small" />
                            <Typography>Cerrar sesión</Typography>
                        </MenuItem>
                    </Menu>
                </>
            )}
        </Box>
    );
};

export default Sesion; 