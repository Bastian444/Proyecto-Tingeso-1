import React, { useState } from 'react';
import './LoginClient.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function LoginClient() {
    const [rut, setRut] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8100/api/v1/user/login', {
                rut,
                password,
            });

            if (response.status === 200) {
                const { name } = response.data;

                // Guardar rut y username en localStorage
                localStorage.setItem('rut', rut);
                localStorage.setItem('username', name);

                // Redirigir a la página de inicio
                navigate('/home');
            }
        } catch (error) {
            console.error('Error al iniciar sesión', error);
            setError('Rut o contraseña incorrectos');
        }
    };

    return (
        <div className="login-client-container">
            <h2>Iniciar Sesión</h2>
            <form onSubmit={handleLogin}>
                <input
                    type="text"
                    placeholder="Rut"
                    value={rut}
                    onChange={(e) => setRut(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button type="submit">Iniciar Sesión</button>
            </form>
        </div>
    );
}

export default LoginClient;
