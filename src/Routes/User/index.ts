import { Router } from 'express';
import auth from '../../auth/auth';
import { loginUser } from './helpers/LoginHelper';
import { registerUser } from './helpers/RegisterUser';

import rateLimit from 'express-rate-limit';

// Each IP can only send 5 login requests in 10 minutes
const loginRateLimiter = rateLimit({ max: 5, windowMs: 1000 * 60 * 10 });

const loginlimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 5, // Limit each IP to 5 requests per `window` (here, per 10 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
export const UserRouter = Router();

UserRouter.use('/login', loginlimiter).use('/login', loginRateLimiter);
UserRouter.post('/login', loginUser);
UserRouter.post('/register', registerUser);
UserRouter.use(auth);
