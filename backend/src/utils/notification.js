import { io } from 'socket.io-client';

const socket = io('http://localhost:3000');

export const notify = (userId, message) => {
  socket.emit('notify', { userId, message });
};
