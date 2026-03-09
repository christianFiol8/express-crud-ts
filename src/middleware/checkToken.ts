import { Request, Response, NextFunction } from 'express';

const VALID_TOKEN = 'HIZe4D32twWOUP9h0I1IVTlr';

function checkToken(req: Request, res: Response, next: NextFunction): void {
  if (req.method === 'GET') {
    next();
    return;
  }

  const token = req.headers['token'];

  if (!token || token !== VALID_TOKEN) {
    res.status(403).json({
      success: false,
      message: 'Forbidden: Header "token" inválido o faltante.',
    });
    return;
  }

  next();
}

export default checkToken;