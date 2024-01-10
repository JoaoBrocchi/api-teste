const { DataTypes } = require("sequelize");
const sequelize = require("../db/conn");
const { PermissaoModel } = require('./PermissaoModel'); 

const UsuarioModel = sequelize.define('usuario', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nome: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: false,
    },
    senha: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    Permissao_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: PermissaoModel, 
            key: 'id', 
        },
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
});


UsuarioModel.hasMany(PermissaoModel, { foreignKey: 'Permissao_id', targetKey: 'id' });

module.exports = { UsuarioModel };
