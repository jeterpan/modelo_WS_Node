/*

Objetivo: Criar objetos de banco de dados ref a um servidor de autenticacao JWT

Banco: Oracle 11g

*/


/* ATENCAO: Conectar no banco com o usuario admin de banco de dados criado para o JWT
             para executar este script
*/


-- Cria tabela com dados de autenticacao

CREATE TABLE auth_users (
   id NUMBER NOT NULL,
   email VARCHAR2(100 byte) NOT NULL,
   role VARCHAR2(10 byte) NOT NULL,
   password VARCHAR2(100 byte) NOT NULL,
   CONSTRAINT auth_users_pk PRIMARY KEY (id),
   CONSTRAINT auth_users_chk1 CHECK (role IN ('BASE', 'ADMIN')),
   CONSTRAINT auth_users_uk1 UNIQUE (email)
)
;


-- Cria sequencia que será utilizada para gerar automaticamente o ID do usuario

CREATE SEQUENCE auth_users_seq;
;


-- Cria trigger que gera o ID do usuário, baseado em sequence

CREATE OR REPLACE TRIGGER bir_auth_users_trg
   BEFORE INSERT ON auth_users
   FOR EACH ROW
BEGIN
   IF :new.id IS NULL
   THEN
      :new.id := auth_users_seq.NEXTVAL;
   END IF;
END bir_auth_users_trg;
;
