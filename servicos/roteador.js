// modulos de terceiros
const express = require('express')

// modulos desta aplicacao
const listaPedido = require('../controladores/listaPedido')


// Cria um roteador (baseado em uma nova instância da classe Router do Express.js)

const roteador = new express.Router()


// Endpoints

// Privados

roteador.route('/ListaPedido:filtros?')
    .get(auth(), listaPedido.get)

// Publicos

// ...


module.exports = roteador