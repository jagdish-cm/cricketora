
import { Request, Response, NextFunction } from 'express';
import { createMatch, storeOtp, verifyOtp, validateMatchAccess } from '../services/match.service';
import { generateOTP } from '../utils/helpers';
// In a real app, you would use a real email service
// import { sendEmail } from '../services/email.service';

/**
 * Create a new match with the scorer's email
 * @route POST /api/auth/create-match
 */
export const createMatchHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { scorerEmail } = req.body;
    
    // Create a new match
    const { matchId, accessCode } = await createMatch(scorerEmail);
    
    // Generate an OTP for verification
    const otp = generateOTP();
    
    // Store the OTP
    await storeOtp(scorerEmail, matchId, otp);
    
    // In a real application, you would send an email with the OTP
    // await sendEmail(scorerEmail, 'Your CricketOra Verification Code', 
    //   `Your verification code is: ${otp}\nMatch ID: ${matchId}\nAccess Code: ${accessCode}`);
    
    // For development purposes, log the OTP
    console.log(`OTP for ${scorerEmail}: ${otp}, Match ID: ${matchId}, Access Code: ${accessCode}`);
    
    // Return the match ID
    res.status(201).json({
      success: true,
      data: { 
        matchId,
        message: 'Verification email sent. Please check your inbox.'
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Verify OTP for match access
 * @route POST /api/auth/verify-otp
 */
export const verifyOtpHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, otp, matchId } = req.body;
    
    // Verify the OTP
    const isValid = await verifyOtp(email, matchId, otp);
    
    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification code'
      });
    }
    
    // OTP is valid, return success
    res.status(200).json({
      success: true,
      data: { 
        matchId,
        message: 'Email verified successfully'
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Resume a match with ID and access code
 * @route POST /api/auth/resume-match
 */
export const resumeMatchHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { matchId, accessCode } = req.body;
    
    // Validate match access
    const isValid = await validateMatchAccess(matchId, accessCode);
    
    if (!isValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid match ID or access code'
      });
    }
    
    // Access is valid, return success
    res.status(200).json({
      success: true,
      data: { 
        matchId,
        message: 'Match access granted'
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Watch a live match (public access)
 * @route POST /api/auth/watch-match
 */
export const watchMatchHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { matchId } = req.body;
    
    // Validate match exists
    const isValid = await validateMatchAccess(matchId);
    
    if (!isValid) {
      return res.status(404).json({
        success: false,
        message: 'Match not found'
      });
    }
    
    // Match exists, return success
    res.status(200).json({
      success: true,
      data: { 
        matchId,
        message: 'Match found'
      }
    });
  } catch (error) {
    next(error);
  }
};
