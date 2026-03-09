import { Request, Response, NextFunction } from 'express';

const VALID_AUTH = 'fha5HpDXSXSjKU0QCbdXiz1a';

function checkAuth(req: Request, res: Response, next: NextFunction): void {
  const rawAuth = req.headers['auth'];
  const auth = Array.isArray(rawAuth) ? rawAuth[0] : rawAuth;

  if (!auth || auth !== VALID_AUTH) {
    res.status(401).json({
      success: false,
      message: 'Unauthorized: Authorization header inválido o faltante.',
    });
    return;
  }

  next();
}

export default checkAuth;