import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';

interface RequestWithUser extends Request {
  isAuthenticated: () => boolean;
  user: { 
    _id: string;
    login: string;
    password: string;
    roles: string[];
    username: string; 
    role: string; 
  };
}

export function mockAuthMiddleware(req: Request, res: Response, next: NextFunction) {
    (req as any).isAuthenticated = () => true;
  
    (req as any).user = {
        _id: 'testId',
        login: 'testLogin',
        password: 'testPassword',
        roles: [
          { name: 'testRole' },
          { name: 'veterinarian' }, 
        ],
        username: 'testuser',
        role: 'admin',
      };
      
  
    (req as any).session = new mongoose.Types.ObjectId('aaaaaaaaaaaaaaaaaaaaaaaa');
  
    // console.log('mockAuthMiddleware has been used');
    // console.log('User:', req.user);

    next();
}
