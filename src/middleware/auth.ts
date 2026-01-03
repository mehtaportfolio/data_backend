import { Request, Response, NextFunction } from 'express';

interface AuthRequest extends Request {
  user?: { id: string };
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const userId = req.headers['x-user-id'] as string;

  if (!userId) {
    return res.status(401).json({ success: false, error: 'Unauthorized - Missing user ID' });
  }

  req.user = { id: userId };
  next();
};
