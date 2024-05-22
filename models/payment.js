'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Payment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Payment.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
      });

      // Association with Order model
      Payment.belongsTo(models.Order, {
        foreignKey: "orderId",
        as: "order",
      });
    }
  }
  Payment.init({
    userId: DataTypes.INTEGER,
    orderId: DataTypes.INTEGER,
    amount: DataTypes.FLOAT,
    currency: DataTypes.STRING,
    paymentStatus: DataTypes.STRING,
    paymentId: DataTypes.INTEGER,
    paymentMethod: DataTypes.STRING,
    paymentDetails: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Payment',
  });
  return Payment;
};