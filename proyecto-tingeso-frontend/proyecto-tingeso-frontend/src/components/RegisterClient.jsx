import React, { useState } from 'react';
import './RegisterClient.css';
import { MenuItem, TextField, Button, Box } from '@mui/material';
import axios from 'axios';

function RegisterClient() {
    const [formData, setFormData] = useState({
        name: '',
        rut: '',
        email: '',
        password: '',
        age: '',
        sexo: '',
        phoneNumber: ''
    });

    const [isRegistered, setIsRegistered] = useState(false);  // Estado para el registro exitoso
    const [errorMessage, setErrorMessage] = useState('');  // Estado para mensaje de error

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8100/api/v1/user/', formData);
            console.log('Usuario registrado:', response.data);
            setIsRegistered(true);  // Registro exitoso
            setErrorMessage('');    // Limpiar cualquier mensaje de error
        } catch (error) {
            console.error('Error al registrar usuario:', error);
            setErrorMessage('Hubo un problema con el registro');  // Mostrar mensaje de error
            setIsRegistered(false);  // Registro no exitoso
        }
    };

    return (
        <div className="register-client-container">
            <h2>Registro de Cliente</h2>
            <form className="register-client-form" onSubmit={handleSubmit}>
                <Box className="left-side">
                    <TextField
                        label="Nombre"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        variant="outlined"
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Rut"
                        name="rut"
                        value={formData.rut}
                        onChange={handleChange}
                        variant="outlined"
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        variant="outlined"
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Contraseña"
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        variant="outlined"
                        fullWidth
                        margin="normal"
                    />
                </Box>
                <Box className="right-side">
                    <TextField
                        label="Edad"
                        type="number"
                        name="age"
                        value={formData.age}
                        onChange={handleChange}
                        variant="outlined"
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Sexo"
                        select
                        name="sexo"
                        value={formData.sexo}
                        onChange={handleChange}
                        variant="outlined"
                        fullWidth
                        margin="normal"
                    >
                        <MenuItem value="M">Masculino</MenuItem>
                        <MenuItem value="F">Femenino</MenuItem>
                    </TextField>
                    <TextField
                        label="Número de Teléfono"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        variant="outlined"
                        fullWidth
                        margin="normal"
                    />
                </Box>
                <Box className="register-button-container">
                    <Button
                        variant="contained"
                        color="primary"
                        type="submit"
                        fullWidth
                    >
                        Registrar
                    </Button>
                </Box>
            </form>

            {/* Mostrar mensaje de éxito o error */}
            {isRegistered && <p style={{ color: 'green', textAlign: 'center' }}>Registro exitoso</p>}
            {errorMessage && <p style={{ color: 'red', textAlign: 'center' }}>{errorMessage}</p>}
        </div>
    );
}

export default RegisterClient;
