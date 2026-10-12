import { Request, Response } from 'express';
import { asyncHandler } from '../helpers/asyncHandler';
import { apiResponse } from '../helpers/apiResponse';
import { AuthService } from '../services/auth.service';

export const authController = {
  login: asyncHandler(async (req: Request, res: Response) => {
    const result = await AuthService.login(req.body);

    // Set refresh token as httpOnly cookie
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    apiResponse({
      res,
      message: 'Login successful',
      data: {
        accessToken: result.accessToken,
        user: result.user,
      },
    });
  }),

  refresh: asyncHandler(async (req: Request, res: Response) => {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      apiResponse({
        res,
        statusCode: 401,
        success: false,
        message: 'Refresh token not found',
      });
      return;
    }

    const result = await AuthService.refreshToken(refreshToken);

    apiResponse({
      res,
      message: 'Token refreshed',
      data: result,
    });
  }),

  logout: asyncHandler(async (_req: Request, res: Response) => {
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    apiResponse({
      res,
      message: 'Logged out successfully',
    });
  }),

  me: asyncHandler(async (req: Request, res: Response) => {
    const user = await AuthService.getMe(req.user!.userId);

    apiResponse({
      res,
      message: 'User profile fetched',
      data: user,
    });
  }),

  updateProfile: asyncHandler(async (req: Request, res: Response) => {
    const user = await AuthService.updateProfile(req.user!.userId, req.body);

    apiResponse({
      res,
      message: 'Profile updated',
      data: user,
    });
  }),
};
