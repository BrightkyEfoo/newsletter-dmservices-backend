import express from 'express';
import { dbInit } from './database/Sequelize';
import { UserRouter } from './Routes/User';
import cors from 'cors';
import morgan from 'morgan';
import addImageToServer from './Routes/addImageToServer';
import { getContact } from './contacts';
import { initClients } from './wwebjs-clients/init';

const port = process.env.PORT || 9000;
const app = express();
export const numberOfWhatsappWebClients = 1;
export const clients = initClients(numberOfWhatsappWebClients);
export const contacts = getContact();
// console.log('contacts', contacts)
app.use(
  cors({
    origin: '*',
  })
);

app
  .use(express.json())
  .use('/public', express.static('./public'))
  .use(morgan('dev'));

dbInit();

app.use('/user', UserRouter);
addImageToServer(app);

app.listen(port, () => {
  console.log(`Our server is running on port ${port}`);
});
