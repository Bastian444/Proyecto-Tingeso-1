import React from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Box, Typography } from '@mui/material';

const DecideUsers = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const handleDecision = async (decision) => {
        // Mapear la decisión a 'V' o 'R' según sea el caso
        const state = decision === 'Validado' ? 'V' : 'R';

        try {
            await axios.put(`http://localhost:8100/api/v1/user/${id}`, { state });
            navigate('/revisar-registros');
        } catch (error) {
            console.error('Error al actualizar el estado del usuario', error);
        }
    };

    return (
        <Box sx={{ padding: 4, textAlign: 'center' }}>
            <Typography variant="h4" gutterBottom>Decidir sobre Usuario #{id}</Typography>
            <Button variant="contained" color="success" onClick={() => handleDecision('Validado')} sx={{ margin: 2 }}>
                Validar
            </Button>
            <Button variant="contained" color="error" onClick={() => handleDecision('Rechazado')} sx={{ margin: 2 }}>
                Rechazar
            </Button>
        </Box>
    );
};

export default DecideUsers;
