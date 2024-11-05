import React, { useState } from 'react';
import './LoanCalculator.css';

const LoanCalculator = () => {
    const [amount, setAmount] = useState('');
    const [interestRate, setInterestRate] = useState('');
    const [months, setMonths] = useState('');
    const [monthlyPayment, setMonthlyPayment] = useState('');
    const [loanType, setLoanType] = useState('');
    const [loanDetails, setLoanDetails] = useState('');
    const [error, setError] = useState('');

    const isInterestRateValid = () => {
        const rate = parseFloat(interestRate);
        switch (loanType) {
            case 'FV':
                return rate >= 3.5 && rate <= 5.0;
            case 'SV':
                return rate >= 4.0 && rate <= 6.0;
            case 'PC':
                return rate >= 5.0 && rate <= 7.0;
            case 'R':
                return rate >= 4.5 && rate <= 6.0;
            default:
                return false;
        }
    };

    const calculateLoan = () => {
        if (!isInterestRateValid()) {
            setError(`La tasa de interés debe estar dentro del rango permitido para el tipo de préstamo seleccionado.`);
            setMonthlyPayment('');
            return;
        }

        const principal = parseFloat(amount);
        const monthlyInterestRate = parseFloat(interestRate) / 100 / 12;
        const numPayments = parseInt(months, 10);
        const x = Math.pow(1 + monthlyInterestRate, numPayments);
        const monthlyPaymentAmount = (principal * monthlyInterestRate * x) / (x - 1);

        if (isFinite(monthlyPaymentAmount)) {
            setMonthlyPayment(monthlyPaymentAmount.toFixed(2));
            setError('');
        } else {
            setMonthlyPayment('');
            setError('No se pudo calcular el pago mensual. Revisa los valores ingresados.');
        }
    };

    const handleLoanTypeChange = (e) => {
        const selectedLoanType = e.target.value;
        setLoanType(selectedLoanType);

        let details = '';
        switch (selectedLoanType) {
            case 'FV':
                details = `Primera vivienda:
Plazo máximo: 30 años
Tasa de interés (Anual): 3.5% - 5.0%
Monto máximo de financiamiento: 80% del valor de la propiedad
Requisitos documentales:
- Comprobante de ingresos
- Certificado de avalúo
- Historial crediticio`;
                break;
            case 'SV':
                details = `Segunda vivienda:
Plazo máximo: 20 años
Tasa de interés (Anual): 4.0% - 6.0%
Monto máximo de financiamiento: 70% del valor de la propiedad
Requisitos documentales:
- Comprobante de ingresos
- Certificado de avalúo
- Escritura de la primera vivienda
- Historial crediticio`;
                break;
            case 'PC':
                details = `Propiedades comerciales:
Plazo máximo: 25 años
Tasa de interés (Anual): 5.0% - 7.0%
Monto máximo de financiamiento: 60% del valor de la propiedad
Requisitos documentales:
- Estado financiero del negocio
- Comprobante de ingresos
- Certificado de avalúo
- Plan de negocios`;
                break;
            case 'R':
                details = `Remodelación:
Plazo máximo: 15 años
Tasa de interés (Anual): 4.5% - 6.0%
Monto máximo de financiamiento: 50% del valor actual de la propiedad
Requisitos documentales:
- Comprobante de ingresos
- Presupuesto de la remodelación
- Certificado de avalúo actualizado`;
                break;
            default:
                details = '';
        }
        setLoanDetails(details);
    };

    return (
        <div className="loan-calculator-container">
            <h2>Simula tu crédito hipotecario!</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={(e) => {
                e.preventDefault();
                calculateLoan();
            }}>
                <input
                    type="number"
                    placeholder="Monto del préstamo"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                />
                <input
                    type="number"
                    placeholder="Tasa de interés (%)"
                    value={interestRate}
                    onChange={(e) => setInterestRate(e.target.value)}
                    required
                />
                <input
                    type="number"
                    placeholder="Meses"
                    value={months}
                    onChange={(e) => setMonths(e.target.value)}
                    required
                />

                <fieldset>
                    <legend>Selecciona el tipo de préstamo:</legend>
                    <label>
                        <input
                            type="radio"
                            value="FV"
                            checked={loanType === 'FV'}
                            onChange={handleLoanTypeChange}
                        />
                        Primera vivienda
                    </label>
                    <label>
                        <input
                            type="radio"
                            value="SV"
                            checked={loanType === 'SV'}
                            onChange={handleLoanTypeChange}
                        />
                        Segunda vivienda
                    </label>
                    <label>
                        <input
                            type="radio"
                            value="PC"
                            checked={loanType === 'PC'}
                            onChange={handleLoanTypeChange}
                        />
                        Propiedades comerciales
                    </label>
                    <label>
                        <input
                            type="radio"
                            value="R"
                            checked={loanType === 'R'}
                            onChange={handleLoanTypeChange}
                        />
                        Remodelación
                    </label>
                </fieldset>

                <button type="submit">Calcular</button>
            </form>

            {monthlyPayment && (
                <h3>Pago mensual: ${monthlyPayment}</h3>
            )}

            {loanDetails && (
                <pre>{loanDetails}</pre>
            )}
        </div>
    );
};

export default LoanCalculator;
