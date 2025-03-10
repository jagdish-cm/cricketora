
import axios from 'axios';
import io, { Socket } from 'socket.io-client';
import { Match, BallEvent } from '@/context/MatchContext';

// API configuration
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Socket.io instance
let socket: Socket | null = null;

// Authentication Services
export const authService = {
  // Create a new match with scorer email
  createMatch: async (scorerEmail: string): Promise<string> => {
    try {
      const response = await api.post('/auth/create-match', { scorerEmail });
      return response.data.data.matchId;
    } catch (error) {
      console.error('Error creating match:', error);
      throw new Error('Failed to create match');
    }
  },
  
  // Verify OTP for match access
  verifyOtp: async (email: string, otp: string, matchId: string): Promise<boolean> => {
    try {
      const response = await api.post('/auth/verify-otp', { email, otp, matchId });
      return response.data.success;
    } catch (error) {
      console.error('Error verifying OTP:', error);
      throw new Error('Failed to verify OTP');
    }
  },
  
  // Resume a match with ID and password
  resumeMatch: async (matchId: string, accessCode?: string): Promise<boolean> => {
    try {
      const response = await api.post('/auth/resume-match', { matchId, accessCode });
      return response.data.success;
    } catch (error) {
      console.error('Error resuming match:', error);
      throw new Error('Failed to resume match');
    }
  },
  
  // Watch a live match (public access)
  watchMatch: async (matchId: string): Promise<boolean> => {
    try {
      const response = await api.post('/auth/watch-match', { matchId });
      return response.data.success;
    } catch (error) {
      console.error('Error accessing match:', error);
      throw new Error('Failed to access match');
    }
  }
};

// Match Services
export const matchService = {
  // Get match details
  getMatch: async (matchId: string): Promise<Match> => {
    try {
      const response = await api.get(`/matches/${matchId}`);
      return response.data.data;
    } catch (error) {
      console.error('Error getting match:', error);
      throw new Error('Failed to get match');
    }
  },
  
  // Update match details
  updateMatch: async (matchId: string, matchData: Partial<Match>): Promise<Match> => {
    try {
      const response = await api.patch(`/matches/${matchId}`, matchData);
      return response.data.data;
    } catch (error) {
      console.error('Error updating match:', error);
      throw new Error('Failed to update match');
    }
  },
  
  // Get live match data
  getLiveMatch: async (matchId: string): Promise<Match> => {
    try {
      const response = await api.get(`/matches/${matchId}/live`);
      return response.data.data;
    } catch (error) {
      console.error('Error getting live match:', error);
      throw new Error('Failed to get live match');
    }
  },
  
  // Record a ball event
  recordBallEvent: async (matchId: string, ballEventData: Omit<BallEvent, 'id' | 'timestamp'>): Promise<BallEvent> => {
    try {
      const response = await api.post(`/matches/${matchId}/events`, ballEventData);
      return response.data.data;
    } catch (error) {
      console.error('Error recording ball event:', error);
      throw new Error('Failed to record ball event');
    }
  }
};

// Socket.io Services
export const socketService = {
  // Connect to socket server
  connect: (matchId: string): Socket => {
    if (socket) {
      socket.disconnect();
    }
    
    const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
    
    socket = io(SOCKET_URL, {
      auth: {
        matchId
      }
    });
    
    socket.on('connect', () => {
      console.log('Connected to socket server');
      socket?.emit('join-match', { matchId });
    });
    
    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });
    
    return socket;
  },
  
  // Disconnect from socket server
  disconnect: (): void => {
    if (socket) {
      socket.disconnect();
      socket = null;
    }
  },
  
  // Get socket instance
  getSocket: (): Socket | null => {
    return socket;
  }
};

export default {
  authService,
  matchService,
  socketService
};
