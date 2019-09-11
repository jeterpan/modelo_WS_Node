module.exports = {

    // Porta onde o Servidor Web escutará
    //  Você pode definí-la na variável de ambiente HTTP_PORT ou definir uma porta alternativa aqui
    port: process.env.HTTP_PORT || 3003
    
    // Configurações para Cross Origin Resource Sharing
    , origensPermitidas: process.env.WS_MODELO_CORS_ALLOW_ORIGINS // se usar asterisco (*) em vezes de especificar um dominio, permitirá requisições de todos os dominios cruzados (all cross domain)
    , cabecalhosPermitidos: 'Origin, X-Requested-With, Content-Type, Accept'
    , metodosPermitidos: 'GET, POST, PUT, DELETE, OPTIONS'

}