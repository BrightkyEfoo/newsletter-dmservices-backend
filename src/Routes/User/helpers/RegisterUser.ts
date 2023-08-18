import { Response } from 'express';
import { myRequest } from '../../../types/jwt';
import { User } from '../../../database/Sequelize';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { private_key } from '../../../auth/private_key';

export const registerUser = (
  req: myRequest<{},{
    name?: string;
    email?: string;
    password?: string;
    whatsapp?: string;
    phone?: string;
    website?: string;
    facebook?: string;
  }>,
  res: Response
) => {
  const { name, email, password, whatsapp, phone, website, facebook } =
    req.body;
  if (
    name === undefined ||
    email === undefined ||
    password === undefined ||
    whatsapp === undefined ||
    phone === undefined
  ) {
    return res
      .status(400)
      .json({
        msg: 'les champs nom, email, mot de passe, whatsapp, numero de telephone sont tous requis',
      });
  }
  User.create({ name, email, password, whatsapp, phone, website, facebook })
    .then(user => {
      const tempUser = { ...user.toJSON(), password: '' };
      return res.json({ msg: 'compte cree avec succes', user: tempUser });
    })
    .catch(err => {
      console.log('err', err);
      return res
        .status(500)
        .json({
          msg:
            'Quelque chose a mal tourne veuillez reessayer dans quelques instants : ' +
            err.name,
        });
    });
};
