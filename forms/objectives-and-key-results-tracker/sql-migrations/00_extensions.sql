--liquibase formatted sql

--changeset author:1
CREATE EXTENSION IF NOT EXISTS pgcrypto;
--rollback DROP EXTENSION IF EXISTS pgcrypto;

--changeset author:2
CREATE EXTENSION IF NOT EXISTS pg_trgm;
--rollback DROP EXTENSION IF EXISTS pg_trgm;
