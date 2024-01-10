class Helper {
    static async verificarAutenticacao(req, res, next) {
        const token = req.headers.authorization;
        if (!token) {
          return res.status(401).json({ erro: 'Token de autenticação não fornecido' });
        }
      
        // Verificar token e obter informações do usuário
        try {
          const decoded = jwt.verify(token, 'chave-secreta'); // Substitua pela sua chave secreta real
          req.usuario = decoded;
          next();
        } catch (error) {
          console.error(error);
          res.status(401).json({ erro: 'Token inválido' });
        }
        }
      
      // Função de middleware para verificar permissão de admin
    static async verificarPermissaoAdmin(req, res, next) {
        if (req.usuario && req.usuario.permissoes.includes('admin')) {
            next();
        } else {
            res.status(403).json({ erro: 'Acesso proibido. Permissão de admin necessária' });
        }
        }
}
module.exports = Helper;