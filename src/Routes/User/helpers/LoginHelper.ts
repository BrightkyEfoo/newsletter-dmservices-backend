import { Response } from 'express';
import { myRequest } from '../../../types/jwt';
import { User } from '../../../database/Sequelize';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { private_key } from '../../../auth/private_key';

export const loginUser = (
  req: myRequest<{}, { email?: string; password?: string }>,
  res: Response
) => {
  const { email, password } = req.body;
  if (email === undefined || password === undefined) {
    return res
      .status(400)
      .json({ msg: 'les champs email et mot de passe sont requis.' });
  }
  User.findOne({ where: { email } })
    .then(user => {
      if (user) {
        bcrypt.compare(password, user.password, (err, result) => {
          if (err) {
            return res.status(400).json({ msg: 'quelque chose a mal tourne' });
          }
          if (result) {
            const token = jwt.sign(
              {
                userId: user.id,
                name: user.name,
              },
              private_key,
              {
                expiresIn: '24h',
              }
            );
            const userTemp = { ...user.toJSON(), password: '' };
            user.save().then(() => {
              res.json({
                msg: 'connexion reussie',
                user: userTemp,
                token,
              });
            });
          } else {
            return res.status(401).json({ msg: 'mot de passe errone' });
          }
        });
      } else {
        return res.status(404).json({
          msg: `Il semble qu'il n y ait aucun utilisateur associe a cet email`,
        });
      }
    })
    .catch(err => {
      res.status(400).json({
        msg: `quelque chose a mal tourne. veuillez reessayer dans quelques instants`,
        err,
      });
    });
};
