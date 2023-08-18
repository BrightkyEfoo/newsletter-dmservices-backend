// import { user } from "../../types/Sequelize";
import { user } from "../../types/Sequelize";
import { User } from "../Sequelize";



const users:user[] = [
  {
    email:'john@test.test',
    name: 'john DOE',
    password : 'test',
    phone : '237655388662',
    whatsapp : '237655388662',
  },
  {
    email:'jack@test.test',
    name: 'jack DOE',
    password : 'test',
    phone : '237657941880',
    whatsapp : '237657941880',
  }
];

export const userFiller = () => {
  return users.forEach((element , i) => {
    User.create(element)
      .then(user => {
        console.log('user', i)
      })
      .catch(err => console.log('err', err));
  });
};
