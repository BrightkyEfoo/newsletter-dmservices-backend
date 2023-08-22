import express, { NextFunction, Request, Response } from 'express';
import { dbInit } from './database/Sequelize';
import { UserRouter } from './Routes/User';
import cors from 'cors';
import morgan from 'morgan';
import addImageToServer from './Routes/addImageToServer';
import helmet from 'helmet';
import session2 from 'cookie-session';
// import RedisServer from 'redis-server';
// const server = new RedisServer(6379);
// server.open(err => {
//   if (err === null) {
//     // You may now connect a client to the Redis
//     // server bound to port 6379.
//   }
// });
const port = process.env.PORT || 9000;
const app = express();
// console.log('contacts', contacts)
app.use(
  cors({
    origin: '*',
  })
).use(express.json())

app.set('trust proxy', 1); // trust first proxy

const expiryDate = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
app.use(
  session2({
    name: 'session',
    keys: ['key1', 'key2'],
    secure: true,
    httpOnly: true,
    domain: 'localhost',
    path: 'foo/bar',
    expires: expiryDate,
  })
);

app.use(helmet());

app
  .use(express.json())
  .use('/public', express.static('./public'))
  .use(morgan('dev'));

dbInit();

app.use('/user', UserRouter);
addImageToServer(app);

app.use((req, res, next) => {
  res.status(404).send("Sorry can't find that!");
});

// custom error handler
// app.use((err: Error, _req: Request, res: Response) => {
//   console.error(err.stack);
//   res.status(500).send("Something broke!");
// });
app.listen(port, () => {
  console.log(`Our server is running on port ${port}`);
});
