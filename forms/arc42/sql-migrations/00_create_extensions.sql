-- pgcrypto provides gen_random_uuid() for UUID primary key generation.
CREATE EXTENSION IF NOT EXISTS pgcrypto;
-- pg_trgm enables trigram GIN indexes for substring search on text columns.
CREATE EXTENSION IF NOT EXISTS pg_trgm;
