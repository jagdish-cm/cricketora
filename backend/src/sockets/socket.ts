
import { Server } from 'socket.io';
import http from 'http';
import { getMatch } from '../services/match.service';

export const initializeSocketIO = (server: http.Server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:3000',
      methods: ['GET', 'POST']
    }
  });

  // Middleware to handle authentication
  io.use(async (socket, next) => {
    const matchId = socket.handshake.auth.matchId;
    
    if (!matchId) {
      return next(new Error('Match ID is required'));
    }
    
    // Optional: validate match exists
    try {
      const match = await getMatch(matchId);
      if (!match) {
        return next(new Error('Match not found'));
      }
    } catch (error) {
      return next(new Error('Error validating match'));
    }
    
    // Store matchId in socket data
    socket.data.matchId = matchId;
    next();
  });

  io.on('connection', (socket) => {
    console.log('New client connected');
    
    const matchId = socket.data.matchId;
    
    // Join the match room
    socket.join(`match:${matchId}`);
    
    // Handle client joining match
    socket.on('join-match', (data) => {
      console.log(`Client joined match ${data.matchId}`);
      // Additional logic if needed
    });
    
    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('Client disconnected');
      socket.leave(`match:${matchId}`);
    });
  });

  return io;
};
