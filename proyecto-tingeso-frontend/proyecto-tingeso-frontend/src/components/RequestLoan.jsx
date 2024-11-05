import React, { useState, useEffect } from 'react';
import './RequestLoan.css';
import axios from 'axios';

const RequestLoan = () => {
    const [amount, setAmount] = useState('');
    const [interestRate, setInterestRate] = useState('');
    const [months, setMonths] = useState('');
    const [loanType, setLoanType] = useState('');
    const [loanDetails] = useState(''); // Variable no usada, mantener según la solicitud
    const [monthlyPayment, setMonthlyPayment] = useState('');
    const [monthlyIncome, setMonthlyIncome] = useState('');
    const [debtUser, setDebtUser] = useState('');
    const [workYears, setWorkYears] = useState('');
    const [propertyValue, setPropertyValue] = useState('');
    const [savingsBalance, setSavingsBalance] = useState('');
    const [significantWithdrawal, setSignificantWithdrawal] = useState(false);
    const [withdrawalAmount, setWithdrawalAmount] = useState('');
    const [accountAge, setAccountAge] = useState('');
    const [recentWithdrawal, setRecentWithdrawal] = useState(false);
    const [recentWithdrawalAmount, setRecentWithdrawalAmount] = useState('');
    const [error, setError] = useState('');
    const [rut, setRut] = useState('');
    const [inDicom, setInDicom] = useState(null);
    const [recentDepositAmount, setRecentDepositAmount] = useState(''); // Renombrar y usar correctamente

    useEffect(() => {
        const storedRut = localStorage.getItem('rut');
        if (storedRut) {
            setRut(storedRut);
        } else {
            setError('No se encontró el rut del usuario en el almacenamiento local.');
        }
    }, []);

    const calculateLoan = () => {
        const principal = parseFloat(amount);
        const monthlyInterestRate = parseFloat(interestRate) / 100 / 12;
        const numPayments = parseInt(months, 10);
        const x = Math.pow(1 + monthlyInterestRate, numPayments);
        const monthlyPaymentAmount = (principal * monthlyInterestRate * x) / (x - 1);

        if (isFinite(monthlyPaymentAmount)) {
            setMonthlyPayment(monthlyPaymentAmount.toFixed(2));
            setError('');
            return monthlyPaymentAmount.toFixed(2);
        } else {
            setMonthlyPayment('');
            setError('No se pudo calcular el pago mensual. Revisa los valores ingresados.');
            return null;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const calculatedMonthlyPayment = calculateLoan();
        if (calculatedMonthlyPayment === null) return;

        // Validación de campos individuales
        if (!rut) return setError('El rut es requerido.');
        if (!amount) return setError('El monto del préstamo es requerido.');
        if (!interestRate) return setError('La tasa de interés es requerida.');
        if (!months) return setError('La duración en meses es requerida.');
        if (!loanType) return setError('El tipo de préstamo es requerido.');
        if (!monthlyIncome) return setError('Los ingresos mensuales son requeridos.');
        if (!debtUser) return setError('El monto de la deuda es requerido.');
        if (!workYears) return setError('La antigüedad laboral es requerida.');
        if (!propertyValue) return setError('El valor de la propiedad es requerido.');
        if (!savingsBalance) return setError('El saldo de ahorro es requerido.');
        if (!recentDepositAmount) return setError('La suma de depósitos en 12 meses es requerida.');
        if (!accountAge) return setError('La antigüedad de la cuenta es requerida.');
        if (inDicom === null) return setError('Selecciona si estás en DICOM.');

        // Validación de campos opcionales para retiros
        if (significantWithdrawal && !withdrawalAmount) {
            return setError('El monto del retiro significativo es requerido.');
        }
        if (recentWithdrawal && !recentWithdrawalAmount) {
            return setError('El monto del retiro reciente es requerido.');
        }

        try {
            const response = await axios.post('http://localhost:8100/api/v1/loans/', {
                rut: rut,
                amount: parseFloat(amount),
                type: loanType,
                state: 'ERI',
                date: new Date(),
                monthlyPayment: parseFloat(calculatedMonthlyPayment),
                monthlyIncome: parseFloat(monthlyIncome),
                interest: parseFloat(interestRate),
                termMonths: parseInt(months),
                inDicom: inDicom,
                debtUser: parseFloat(debtUser),
                workYears: parseInt(workYears),
                propertyValue: parseFloat(propertyValue),
                amountSavingsAcc: parseFloat(savingsBalance),
                recentDepositAmount: parseInt(recentDepositAmount) || 0,
                savingsAccAge: parseInt(accountAge),
                significantWithdrawal: significantWithdrawal,
                withdrawalAmount: parseFloat(withdrawalAmount) || 0,
                recentWithdrawal: recentWithdrawal,
                recentWithdrawalAmount: parseFloat(recentWithdrawalAmount) || 0,
            });

            if (response.status === 200) {
                alert('Solicitud de crédito enviada correctamente');
                setError('');
            }
        } catch (error) {
            if (error.response && error.response.status === 400) {
                setError(error.response.data);
            } else {
                setError('Hubo un error al enviar la solicitud. Inténtalo nuevamente.');
            }
        }
    };


    return (
        <div className="request-loan-container">
            <h2>Solicita tu crédito hipotecario!</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <input type="number" placeholder="Monto del préstamo" value={amount}
                       onChange={(e) => setAmount(e.target.value)} required />
                <input type="number" placeholder="Tasa de interés (%)" value={interestRate}
                       onChange={(e) => setInterestRate(e.target.value)} required />
                <input type="number" placeholder="Meses" value={months} onChange={(e) => setMonths(e.target.value)}
                       required />
                <input type="number" placeholder="Ingresos mensuales" value={monthlyIncome}
                       onChange={(e) => setMonthlyIncome(e.target.value)} required />
                <input type="number" placeholder="Ingrese el monto de su deuda" value={debtUser}
                       onChange={(e) => setDebtUser(e.target.value)} required />
                <input type="number" placeholder="Antigüedad laboral en meses" value={workYears}
                       onChange={(e) => setWorkYears(e.target.value)} required />
                <input type="number" placeholder="Indique el valor total de la propiedad" value={propertyValue}
                       onChange={(e) => setPropertyValue(e.target.value)} required />

                <fieldset>
                    <legend>Selecciona el tipo de préstamo:</legend>
                    <label><input type="radio" value="FV" checked={loanType === 'FV'}
                                  onChange={(e) => setLoanType(e.target.value)} required /> Primera vivienda</label>
                    <label><input type="radio" value="SV" checked={loanType === 'SV'}
                                  onChange={(e) => setLoanType(e.target.value)} required /> Segunda vivienda</label>
                    <label><input type="radio" value="PC" checked={loanType === 'PC'}
                                  onChange={(e) => setLoanType(e.target.value)} required /> Propiedades comerciales</label>
                    <label><input type="radio" value="R" checked={loanType === 'R'}
                                  onChange={(e) => setLoanType(e.target.value)} required /> Remodelación</label>
                </fieldset>

                <fieldset className="dicom-fieldset">
                    <legend>Te encuentras actualmente moroso en DICOM?</legend>
                    <div className="dicom-options">
                        <label>
                            <input
                                type="radio"
                                name="dicomStatus"
                                value="true"
                                checked={inDicom === true}
                                onChange={() => setInDicom(true)}
                                required
                            />
                            <span>Sí</span>
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="dicomStatus"
                                value="false"
                                checked={inDicom === false}
                                onChange={() => setInDicom(false)}
                                required
                            />
                            <span>No</span>
                        </label>
                    </div>
                </fieldset>

                <fieldset className="savings-fieldset">
                    <legend>Capacidad de Ahorro</legend>
                    <label>
                        ¿Cuál es el saldo depositado en tu cuenta de Ahorro/Inversiones?
                        <input type="number" placeholder="Saldo en cuenta" value={savingsBalance}
                               onChange={(e) => setSavingsBalance(e.target.value)} required />
                    </label>
                    <label>
                        ¿Has realizado algún retiro significativo de esta cuenta (Últimos 12 meses)?
                        <div className="withdrawal-options">
                            <label>
                                <input type="radio" name="withdrawalStatus" value="true"
                                       checked={significantWithdrawal === true}
                                       onChange={() => setSignificantWithdrawal(true)} required />
                                Sí
                            </label>
                            <label>
                                <input type="radio" name="withdrawalStatus" value="false"
                                       checked={significantWithdrawal === false}
                                       onChange={() => setSignificantWithdrawal(false)} required />
                                No
                            </label>
                            <input type="number" placeholder="Monto del retiro" value={withdrawalAmount}
                                   onChange={(e) => setWithdrawalAmount(e.target.value)}
                                   disabled={!significantWithdrawal} />
                        </div>
                    </label>
                    <label>
                        ¿Cuál es la suma de los depósitos que has hecho en los últimos 12 meses?
                        <input
                            type="number"
                            placeholder="Suma de depósitos en 12 meses"
                            value={recentDepositAmount}
                            onChange={(e) => setRecentDepositAmount(e.target.value)}
                            required
                        />
                    </label>
                    <label>
                        ¿Cuál es la antigüedad de esta cuenta (En meses)?
                        <input
                            type="number"
                            placeholder="Antigüedad en meses"
                            value={accountAge}
                            onChange={(e) => setAccountAge(e.target.value)}
                            required
                        />
                    </label>
                    <label>
                        ¿Haz realizado algún retiro dentro de los últimos 6 meses?
                        <div className="withdrawal-options">
                            <label>
                                <input
                                    type="radio"
                                    name="recentWithdrawalStatus"
                                    value="true"
                                    checked={recentWithdrawal === true}
                                    onChange={() => setRecentWithdrawal(true)}
                                    required
                                />
                                Sí
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    name="recentWithdrawalStatus"
                                    value="false"
                                    checked={recentWithdrawal === false}
                                    onChange={() => setRecentWithdrawal(false)}
                                    required
                                />
                                No
                            </label>
                            <input
                                type="number"
                                placeholder="Monto del retiro"
                                value={recentWithdrawalAmount}
                                onChange={(e) => setRecentWithdrawalAmount(e.target.value)}
                                disabled={!recentWithdrawal}
                            />
                        </div>
                    </label>
                </fieldset>

                <button type="submit">Solicitar Crédito</button>
            </form>

            {monthlyPayment && <h3>Pago mensual estimado: ${monthlyPayment}</h3>}
            {loanDetails && <pre>{loanDetails}</pre>}
        </div>
    );
};

export default RequestLoan;
