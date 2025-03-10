
import { Router } from 'express';
import { body, param } from 'express-validator';
import { 
  getMatchHandler,
  updateMatchHandler,
  getLiveMatchHandler,
  recordBallEventHandler
} from '../controllers/match.controller';
import { validate } from '../middleware/validation.middleware';

const router = Router();

// Get match details
router.get(
  '/:id',
  validate([
    param('id').isString().withMessage('Match ID is required')
  ]),
  getMatchHandler
);

// Update match details
router.patch(
  '/:id',
  validate([
    param('id').isString().withMessage('Match ID is required')
  ]),
  updateMatchHandler
);

// Get live match data
router.get(
  '/:id/live',
  validate([
    param('id').isString().withMessage('Match ID is required')
  ]),
  getLiveMatchHandler
);

// Record a ball event
router.post(
  '/:id/events',
  validate([
    param('id').isString().withMessage('Match ID is required'),
    body('ballNumber').isNumeric().withMessage('Ball number is required'),
    body('overNumber').isNumeric().withMessage('Over number is required'),
    body('batsmanId').isString().withMessage('Batsman ID is required'),
    body('bowlerId').isString().withMessage('Bowler ID is required'),
    body('runs').isNumeric().withMessage('Runs is required')
  ]),
  recordBallEventHandler
);

export default router;
