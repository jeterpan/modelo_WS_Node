const jwt = require('jsonwebtoken')
const cfgAutenticacao = require('../configs/aplicacao.js')

function auth(role) {
    return function (req, res, next) {
        let token
        let payload

        // Se a aplicacao está configurada para exigir autenticacao ...

        if (cfgAutenticacao.exigeAutenticacao=='S') {

            // Se usuário Não enviou no cabeçalho da requisição as informações para autorização ...

            if (!req.headers.authorization) {

                // ... retorna ao usuario que ele não está autorizado 
                return res.status(401).send({mensagem: 'Você não está autorizado!'})
            }

            // É esperado que o usuário envie no cabeçalho a palavra Bearer (portador), seguida do Token que ele recebeu no momento da autenticacao
            //  Exemplo: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJqZXRlci5jb3N0YUBnbWFpbC5jb20iLCJyb2xlIjoiQkFTRSIsImlhdCI6MTU2MTQwNzIzNSwiZXhwIjoxNTYxNDA3MzU1fQ.3OxQ-H-wTuOH9l33rmujzkHM9452VxgOlLMipPUsVP4
            //  Separamos aqui então o token

            token = req.headers.authorization.split(' ')[1]


            // Verifica o Token enviado pelo usuario em relação a chave secreta configurada para esta aplicacao
            try {

                // extrai desta verificacao o payload (que pode ter: usuario, tempo de expiracao, assunto, audiencia e outros)
                payload = jwt.verify(token, cfgAutenticacao.chaveSecretaJWT)

            } catch (erro) {
                if (erro.name === 'TokenExpiredError') {
                    res.status(401).send({mensagem: 'Token expirado'})
                } else {
                    res.status(401).send({mensagem: 'Falha na autenticação'})
                }

                return
            }

            // ??? CONTINUAR DAQUI


            if (!role || role === payload.role) {
                req.user = {
                      email: payload.sub
                    , role: payload.role
                }

                next()
            } else {
                res.status(401).send({mensagem: 'Você não está autorizado!'})
            }

          //  se a aplicacao nao exige autenticacao ...
        } else {

            // .. continua o processamento
            next()
        }
    }
}