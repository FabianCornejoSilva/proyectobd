import React, { useState } from 'react';
import { Box } from '@mui/material';
import LogoBanner from '../components/login/LogoBanner';
import LoginForm from '../components/login/LoginForm';
import Banner from '../components/login/Banner';

const Login = () => {
    const [correo, setCorreo] = useState('');
    const [contraseña, setContraseña] = useState('');

    const handleSubmit = () => {
        console.log('Datos enviados:', { correo, contraseña });
        // Aquí iría la lógica para enviar los datos
    };

    return (
        <Box>
            <LogoBanner />
            <LoginForm 
                correo={correo}
                contraseña={contraseña}
                setCorreo={setCorreo}
                setContraseña={setContraseña}
                handleSubmit={handleSubmit}
            />
            <Banner />
        </Box>
    );
};

export default Login;
