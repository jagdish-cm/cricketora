
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  password: string;
  from: string;
  testUser?: string;
  testPassword?: string;
}

interface AppConfig {
  port: number;
  nodeEnv: string;
  clientUrl: string;
  firebase: {
    projectId: string;
    privateKey: string;
    clientEmail: string;
  };
  email: EmailConfig;
}

export const config: AppConfig = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  firebase: {
    projectId: process.env.FIREBASE_PROJECT_ID || '',
    privateKey: process.env.FIREBASE_PRIVATE_KEY 
      ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') 
      : '',
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL || '',
  },
  email: {
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '587', 10),
    secure: process.env.EMAIL_SECURE === 'true',
    user: process.env.EMAIL_USER || '',
    password: process.env.EMAIL_PASSWORD || '',
    from: process.env.EMAIL_FROM || 'noreply@cricketora.com',
    testUser: process.env.EMAIL_TEST_USER,
    testPassword: process.env.EMAIL_TEST_PASSWORD,
  }
};
