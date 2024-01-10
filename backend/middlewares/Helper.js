const jwt = require("jsonwebtoken");
const fs = require('fs');
const publicKey = fs.readFileSync('./public.pem', 'utf-8');
class Helper {
  static async verificarAutenticacao(req, res, next) {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ erro: 'Token de autenticação não fornecido' });
    }

    
    try {
      const decoded = jwt.verify(token, publicKey);
      req.usuario = decoded;
      console.log(req.usuario)
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ erro: 'Token inválido' });
    }
  }

  static async verificarPermissaoAdmin(req, res, next) {
    if (req.usuario && req.usuario.permissoes && req.usuario.permissoes.includes('admin')) {
      next();
    } else {
      res.status(403).json({ erro: 'Acesso proibido. Permissão de admin necessária' });
    }
  }
}

module.exports = Helper;
