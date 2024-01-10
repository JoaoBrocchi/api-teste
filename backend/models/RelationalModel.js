const Usuario = require('./UsuarioModel');
const Permissao = require('./PermissaoModel');
const UsuarioPermissao = require('./UsuarioPermissaoModel');

Usuario.belongsToMany(Permissao, { through: UsuarioPermissao });
Permissao.belongsToMany(Usuario, { through: UsuarioPermissao });

module.exports = { Usuario, Permissao, UsuarioPermissao };