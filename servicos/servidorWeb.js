// Objetivo: Criar um servidor Web para manipular requisicoes em uma determinada porta

// Funcionalidades: 
// - Cross Origin Resource Sharing ??? HABILITADO PARA ACEITAR QUALQUER REQUISICAO ??? TODO: MELHORAR ISSO PARA COLOCARMOS EM PRODUCAO
// - Autenticacao via Json Web Token (JWT) ??? AINDA NAO IMPLEMENTADA
// - Log de erros em arquivo rotativo diario

// modulos nativos node
const http = require('http')
const path = require('path')
const fs = require('fs')

// modulos de terceiros
const express = require('express')
const bodyParser = require('body-parser')
const logger = require('morgan')
const rfs = require('rotating-file-stream')
const cors = require('cors')

// modulos desta aplicacao
const aplicacao = require('../configs/aplicacao.js')
const servidorWebConfig = require('../configs/servidorWeb.js')
const roteador = require('./roteador.js')

let servidorHttp;


// Objetivo: Inicializar o Servidor Web

function inicializa(){
    return new Promise( (resolve, reject) => {
        
        // Express: Inicializa o modulo/framework de terceiro que auxilia no tratamento de requisicoes e respostas http
        //           entre outras funcionalidades
        const app = express()

        // Configura o modulo de terceiro Morgan responsavel por geracao de arquivos de Logs
        //  de requisicoes, respostas e erros do Servidor Web
        // Este grava as mensagens nos logs no padrao Apache
        if(aplicacao.ambiente === 'prd') {

            // Configurando Cross Origin Resource Sharing (CORS) para ambiente de produção

            // Abaixo inserimos uma função middleware que interceptará todas as requisições utilizadas pelo Express.js
            //  é como se configurassemos para o http server do Node (Utilizado aqui pelo Express.js) para tratar estes cabeçalhos

            // TODO: já que estou usando o módulo CORS de terceiro, alterar o comando abaixo para usá-lo aqui
            //        nota: apesar de preferir evitar módulos de terceiros, acho que vou usar sim o módulo CORS, visto que a licença é MIT
            //               e entendo que ele deve ser muito leve e facilitará a leitura deste código fonte (o que também me atrai muito) 
            //       fonte: https://www.npmjs.com/package/cors

            app.use( function (req, res, next) {
                res.header("Access-Control-Allow-Origin", servidorWebConfig.origensPermitidas)  
                res.header("Access-Control-Allow-Headers", servidorWebConfig.cabecalhosPermitidos)
                res.header("Access-Control-Allow-Methods", servidorWebConfig.metodosPermitidos)
                next()
            });

            // Em ambiente de producao optamos por guardar todos os Logs dentro de arquivos rotativos diarios

            // Cria um arquivo rotativo usando o modulo de terceiro rotating-file-stream, 
            //  Configurado para gerar novos arquivos diariamente
            var accessLogStream = rfs('access.log', {
                interval: '1d', // rotacao diaria
                path: path.join(__dirname, 'log')
            })

            // Morgan: Inicializa o modulo de terceiro responsavel por gerar Logs de HTTP
            app.use(logger('combined', { stream: accessLogStream }))

        } else {

            // Maneira simples de aceitar qualquer requisicao CORS
            // REVISAR: Para manter mais seguro os dados
            app.use( cors() )

            // Em ambiente de desenvolvimento optamos por apresentar apenas os erros na console,
            //  serao apresentados na console apenas erros 4xx e 5xx

            app.use(logger('dev', {
                skip: function (req, res) { return res.statusCode < 400 }
            }))
            
            // Grava todas as requisicoes no arquivo access.log
            app.use(logger('common', {
                stream: fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })
            }))
        }

        // Cria um servidor http via modulo nativo http do node
        //  Este servidor ira escutar uma porta e, a cada requisicao recebida, ele chamara a fucao
        //  neste caso: app (que esta representando o framework Express.js)
        servidorHttp = http.createServer(app)

        // bodyParser: Inicializa o modulo de terceiro que nos permite trabalhar facilmente com o corpo (body) das requisicoes, exemplo: req.body
        app.use( bodyParser.json() )

        // Router: Inicializa um roteaodr baseado na classe Router do framework Express.js, 
        //          a fim de facilitar o gerenciamento das rotas
        app.use('/api', roteador)


        // Objetivo: Inicializar o servidor http do node.js

        servidorHttp.listen(servidorWebConfig.port)
            .on('listening', () => {
                console.log(`Servidor Web escutando em localhost: ${servidorWebConfig.port}`)

                resolve()
            })
            .on('error', erro => {
                reject(erro)
            })
    })
}

module.exports.inicializa = inicializa


// Objetivo: Encerrar o Servidor Web

function encerra() {
    return new Promise( (resolve,reject) => {
        servidorHttp.close( erro => {
            if(erro) {
                reject(erro)
                return
            }

            resolve()
        })
    })
}

module.exports.encerra = encerra