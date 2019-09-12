# modelo_WS_Node
Modelo de WebService usando Node.js

# Instalação
Conecte no banco de dados como DBA e crie o usuario admin de banco de dados para o servidor JWT

  Execute o script oradb_criaUsuarioAdml.sql

Conecte no banco de dados com o usuario jwtadmin e crie os objetos de banco deste usuario
 
  Execute o script oradb_criaObjetos.sql

Configurar as váriaveis de ambiente

  UV_THREADPOOL_SIZE - quantidade de threads a serem utilizadas entre Node.js e banco de dados

  WS_MODELO_CONNSTRING - String de conexão com o banco de dados: exemplo: 10.0.7.156/HOM

  WS_MODELO_BDUSER - Usuario para WS Modelo conectar ao banco de dados

  WS_MODELO_BDPASSWORD - senha para WS Modelo conectar ao banco de dados

  WS_MODELO_CORS_ALLOW_ORIGINS - Origens permitidas: exemplo: 'http://localhost:4200'


Revisar os arquivos de configuração

  ./configs/aplicacao.js

  ./configs/banco.js

  ./configs/servidorWeb.js
  
