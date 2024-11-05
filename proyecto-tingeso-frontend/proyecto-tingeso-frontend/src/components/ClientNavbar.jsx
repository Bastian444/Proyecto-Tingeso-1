import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function ClientNavbar() {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        // Verifica si el usuario está autenticado
        const username = localStorage.getItem('username');
        setIsAuthenticated(!!username);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('username');
        localStorage.removeItem('rut');
        setIsAuthenticated(false);
        navigate('/iniciar-sesion');
    };

    return (
        <AppBar position="static" color="primary" sx={{ width: '100%' }}>
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    Cliente
                </Typography>
                <Box sx={{ flexGrow: 1 }}>
                    <Button color="inherit" href="/loan-calculator">Simular crédito</Button>
                    <Button color="inherit" href="/revisar-solicitud">Revisar estado solicitud</Button>
                    <Button color="inherit" href="/revisar-cuenta">Revisar estado cuenta</Button>
                    <Button color="inherit" href="/solicitar-credito">Solicitar crédito</Button>
                </Box>
                {!isAuthenticated ? (
                    <>
                        <Button color="inherit" href="/register-client">Registro</Button>
                        <Button color="inherit" href="/iniciar-sesion">Iniciar sesión</Button>
                    </>
                ) : (
                    <Button color="inherit" onClick={handleLogout}>Cerrar sesión</Button>
                )}
            </Toolbar>
        </AppBar>
    );
}

export default ClientNavbar;
