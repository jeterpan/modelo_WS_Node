// módulos de terceiros
const oracledb = require('oracledb')

// módulos desta aplicação
const dbConfig = require('../configs/banco.js')


// Objetivo: Inicializar um pool de conexoes, 
//  utilizando o driver node-oracledb para conexao com o Banco de dados Oracle
async function inicializa() {
    const pool = await oracledb.createPool(dbConfig.hrPool)
}

module.exports.inicializa =  inicializa


// Objetivo: Encerrar o Pool de conexoes do Banco de dados
async function encerra() {
    await oracledb.getPool().close();
}
   
module.exports.encerra = encerra;


// Objetivo: executar declaracoes simples de SQL ou PL/SQL
function executar(sql, binds, opcoes = {}) {
    return new Promise(async (resolve, reject) => {
        let conexao

        opcoes.outFormat = oracledb.OBJECT
        opcoes.autoCommit = true

        try {
            conexao = await oracledb.getConnection()

            // Configurando a conexão
            // Se for trabalhar com muitas tabelas de outro esquema, compensa usar esta opção:
            // conexao.currentSchema('LOGIX')

            const resultado = await conexao.execute(sql, binds, opcoes)
            resolve(resultado)
        } catch (erro) {
            reject(erro)
        } finally {
            if (conexao) {
                try {
                    await conexao.close()
                } catch (erro) {
                    console.log(erro)
                }
            }
        }
    })
}

module.exports.executar = executar