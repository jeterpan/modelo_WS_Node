// Objetivo: Interface com o Banco de Dados
//           Equivalente ao Model em uma aplicacao MVC
//           (parte responsavel por definir o modelo de dados a ser retornado)

// modulos nativos Node.js
const querystring = require('querystring')

// modulos da aplicacao
const libJet = require('../libJet/libJet.js')
const banco = require('../servicos/banco.js')

// Comando SQL base
const sqlBase = 
`
SELECT *
  FROM pedido
`

// Objetivo: Consultar o contexto que foi solicitado

async function consultar(contexto) {
    let sql = sqlBase
    let filtros = {}
    const binds = {}

    // Se foi informado filtros...

    if (contexto) {

      let filtros = []

      let filtrosValidados = false

      //         ?dataInicial= &dataFinal= &status= &marketplace= &offset= &limit=

        if (contexto.dataInicial || contexto.dataFinal) {
          filtros.push('data BETWEEN :dataInicial AND :dataFinal')
        }

        if (contexto.status) {
          filtros.push('status = :status')
        }
        
        if (contexto.marketplace) {
          filtros.push('marketplace = :marketplace')
        }

        condicaoWhere = libJet.unificaCondicaoWhere(filtros)

        // TODO: Implementar filtro offset

        // TODO: Implementar fitro limit
        
        binds.id = contexto.id

        sql += sqlBase + condicaoWhere
    }
    const resultado = await banco.executar(sql, binds)

    return resultado.rows
}

module.exports.consultar = consultar