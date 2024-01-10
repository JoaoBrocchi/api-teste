const {DataTypes} = require("sequelize")
const sequelize = require("../db/conn")
const UsuarioPermissaoModel = sequelize.define('UsuarioPermissao', {
    usuario_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: Usuario,
        key: 'id',
      },
    },
    permissao_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: Permissao,
        key: 'id',
      },
    },
  });
module.exports = { UsuarioPermissaoModel};