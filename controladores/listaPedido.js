// Objetivo: Controlador (parte do processo responsavel por manipular a entrada)
//                       (este tambem se conecta a interface do banco para fazer solicitacoes)

// modulos nativos Node.js
const url = require('url')

// modulos de terceiros
const jwt = require('jsonwebtoken')

// modulos desta aplicacao
const configAplicacao = require('../configs/aplicacao.js')
const listaPedido = require('../dbAPI/listaPedido.js')

async function get(req, res, next) {

    let token
    let payload

    if (!req.headers.authorization) {
        return res.status(401).send({message: 'Você não está autorizado'})
    }

    token = req.headers.authorization.split(' ')[1]

    try {
        payload = jwt.verify(token, configAplicacao.chaveSecretaJWT)
    } catch (e) {
        if (e.name === 'TokenExpiredError') {
            res.status(401).send({message: 'Token expirado'})
        } else {
            res.status(401).send({message: 'Falha de autenticação'})
        }

        return
    }

    try {
        
        const contexto = url.parse(req.url,true)

        // TODO: Em casos onde a requisicao pode ter mais de um parametro informado:
        //        Estudar se trataremos aqui, ou se trataremos na interface com o banco de dados
        //       Exemplo: na API da Ideris, para listar pedidos eh possivel usar os seguintes parametros
        //         ?dataInicial= &dataFinal= &status= &marketplace= &offset= &limit=

        //contexto.filtros = req.params.filtros.toString()

        // (NAO TRADUZIR) MANTER ESTE NOME result AQUI. Motivo: Confome exemplo abaixo, de json retornado, é padrão da Ideris voltar o resultado com este nome:
        const result = await listaPedido.consultar(contexto)

        // Montar o que será retornado neste WE/API:

        // Exemplo: 

        /*
        {
            "paging": { //Nó responsável por auxiliar a paginação
                "limit": null, //Limite de registros retornados. O limite máximo é 50 : int
                "offset": null, //Registro de início para busca no banco de dados : int
                "count": null, //Número de registros retornados : int
                "total": null //Número total de registros : int
            },
            "result": [ //Informações da lista de pedidos
                {
                "id": null, //ID do pedido : int
                "codigo": null, //Código do pedido : string
                "marketplace": null, //Marketplace no qual o pedido foi realizado  : string
                "status": null, //Status atual do pedido : string
                "data": null //Data de aprovação do pedido : DateTime, nullable
                }
            ]
        }
        */

        const retorno = {}

        const paging = {
              limit: null
            , offset: null
            , count: null
            , total: null

        }

        // Monta um objeto de retorno com as linhas retornadas da consulta
        // (NAO TRADUZIR) MANTER ESTE NOME result AQUI. Motivo: Confome exemplo acima, de json retornado, é padrão da Ideris voltar o resultado com este nome:
        // TODO: Verificar se quando traz mais de um resultado (pedido) se ele está transformando para array, pq é assim que a API da Ideris retorna mais de um PV (em array)
        retorno = { paging, result }

        // Se foi informado parametro/filtro...
        if (req.params.id) {

            // Se encontrou dados para o filtro informado...
            if (rows.length > 0) {

                // Adiciona à resposta o que foi encontrado
                res.status(200).json(retorno)

              // Se nao encontrou nada para o filtro informado  
            } else {

                // TODO: Talvez seja interessante devolver aqui tambem um JSON com a mensagem
                //        Nao foram encontrados dados para o filtro informado
                //        Deixando assim mais amigavel a resposta deste WebService

                // Adiciona na resposta o statusCde 404 / Not found
                res.status(404).end()
            }

          // Se nao foi informado parametro/filtro...
        } else {

            // Retorna o que encontrou, independente sem tinha ou nao registro na tabela
            res.status(200).json(retorno)
        }
    } catch (erro) {
        next(erro)
    }
}

module.exports.get = get