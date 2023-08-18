import { NextFunction, Request, Response } from 'express';
import { private_key } from './private_key';
import jwt from 'jsonwebtoken';
import { myDecodedToken, myRequest } from '../types/jwt';

const auth = (
  req: myRequest<{ userId?: string }, { userId: string | number }>,
  res: Response,
  next: NextFunction
) => {
  // console.log(req.route)
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader) {
    const msg = `Vous n'avez pas fourni de jeton d'authentification. Ajoutez-en un dans l'en-tête de la requête.`;
    return res.status(401).json({ msg });
  }

  const token = authorizationHeader.split(' ')[1];
  jwt.verify(token, private_key, (error, decodedToken) => {
    // console.log('token', token)
    if (error) {
      const msg = `L'utilisateur n'est pas autorisé à accèder à cette ressource.`;
      return res.status(401).json({ msg, data: error });
    }
    if (decodedToken === undefined) {
      const msg = `Quelque a mal tourne`;
      return res.status(500).json({ msg });
    }
    const temp = decodedToken as myDecodedToken;
    const userId = temp.userId;
    if (
      (req.body.userId && req.body.userId !== userId) ||
      (req.query.userId && parseInt(req.query.userId as string) !== userId)
    ) {
      const msg = `L'identifiant de l'utilisateur est invalide.`;
      res.status(401).json({ msg });
    } else {
      req.user = { ...temp };
      next();
    }
  });
};
export default auth;
