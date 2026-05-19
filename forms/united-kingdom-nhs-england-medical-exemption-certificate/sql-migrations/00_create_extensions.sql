-- pgcrypto provides gen_random_uuid() for UUID primary key generation.
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- pg_trgm provides trigram operators for GIN indexes used in name search.
CREATE EXTENSION IF NOT EXISTS pg_trgm;
