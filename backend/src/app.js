import express from 'express';
import dotenv from 'dotenv';
import { Server } from 'socket.io';
import { createServer } from 'http';
import connectDB from './config/db.js';
import { swaggerUi, swaggerSpec } from './config/swagger.js';
import authRoutes from './routes/authRouter.js'
import postRoutes from './routes/postRouter.js'
import cors from 'cors'
dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
    },
});
connectDB()

app.use(express.json());
app.use(cors());
app.use('/api/auth', authRoutes)
app.use('/api/posts', postRoutes)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
const users = {};

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('register', (userId) => {
        if (userId) {
            // Check if the user is already registered
            if (users[userId] && users[userId] !== socket.id) {
                console.log(`User ${userId} is already registered with socket ID ${users[userId]}. Replacing with new socket ID ${socket.id}.`);
            }
            
            users[userId] = socket.id;
            console.log(`User registered with ID ${userId} and socket ID ${socket.id}`);
        } else {
            console.log('Registration failed: No userId provided');
        }
    });

    socket.on('notify', ({ userId, message }) => {
        const recipientSocketId = users[userId];
        if (recipientSocketId) {
            io.to(recipientSocketId).emit('notification', message);
            console.log(`Notification sent to user ${userId} (${recipientSocketId}):`, message);
        } else {
            console.log(`User ${userId} is not connected or not registered`);
        }
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected:', socket.id);
        for (const [userId, id] of Object.entries(users)) {
            if (id === socket.id) {
                delete users[userId];
                console.log(`User ${userId} with socket ID ${socket.id} removed`);
                break;
            }
        }
    });
});

export default server