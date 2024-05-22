'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Order.belongsTo(models.Product, {
        foreignKey: 'productId',
        as: 'product'
      });

      Order.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user'
      })
    }
  }
  Order.init({
    orderDate: DataTypes.DATE,
    productId: DataTypes.INTEGER,
    qty: DataTypes.INTEGER,
    status: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isIn: [['pending', 'completed', 'shipped', 'cancelled']]
      }
    },
    userId: DataTypes.INTEGER,
    totalAmount: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'Order',
  });
  return Order;
};