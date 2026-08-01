import { Request, Response, NextFunction } from 'express';

export default function CorsStar(req: Request, res: Response, next: NextFunction) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Non-"simple" requests (PUT/DELETE, or any request with a Content-Type header) trigger a
  // CORS preflight OPTIONS request first. There's no route handler for OPTIONS, so it must be
  // answered here or the browser blocks the real request.
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  next();
}
