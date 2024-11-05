import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress } from '@mui/material';

const CheckRequestsState = () => {
    const [loans, setLoans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const rut = localStorage.getItem('rut');

    useEffect(() => {
        const fetchLoans = async () => {
            try {
                const response = await axios.get(`http://localhost:8100/api/v1/loans/user/${rut}`);
                setLoans(response.data);
                setLoading(false);
            } catch (err) {
                setError('Error al obtener las solicitudes de préstamos');
                setLoading(false);
            }
        };

        fetchLoans();
    }, [rut]);

    if (loading) return <CircularProgress />;
    if (error) return <Typography color="error">{error}</Typography>;

    return (
        <Box sx={{ padding: 4 }}>
            <Typography variant="h4" gutterBottom>Estado de Solicitudes de Préstamo</Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Fecha</TableCell>
                            <TableCell>Monto</TableCell>
                            <TableCell>Tipo</TableCell>
                            <TableCell>Estado</TableCell>
                            <TableCell>Pago Mensual</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loans.map((loan) => (
                            <TableRow key={loan.id}>
                                <TableCell>{loan.id}</TableCell>
                                <TableCell>{new Date(loan.date).toLocaleDateString()}</TableCell>
                                <TableCell>${loan.amount}</TableCell>
                                <TableCell>{loan.type}</TableCell>
                                <TableCell>{loan.state}</TableCell>
                                <TableCell>${loan.monthlyPayment}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default CheckRequestsState;
