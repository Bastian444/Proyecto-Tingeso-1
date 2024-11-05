import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Typography, Box, CircularProgress } from '@mui/material';

const CheckAccState = () => {
    const [state, setState] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const rut = localStorage.getItem('rut'); // Obtener el rut del localStorage

    useEffect(() => {
        if (!rut) {
            setError("No se encontró el RUT del usuario. Inicia sesión nuevamente.");
            setLoading(false);
            return;
        }

        const fetchState = async () => {
            try {
                const response = await axios.get(`http://localhost:8100/api/v1/user/state/rut/${rut}`);
                setState(response.data);
                setLoading(false);
            } catch (err) {
                setError('Error al obtener el estado de la cuenta');
                setLoading(false);
            }
        };

        fetchState();
    }, [rut]);

    if (loading) return <CircularProgress />;
    if (error) return <Typography color="error">{error}</Typography>;

    const getStatusMessage = () => {
        switch (state) {
            case "EV":
                return "Tu cuenta está en evaluación. Revisa más tarde!";
            case "R":
                return "Tu cuenta no ha pasado la validación, reenvía la documentación por favor";
            case "V":
                return "Tu cuenta ha sido validada por uno de nuestros ejecutivos, ya puedes solicitar un crédito!";
            default:
                return "Estado de cuenta desconocido. Contacte soporte.";
        }
    };

    return (
        <Box sx={{ padding: 4, textAlign: 'center' }}>
            <Typography variant="h4">Estado de la Cuenta</Typography>
            <Typography variant="h6" sx={{ marginTop: 2 }}>
                {getStatusMessage()}
            </Typography>
        </Box>
    );
};

export default CheckAccState;
