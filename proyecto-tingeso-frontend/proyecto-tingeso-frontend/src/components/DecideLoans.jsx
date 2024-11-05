import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Box, Typography, Paper, CircularProgress, Divider } from '@mui/material';
import './DecideLoans.css';

const DecideLoans = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loan, setLoan] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [debtToIncomeRatio, setDebtToIncomeRatio] = useState(null);
    const [financingPercentage, setFinancingPercentage] = useState(null);

    useEffect(() => {
        const fetchLoan = async () => {
            try {
                const response = await axios.get(`http://localhost:8100/api/v1/loans/${id}`);
                const loanData = response.data;
                setLoan(loanData);

                // Corrección en la fórmula de la relación cuota/ingreso
                const ratio = ((loanData.monthlyPayment / loanData.monthlyIncome) * 100 * 0.1).toFixed(2);
                setDebtToIncomeRatio(ratio);

                // Calcular el porcentaje de financiamiento actual
                const percentage = ((loanData.amount / loanData.propertyValue) * 100).toFixed(2);
                setFinancingPercentage(percentage);

                setLoading(false);
            } catch (err) {
                setError('Error al cargar los detalles del préstamo');
                setLoading(false);
            }
        };

        fetchLoan();
    }, [id]);

    const handleDecision = async (newState) => {
        try {
            await axios.put(`http://localhost:8100/api/v1/loans/${id}`, { state: newState });
            setLoan((prevLoan) => ({ ...prevLoan, state: newState }));
        } catch (error) {
            console.error('Error al actualizar el estado del préstamo', error);
        }
    };

    if (loading) return <CircularProgress />;
    if (error) return <Typography color="error">{error}</Typography>;

    const years = Math.floor(loan.termMonths / 12);
    const remainingMonths = loan.termMonths % 12;

    // Evaluación de la capacidad de ahorro
    let savingsEvaluationMessage = '';
    let savingsEvaluationClass = '';
    if (loan.rulesAchieved >= 5) {
        savingsEvaluationMessage = 'Aprobado - La capacidad de ahorro es sólida';
        savingsEvaluationClass = 'approved-text';
    } else if (loan.rulesAchieved >= 3) {
        savingsEvaluationMessage = 'Revisión adicional - Se requiere revisión adicional';
        savingsEvaluationClass = 'moderate-text';
    } else {
        savingsEvaluationMessage = 'Rechazado - La capacidad de ahorro es insuficiente';
        savingsEvaluationClass = 'rejected-text';
    }

    // Evaluación del monto máximo de financiamiento
    let financingEvaluationMessage = '';
    let financingEvaluationClass = '';

    switch (loan.type) {
        case 'FV': // Primera Vivienda
            financingEvaluationMessage = financingPercentage <= 80
                ? `Aprobado - Porcentaje de financiamiento actual ${financingPercentage}%`
                : `Rechazado - Porcentaje de financiamiento actual ${financingPercentage}%`;
            financingEvaluationClass = financingPercentage <= 80 ? 'approved-text' : 'rejected-text';
            break;
        case 'SV': // Segunda Vivienda
            financingEvaluationMessage = financingPercentage <= 70
                ? `Aprobado - Porcentaje de financiamiento actual ${financingPercentage}%`
                : `Rechazado - Porcentaje de financiamiento actual ${financingPercentage}%`;
            financingEvaluationClass = financingPercentage <= 70 ? 'approved-text' : 'rejected-text';
            break;
        case 'PC': // Propiedades Comerciales
            financingEvaluationMessage = financingPercentage <= 60
                ? `Aprobado - Porcentaje de financiamiento actual ${financingPercentage}%`
                : `Rechazado - Porcentaje de financiamiento actual ${financingPercentage}%`;
            financingEvaluationClass = financingPercentage <= 60 ? 'approved-text' : 'rejected-text';
            break;
        case 'R': // Remodelación
            financingEvaluationMessage = financingPercentage <= 50
                ? `Aprobado - Porcentaje de financiamiento actual ${financingPercentage}%`
                : `Rechazado - Porcentaje de financiamiento actual ${financingPercentage}%`;
            financingEvaluationClass = financingPercentage <= 50 ? 'approved-text' : 'rejected-text';
            break;
        default:
            financingEvaluationMessage = '[Por definir]';
            financingEvaluationClass = '';
            break;
    }

    // Evaluación de la edad del solicitante
    const ageEvaluationClass = loan.ageEvaluation === 'Rechazado' ? 'rejected-text' : 'approved-text';
    const ageEvaluationMessage = `${loan.ageEvaluation} - Edad al finalizar el préstamo: ${loan.finalApplicantAge} años`;

    return (
        <Box sx={{ padding: 4, textAlign: 'center' }}>
            <Typography variant="h4" gutterBottom>Decidir sobre Préstamo #{id}</Typography>

            <Paper elevation={3} sx={{ padding: 4, marginTop: 3, marginBottom: 3, textAlign: 'left' }}>
                <Typography variant="h6">Detalles del Préstamo</Typography>
                <Divider sx={{ marginY: 2 }} />
                <Typography><strong>ID:</strong> {loan.id}</Typography>
                <Typography><strong>RUT del Solicitante:</strong> {loan.rut}</Typography>
                <Typography><strong>Fecha de Solicitud:</strong> {new Date(loan.date).toLocaleDateString()}</Typography>
                <Typography><strong>Monto:</strong> ${loan.amount}</Typography>
                <Typography><strong>Tipo de Préstamo:</strong> {loan.type}</Typography>
                <Typography><strong>Estado:</strong> {loan.state}</Typography>
                <Typography><strong>Pago Mensual:</strong> ${loan.monthlyPayment}</Typography>
                <Typography><strong>Ingreso Mensual:</strong> ${loan.monthlyIncome}</Typography>
                <Typography><strong>Relación Cuota/Ingreso:</strong> {debtToIncomeRatio}%</Typography>
                <Typography>
                    <strong>Plazo de Pago:</strong> {loan.termMonths} meses ({years} años {remainingMonths > 0 ? `y ${remainingMonths} meses` : ''})
                </Typography>

                <Typography variant="h6" sx={{ marginTop: 3 }}>Evaluación</Typography>
                <Divider sx={{ marginY: 2 }} />
                <Typography className={debtToIncomeRatio < 35 ? 'rejected-text' : 'approved-text'}>
                    <strong>1) Relación Cuota/Ingreso:</strong> {debtToIncomeRatio < 35 ? `Rechazado - Porcentaje actual: ${debtToIncomeRatio}% (Mínimo 35%)` : `Aprobado - Porcentaje actual: ${debtToIncomeRatio}%`}
                </Typography>
                <Typography className={loan.inDicom ? 'rejected-text' : 'approved-text'}>
                    <strong>2) Historial Crediticio del Cliente:</strong> {loan.inDicom ? 'Rechazado - El cliente se encuentra moroso en el Directorio de Información Comercial.' : 'Aprobado - El cliente no se encuentra moroso (Revisar documentación igualmente).'}
                </Typography>
                <Typography className={loan.workYears < 12 ? 'rejected-text' : 'approved-text'}>
                    <strong>3) Antigüedad Laboral y Estabilidad:</strong> {loan.workYears < 12 ? 'Rechazado - El cliente no tiene suficiente antigüedad laboral' : `Aprobado - Antigüedad laboral de ${loan.workYears} meses`}
                </Typography>
                <Typography className={(loan.debtUser + loan.monthlyPayment) > (loan.monthlyIncome / 2) ? 'rejected-text' : 'approved-text'}>
                    <strong>4) Relación Deuda/Ingreso:</strong> {(loan.debtUser + loan.monthlyPayment) > (loan.monthlyIncome / 2) ? 'Rechazado - La deuda de este usuario supera sus ingresos' : 'Aprobado - El cliente puede sustentar su deuda con sus ingresos'}
                </Typography>
                <Typography className={financingEvaluationClass}>
                    <strong>5) Monto Máximo de Financiamiento:</strong> {financingEvaluationMessage}
                </Typography>
                <Typography className={ageEvaluationClass}>
                    <strong>6) Edad del Solicitante:</strong> {ageEvaluationMessage}
                </Typography>
                <Typography className={savingsEvaluationClass}>
                    <strong>7) Capacidad de Ahorro:</strong> {savingsEvaluationMessage}
                </Typography>
            </Paper>

            <Box sx={{ marginTop: 4 }}>
                <Button className="btn-pendiente" onClick={() => handleDecision('E2')} sx={{ margin: 1 }}>Pendiente de Documentación</Button>
                <Button className="btn-evaluacion" onClick={() => handleDecision('E3')} sx={{ margin: 1 }}>En Evaluación</Button>
                <Button className="btn-preaprobada" onClick={() => handleDecision('E4')} sx={{ margin: 1 }}>Pre-Aprobada</Button>
                <Button className="btn-aprobacion-final" onClick={() => handleDecision('E5')} sx={{ margin: 1 }}>En Aprobación Final</Button>
                <Button className="btn-aprobada" onClick={() => handleDecision('E6')} sx={{ margin: 1 }}>Aprobada</Button>
                <Button className="btn-rechazada" onClick={() => handleDecision('E7')} sx={{ margin: 1 }}>Rechazada</Button>
                <Button className="btn-desembolso" onClick={() => handleDecision('E9')} sx={{ margin: 1 }}>En Desembolso</Button>
            </Box>
        </Box>
    );
};

export default DecideLoans;
