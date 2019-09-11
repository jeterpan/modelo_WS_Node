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