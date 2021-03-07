// Christpher Jones, Senior Principal Product Manager, indica criar um pool com tamanho fixo
//  Por este motivo o poolMin e poolMax sao iguais e o poolIncrement é 0 zero
//  O benefício de ter um Pool com tamanho fixo é evitar que firewalls derrubem conexões inativas durante a
//   noite (caso o Pool seja com conexões variáveis), e evitar connection storm durante a manhã, quando os usuários chegam e muitos querem conectar
//   simultaneamente, causando lentidão.

// Conselho: Defina o poolMax com um numero minimo necessario de conexoes maximas, e caso precisar aumentar ele, reveja tambem o numero de threads
//  do Node (creio que são threads entre Node.js e libUV): parametro: UV_THREADPOOL_SIZE
// O Christopher disse que tem ferramentas para monitorar isso, procurar a respeito
module.exports = {
    hrPool: {
          user: process.env.WS_MODELO_BDUSER
        , password: process.env.WS_MODELO_BDPASSWORD
        , connectionString: process.env.WS_MODELO_CONNSTRING
        , poolMin: 10
        , poolMax: 10
        , poolIncrement: 0
    }
}
