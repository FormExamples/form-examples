-- pgcrypto provides gen_random_uuid() for UUID primary key generation.
CREATE EXTENSION IF NOT EXISTS pgcrypto;
-- pg_trgm provides gin_trgm_ops for trigram GIN indexes on text columns.
CREATE EXTENSION IF NOT EXISTS pg_trgm;
