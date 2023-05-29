import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';

// Extension de l'interface Request
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
    // Simuler une authentification réussie
    (req as any).isAuthenticated = () => true;
  
    // Simuler l'utilisateur authentifié
    (req as any).user = {
        _id: 'testId',
        login: 'testLogin',
        password: 'testPassword',
        roles: [
          { name: 'testRole' },
          { name: 'veterinarian' }, // Ajoutez ce rôle ici
        ],
        username: 'testuser',
        role: 'admin',
      };
      
  
    (req as any).session = new mongoose.Types.ObjectId('aaaaaaaaaaaaaaaaaaaaaaaa');
  
    console.log('mockAuthMiddleware has been used');
    console.log('User:', req.user);

    next();
}
