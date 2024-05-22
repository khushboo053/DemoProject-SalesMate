'use strict';
const {
  Model
} = require('sequelize');
// const Supplier = require("./supplier").Supplier;
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Order, {
        foreignKey: 'userId',
        as: 'orders'
      });

      User.hasMany(models.Cart, {
        foreignKey: 'userId',
        as: 'carts'
      })
      // User.hasOne(models.Supplier, {
      //   foreignKey: 'userId',
      //   as: 'supplier'
      // })
    }
  }
  User.init(
    {
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [8, 255],
          // is: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
        },
      },
      tokens: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: "[]",
        get() {
          return JSON.parse(this.getDataValue("tokens"));
        },
        set(value) {
          this.setDataValue("tokens", JSON.stringify(value));
        },
      },
      otp: {
        type: DataTypes.STRING,
        allowNull: true
      },
      otpExpiration: {
        type: DataTypes.DATE,
        allowNull: true
      },
      role: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: 'user',
        validate: {
          isIn: [['admin', 'user', 'supplier']]
        }
      }
    },
    {
      sequelize,
      modelName: "User",
      // hooks: {
      //   afterCreate: async (user, options) => {
      //     if (user.role === 'supplier') {
      //       await Supplier.create({
      //         supplierName: `${user.firstName} ${user.lastName}`,
      //         email: user.email,
      //         userId: user.id
      //       })
      //     }
      //   }
      // }
    }
  );
  return User;
};

