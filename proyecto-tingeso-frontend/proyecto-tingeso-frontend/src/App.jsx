import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import DoubleNavbar from './components/DoubleNavbar';
import LoanCalculator from './components/LoanCalculator';
import RegisterClient from './components/RegisterClient';
import LoginClient from './components/LoginClient';
import RequestLoan from './components/RequestLoan';
import CheckLoans from './components/CheckLoans';
import CheckUsers from './components/CheckUsers';
import DecideLoans from './components/DecideLoans';
import DecideUsers from './components/DecideUsers';
import CheckAccState from './components/CheckAccState';
import CheckRequestsState from './components/CheckRequestsState';

function App() {
    return (
        <Router>
            <DoubleNavbar />

            <div className="container">
                <Routes>
                    <Route path="/home" element={<Home />} />
                    <Route path="/" element={<Home />} />
                    <Route path="/loan-calculator" element={<LoanCalculator />} />
                    <Route path="/register-client" element={<RegisterClient />} />
                    <Route path="/iniciar-sesion" element={<LoginClient />} />
                    <Route path="/solicitar-credito" element={<RequestLoan />} />
                    <Route path="/revisar-solicitudes" element={<CheckLoans />} />
                    <Route path="/revisar-registros" element={<CheckUsers />} />
                    <Route path="/decide-loans/:id" element={<DecideLoans />} />
                    <Route path="/decide-users/:id" element={<DecideUsers />} />
                    <Route path="/revisar-cuenta" element={<CheckAccState />} />
                    <Route path="/revisar-solicitud" element={<CheckRequestsState />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
