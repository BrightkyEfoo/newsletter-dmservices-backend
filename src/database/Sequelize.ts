import { Sequelize } from 'sequelize';
import UserModel from './models/UserModel';
import { userFiller } from './fillers/UserFIller';
import HistoryModel from './models/HistoryModel';

const sequelize = new Sequelize('papsdb', 'root', '1', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false,
});

export const User = UserModel(sequelize);
export const History = HistoryModel(sequelize);

// relations

User.hasMany(History)
History.belongsTo(User)

export const dbInit = async () => {
  await sequelize.sync({ force: true });
  userFiller();
};
