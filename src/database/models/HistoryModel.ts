import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from 'sequelize';

const HistoryModel = (sequelize: Sequelize) => {
  class History extends Model<
    InferAttributes<History>,
    InferCreationAttributes<History>
  > {
    declare id: CreationOptional<number>;
    declare media?: string;
    declare peoples: number;
    declare views?: number;
    declare amount?: number;
  }
  History.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      media: {
        type: DataTypes.STRING,
        allowNull: true
      },
      peoples: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      views: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      amount: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      sequelize,
      timestamps: true,
      createdAt: true,
      updatedAt: true,
    }
  );

  return History;
};

export default HistoryModel;
