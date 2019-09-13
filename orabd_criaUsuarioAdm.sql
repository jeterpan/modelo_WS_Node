/*

Objetivo: Criar usuário de banco admin para o servidor de autenticacao JWT

Banco: Oracle 11g

*/


-- ATENÇÃO: Conecte-se como DBA para executar este script

CREATE USER jwtadmin IDENTIFIED BY senhaDoUsuarioAdminAqui
;

GRANT CONNECT TO jwtadmin
;

GRANT RESOURCE TO jwtadmin
;
