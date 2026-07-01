-- pgcrypto provides gen_random_uuid() for UUID primary key generation.
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- pg_trgm provides trigram operators used by free-text search GIN indexes.
CREATE EXTENSION IF NOT EXISTS pg_trgm;
