import React, { useEffect, useState } from 'react';

const Home = () => {
    const [username, setUsername] = useState('');

    useEffect(() => {
        // Obtener el nombre del usuario desde localStorage
        const storedUsername = localStorage.getItem('username');
        if (storedUsername) {
            setUsername(storedUsername);
        }
    }, []);

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            textAlign: 'center',
            padding: '0 20px'
        }}>
            <div>
                {username && <h2>Hola {username}!</h2>} {/* Mostrar el saludo si existe el nombre */}
                <h1 style={{ fontSize: '24px' }}>
                    PrestaBanco: Sistema de gestión de solicitudes de préstamos bancarios con fines inmobiliarios
                </h1>
                <p>
                    Impulsamos tus sueños inmobiliarios con financiamiento a tu medida!
                </p>
            </div>
        </div>
    );
};

export default Home;
