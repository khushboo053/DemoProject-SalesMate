"use strict";
const { Model, DataTypes } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Supplier extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Supplier.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
      });
    }
  }
  Supplier.init(
    {
      supplierName: DataTypes.STRING,
      email: DataTypes.STRING,
      location: DataTypes.STRING,
      contactDetails: DataTypes.STRING,
      userId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Supplier",
    }
  );
  return Supplier;
};
