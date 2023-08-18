import { Router } from 'express';
import auth from '../../auth/auth';
import { loginUser } from './helpers/LoginHelper';
import { registerUser } from './helpers/RegisterUser';
import { broadcastHelper } from './helpers/BroadcastHelper';
import { getHistory } from './helpers/HistoryHelpers';


export const UserRouter = Router();

UserRouter.post('/login',loginUser)
UserRouter.post('/register',registerUser)
UserRouter.use(auth)

UserRouter.post('/broadcast',broadcastHelper)
UserRouter.get('/history',getHistory)