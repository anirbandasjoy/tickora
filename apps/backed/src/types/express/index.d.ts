import 'express';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        name: string;
        role?: string;
        [key: string]: any;
      };
      session?: {
        id: string;
        [key: string]: any;
      };
      desktop?: {
        userId: string;
        deviceId: string;
        sessionId: string;
      };
    }
  }
}
