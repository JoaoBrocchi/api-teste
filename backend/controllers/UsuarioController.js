const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require("dotenv").config()
const {UsuarioModel} = require('../models/UsuarioModel.js');
const {PermissaoModel}= require("../models/PermissaoModel");
const { where } = require('sequelize');
const fs = require('fs');

const privateKey = fs.readFileSync('./private.pem', 'utf-8');

class UsuarioController {
  static async createUser(req, res) {
    try {
      const { nome, email, senha, permissoes } = req.body;
    
      if (!nome || !email || !senha) {
        console.error("Campos obrigatórios não preenchidos");
        return res.status(400).json({ erro: 'Todos os campos devem ser preenchidos' });
      }
    
      
      const hashedSenha = await bcrypt.hash(senha, 10);
      
      let Permissao_id
      const permissao = await PermissaoModel.findOne({ where: { nome: permissoes } });

      if (permissao) {
        Permissao_id = permissao.id;
      } else {
        console.error('Permissao não encontrada');
        return res.status(404).json({ erro: 'Permissao não encontrada' });
      }
      const novoUsuario = await UsuarioModel.create({
        nome,
        email,
        senha: hashedSenha,
        Permissao_id
      });
    
      
  
      res.status(201).json({ mensagem: 'Usuário cadastrado com sucesso' });
    } catch (error) {
      console.error("Erro ao cadastrar usuário:", error);
      res.status(500).json({ erro: 'Erro ao cadastrar usuário' });
    }
  }

  



  static async login(req, res) {
    try {
      const { email, senha } = req.body;

      
      const usuario = await UsuarioModel.findOne({
        where: { email : email}
        
      });

      if (!usuario || !(await bcrypt.compare(senha, usuario.senha))) {
        return res.status(401).json({ erro: 'Credenciais inválidas' });
      }
      
      const permissao = await  PermissaoModel.findOne({where :{id : usuario.Permissao_id }})
      console.log(permissao)
      const payload = {
        usuarioId: usuario.id,
        nome : usuario.nome,
        permissoes: permissao.nome,
      };
      
      const token = jwt.sign(payload, privateKey, { algorithm: 'RS256', expiresIn: '1h' });

      res.status(201).json({ token });
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

        
        usuario.nome = nome || usuario.nome;
        usuario.email = email || usuario.email;

        if (senha) {
          const hashedSenha = await bcrypt.hash(senha, 10);
          usuario.senha = hashedSenha;
        }

        await usuario.save();

        
        if (permissoes && permissoes.length > 0) {
          const permissoesAssociadas = await PermissaoModel.findAll({
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
