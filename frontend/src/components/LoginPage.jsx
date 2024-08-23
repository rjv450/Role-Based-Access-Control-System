import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Add axios for making HTTP requests
import {jwtDecode} from 'jwt-decode';
const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    let ApiUri =import.meta.env.VITE_API_URI
    const handleLogin = async (event) => {
        event.preventDefault();

        try {
            console.log(ApiUri);
            
            const response = await axios.post(`${ApiUri}/api/auth/login`, { email, password });
            if (response.status === 200) {
                const { token } = response.data;
                localStorage.setItem('authToken', token);
                const decodedToken = jwtDecode(token);
                localStorage.setItem('userId', decodedToken.id);
        
                console.log('Decoded Token:', decodedToken);
                navigate('/home');
            } else {
                setError('Invalid email or password');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
            console.error('Login error:', err);
        }
    };

    return (
        <Container maxWidth="xs">
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    mt: 8,
                    p: 3,
                    border: '1px solid',
                    borderColor: 'grey.400',
                    borderRadius: 1,
                    boxShadow: 2,
                }}
            >
                <Typography variant="h4" gutterBottom>
                    Login
                </Typography>
                {error && <Alert severity="error">{error}</Alert>}
                <form onSubmit={handleLogin} style={{ width: '100%', marginTop: '1rem' }}>
                    <TextField
                        label="Email"
                        type="email"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <TextField
                        label="Password"
                        type="password"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ mt: 2 }}
                    >
                        Login
                    </Button>
                </form>
            </Box>
        </Container>
    );
};

export default LoginPage;
