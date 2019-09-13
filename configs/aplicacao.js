module.exports = {

      // Configuração de Ambiente da aplicação
      ambiente: 'dev' // dev para desenvolvimento ou prd para producao

      // Configuração de autenticação

      // Para consumir este WebService, deve-se exigir autenticacao?
      // S para Sim, N para Nao - Se configurar para sim, observe que deve-se configurar mais dados de autenticacao abaixo
    , exigeAutenticacao: 'S' 
    , chaveSecretaJWT: process.env.WS_MODELO_JWT_SECRET_KEY

}