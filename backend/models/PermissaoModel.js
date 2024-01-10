const {DataTypes} = require("sequelize")
const sequelize = require("../db/conn")

const PermissaoModel = sequelize.define('permissoe', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nome: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
  },
  updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
  },
  }, {
    timestamps: true, 
  
  });

module.exports = {PermissaoModel};