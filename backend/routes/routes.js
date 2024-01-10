const Express  = require("express")

const UsuarioController = require("../controllers/UsuarioController")
const Helper = require("../middlewares/Helper")

usuarioRouter = Express.Router()
usuarioRouter.post("/createuser",UsuarioController.createUser)
usuarioRouter.post("/login",UsuarioController.login)
usuarioRouter.get("/usuarios",Helper.verificarAutenticacao, Helper.verificarPermissaoAdmin, UsuarioController.getUsers)
usuarioRouter.route('/usuarios/:id')
  .get(Helper.verificarAutenticacao, Helper.verificarPermissaoAdmin, UsuarioController.getUser)
  .put(Helper.verificarAutenticacao, Helper.verificarPermissaoAdmin, UsuarioController.updateUser)
  .delete(Helper.verificarAutenticacao, Helper.verificarPermissaoAdmin, UsuarioController.deleteUser);

module.exports = usuarioRouter;