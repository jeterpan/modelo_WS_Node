// Objetivo: Simular o WebService do fornecedor Ideris,
//           afim de fazer testes em um middleware para integracao Hub (Ideris) x Logix

// Pull Requests
//  - Implementar exigência de autenticação JWT para consumir este WS
//  - Implementar exemplos com os diversos metodos mais utilizados: GET, POST (levando-se em consideração as operações CRUD)
//  - Implementar suporte para cliente poder solicitar listar por exemplo: N registros (exemplo: por Listar apenas 50 Pedidos de Venda) (parametro: limit/limite)
//  - Implementar suporte para cliente poder paginar (quando há muitos registros a serem listados) (parametro offset/deslocamento)
//  - Docker - preparar para trabalhar em Docker
//  - Micro serviços - Manter em mente que este é um modelo a ser utilizado como exemplo para vários micro serviços


// Instruções de instalação:
//
//  Configurar as váriaveis de ambiente
//   UV_THREADPOOL_SIZE - quantidade de threads a serem utilizadas entre Node.js e banco de dados
//   WS_MODELO_CONNSTRING - String de conexão com o banco de dados: exemplo: 10.0.7.156/HOM
//   WS_MODELO_BDUSER - Usuario para WS Modelo conectar ao banco de dados
//   WS_MODELO_BDPASSWORD - senha para WS Modelo conectar ao banco de dados
//   WS_MODELO_CORS_ALLOW_ORIGINS - Origens permitidas: exemplo: 'http://localhost:4200'

//  Revisar os arquivos de configuração
//   ./configs/aplicacao.js
//   ./configs/banco.js
//   ./configs/servidorWeb.js


// modulos desta aplicacao
const servidorWeb = require('./services/servidorWeb.js')
const banco = require('./servicos/banco.js/index.js')
const configBanco = require('./configs/banco.js/index.js')


// Configuração de número de Threads entre Node.js e Banco Oracle
//  Node.js 12.6 suporta até 1024 threads

const defaultThreadPoolSize = 4

// Increase thread pool size by poolMax
process.env.UV_THREADPOOL_SIZE = configBanco.hrPool.poolMax + defaultThreadPoolSize


// Objetivo: Inicia aplicacao (Servidor Web e Banco de dados)
async function iniciaAplicacao(){
    console.log('Iniciando aplicacao...')

    try {
        console.log('Inicializando o modulo de banco de dados')

        await banco.inicializa()
    } catch (erro) {
        console.error(erro)

        process.exit(1)  // Sai do processo/aplicacao informando que houve Codigo de falha nao-zero
    }

    try{
        console.log('Inicializando o modulo servidor Web...')

        await servidorWeb.inicializa()
    } catch (erro) {
        console.error(erro)

        process.exit(1) // Sai do processo/aplicacao informando que houve Codigo de falha nao-zero
    }
}


// Inicia a aplicacao
iniciaAplicacao();


// Objetivo: Encerrar a Aplicacao
async function encerraAplicacao(e) {
    let erro = e

    console.log('Encerrando a aplicação')

    // Desliga o Servidor Web
    try {
        console.log('Encerra o Servidor Web')

        await servidorWeb.encerra()
    } catch (e) {
        console.log('Erro encontrado ao encerrar servidor web ', e)

        erro = erro || e
    }

    // Fecha o Pool de conexoes com banco de dados
    try {
        console.log('Encerrando o modulo de Banco de dados');

        await database.encerra(); 
    } catch (e) {
        console.log('Erro encontrado ao encerrar pool de conexoes', e);

        erro = erro || e;
    }

    
    console.log('Saindo do processo')

    if(erro) {
        process.exit(1) // Codigo de falha nao-zero
    } else {
        process.exit(0)
    }
}


// Objetivo: Cria listeners para encerrar corretamente a aplicacao

process.on('SIGTERM', () => {
    console.log('Recebido SIGTERM')

    encerraAplicacao()
})

process.on('SIGINT', ()=> {
    console.log('Recebido SIGINT')

    encerraAplicacao()
})

process.on('uncaughtException', err => {
    console.log('Uncaught exception')
    console.error(err)

    shutdown(err)
})