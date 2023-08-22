import { Request, Response } from 'express';
import { myRequest } from '../../../types/jwt';
import { User } from '../../../database/Sequelize';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { private_key } from '../../../auth/private_key';
import { rateLimit } from 'express-rate-limit';
import Redis from 'ioredis';

const redis = new Redis();

const maxNumberOfFailedLogins = 3;
const timeWindowForFailedLogins = 60 * 60 * 1;

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = email;
  // check user is not attempted too many login requests
  let t = await redis.get(user);
  let a = 0;
  if (t == null) {
    a = 0;
  } else {
    a = parseInt(t);
  }
  let userAttempts = a;
  if (userAttempts > maxNumberOfFailedLogins) {
    return res.status(429).send('Too Many Attempts try it one hour later');
  }

  // Let's check user
  const loginResult = await authorise(user, password);

  // user attempt failed
  if (!loginResult.isLoggedIn) {
    await redis.set(user, ++userAttempts, 'EX', timeWindowForFailedLogins);
    res.status(400).send('failed');
  } else {
    // successful login
    await redis.del(user);
    if (loginResult.user) {
      loginResult.user.password = '';
      res.json({
        msg: 'success',
        user: loginResult.user,
        token: 'Bearer ' + loginResult.token,
      });
    } else {
      res.status(500).json({ msg: 'error' });
    }
  }
};
const authorise = async (email: string, password: string) => {
  const u: {
    isLoggedIn: boolean;
    exists: boolean;
    token: string;
    user:
      | undefined
      | {
          password: string;
          id: number;
          name: string;
          email: string;
          whatsapp: string;
          phone: string;
          website?: string | undefined;
          facebook?: string | undefined;
        };
  } = {
    token: '',
    isLoggedIn: false,
    exists: false,
    user: undefined,
  };
  await User.findOne({ where: { email } }).then(user => {
    if (user) {
      u.exists = true;
      bcrypt.compare(password, user.password, (err, result) => {
        if (err) {
          console.log('err', err);
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
          u.token = token;
          u.user = userTemp;
          u.isLoggedIn = true;
        }
      });
    }
  });
  return u;
};
