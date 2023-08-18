import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from 'sequelize';
import bcrypt from 'bcrypt';

const UserModel = (sequelize: Sequelize) => {
  class User extends Model<
    InferAttributes<User>,
    InferCreationAttributes<User>
  > {
    declare id: CreationOptional<number>;
    declare name: string;
    declare email: string;
    declare password: string;
    declare whatsapp: string;
    declare phone: string;
    declare website?: string;
    declare facebook?: string;
  }
  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'DOE',
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: { name: 'email-unique-constraint', msg: "Cet email possede deja un compte" },
        validate: {
          isEmail: {
            msg: 'only good email are accepted',
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'adn123',
      },
      whatsapp: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      website: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      facebook: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      hooks: {
        afterCreate: user => {
          bcrypt.hash(user.password, 10, (err, hash) => {
            user.update({ password: hash }).then(usertemp => {
              console.log('user', user.id);
            });
          });
        },
      },
      sequelize,
      timestamps: true,
      createdAt: true,
      updatedAt: true,
    }
  );

  return User;
};

export default UserModel;
