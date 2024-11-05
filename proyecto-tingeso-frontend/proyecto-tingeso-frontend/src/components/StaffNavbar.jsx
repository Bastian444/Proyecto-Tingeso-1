import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function StaffNavbar() {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        // Verifica si el usuario está autenticado
        const username = localStorage.getItem('username');
        setIsAuthenticated(!!username);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('username');
        setIsAuthenticated(false);
        navigate('/iniciar-sesion-funcionario');
    };

    return (
        <AppBar position="static" color="secondary" sx={{ width: '100%' }}>
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    Funcionario
                </Typography>
                <Box sx={{ flexGrow: 1 }}>
                    <Button color="inherit" href="/revisar-solicitudes">Revisar solicitudes</Button>
                    <Button color="inherit" href="/revisar-registros">Revisar registros</Button>
                </Box>
                {!isAuthenticated ? (
                    <>
                        <Button color="inherit" href="/registro-funcionario">Registro</Button>
                        <Button color="inherit" href="/iniciar-sesion-funcionario">Iniciar sesión</Button>
                    </>
                ) : (
                    <Button color="inherit" onClick={handleLogout}>Cerrar sesión</Button>
                )}
            </Toolbar>
        </AppBar>
    );
}

export default StaffNavbar;
