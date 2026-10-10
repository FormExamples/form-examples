-- pgcrypto provides gen_random_uuid() for UUID primary key generation.
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- pg_trgm provides trigram matching for the GIN name-search indexes.
CREATE EXTENSION IF NOT EXISTS pg_trgm;
