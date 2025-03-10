
import { Router } from 'express';
import { body } from 'express-validator';
import { 
  createMatchHandler,
  verifyOtpHandler,
  resumeMatchHandler,
  watchMatchHandler
} from '../controllers/auth.controller';
import { validate } from '../middleware/validation.middleware';

const router = Router();

// Create a new match
router.post(
  '/create-match',
  validate([
    body('scorerEmail')
      .isEmail()
      .withMessage('Please provide a valid email address')
  ]),
  createMatchHandler
);

// Verify OTP
router.post(
  '/verify-otp',
  validate([
    body('email').isEmail().withMessage('Please provide a valid email address'),
    body('otp').isString().withMessage('OTP is required'),
    body('matchId').isString().withMessage('Match ID is required')
  ]),
  verifyOtpHandler
);

// Resume a match
router.post(
  '/resume-match',
  validate([
    body('matchId').isString().withMessage('Match ID is required'),
    body('accessCode').optional().isString()
  ]),
  resumeMatchHandler
);

// Watch a live match
router.post(
  '/watch-match',
  validate([
    body('matchId').isString().withMessage('Match ID is required')
  ]),
  watchMatchHandler
);

export default router;
