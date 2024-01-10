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
  });

module.exports = {PermissaoModel};