import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { Container, List, ListItem, Alert, Typography } from '@mui/material';
let ApiUri =import.meta.env.VITE_API_URI
const socket = io(ApiUri);

const Notification = () => {
    const [notifications, setNotifications] = useState([]);
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        if (userId) {
            // Register the user to receive notifications
            socket.emit('register', userId);
            
            // Listen for notification events
            socket.on('notification', (message) => {
                setNotifications((prevNotifications) => [
                    ...prevNotifications,
                    message,
                ]);
            });
        }

        // Cleanup on unmount
        return () => {
            socket.off('notification');
        };
    }, [userId]);

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Notifications
            </Typography>
            <List>
                {notifications.map((notification, index) => (
                    <ListItem key={index}>
                        <Alert severity="info">
                            {notification.author}: {notification.content} at {new Date(notification.timestamp).toLocaleString()}
                        </Alert>
                    </ListItem>
                ))}
            </List>
        </Container>
    );
};

export default Notification;
