const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const { UsuarioModel, PermissaoModel, UsuarioPermissao } = require('../models/RelationalModel');
class UsuarioController {
  static async createUser(req, res) {
    try {
      const { nome, email, senha, permissoes } = req.body;

      if (!nome || !email || !senha) {
        console.error("Campos obrigatórios não preenchidos");
        return res.status(400).json({ erro: 'Todos os campos devem ser preenchidos' });
      }

      // Hash da senha antes de salvar no banco de dados
      const hashedSenha = await bcrypt.hash(senha, 10);

      // Criação do usuário
      const novoUsuario = await UsuarioModel.create({
        nome,
        email,
        senha: hashedSenha,
      });

      // Associação das permissões ao usuário
      if (permissoes && permissoes.length > 0) {
        const permissoesAssociadas = await PermissaoModel.findAll({
          where: { nome: permissoes },
        });

        await novoUsuario.setPermissoes(permissoesAssociadas);
      }

      res.status(201).json({ mensagem: 'Usuário cadastrado com sucesso' });
    } catch (error) {
      console.error("Erro ao cadastrar usuário:", error);
      res.status(500).json({ erro: 'Erro ao cadastrar usuário' });
    }
  }

  



  static async login(req, res) {
    try {
      const { email, senha } = req.body;

      // Busca o usuário pelo email incluindo as permissões
      const usuario = await UsuarioModel.findOne({
        where: { email },
        include: [{ model: Permissao, attributes: ['nome'], through: { attributes: [] } }],
      });

      if (!usuario || !(await bcrypt.compare(senha, usuario.senha))) {
        return res.status(401).json({ erro: 'Credenciais inválidas' });
      }

      // Gera um token JWT com as permissões do usuário
      const token = jwt.sign(
        { id: usuario.id, email: usuario.email, permissoes: usuario.permissoes },
        process.env.JWT_SECRET || 'chave-secreta',
        { algorithm: 'RS256' }
      );

      res.json({ token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ erro: 'Erro ao realizar login' });
    }
  }

  static async getUser(req, res) {
    try {
      const usuario = await UsuarioModel.findByPk(req.params.id);
      res.json(usuario || {});
    } catch (error) {
      console.error(error);
      res.status(500).json({ erro: 'Erro ao buscar usuário' });
    }
  }

  static async getUsers(req, res) {
    try {
      const usuarios = await UsuarioModel.findAll();
      res.json(usuarios || []);
    } catch (error) {
      console.error(error);
      res.status(500).json({ erro: 'Erro ao buscar usuários' });
    }
  }

  static async deleteUser(req, res) {
    try {
      const usuario = await UsuarioModel.findByPk(req.params.id);

      if (usuario) {
        // Implemente aqui a lógica para deletar o usuário
        await usuario.destroy();
        res.json({ mensagem: 'Usuário deletado com sucesso' });
      } else {
        res.status(404).json({ erro: 'Usuário não encontrado' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ erro: 'Erro ao deletar usuário' });
    }
  }

  static async updateUser(req, res) {
    try {
      const usuario = await UsuarioModel.findByPk(req.params.id);

      if (usuario) {
        const { nome, email, senha, permissoes } = req.body;

        // Atualiza os dados do usuário
        usuario.nome = nome || usuario.nome;
        usuario.email = email || usuario.email;

        if (senha) {
          const hashedSenha = await bcrypt.hash(senha, 10);
          usuario.senha = hashedSenha;
        }

        await usuario.save();

        // Atualiza as permissões associadas ao usuário, se necessário
        if (permissoes && permissoes.length > 0) {
          const permissoesAssociadas = await Permissao.findAll({
            where: { nome: permissoes },
          });
          await usuario.setPermissoes(permissoesAssociadas);
        }

        res.json({ mensagem: 'Usuário atualizado com sucesso' });
      } else {
        res.status(404).json({ erro: 'Usuário não encontrado' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ erro: 'Erro ao atualizar usuário' });
    }
  }
}

module.exports = UsuarioController;
