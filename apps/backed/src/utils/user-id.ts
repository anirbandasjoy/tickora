import { Request } from 'express';

export const userIdOf = (req: Request): string => req.desktop?.userId ?? req.user!.id;
