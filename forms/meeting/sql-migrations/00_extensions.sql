-- pgcrypto provides gen_random_uuid() for UUID primary key generation.
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- pg_trgm provides trigram indexes used for free-text search across the
-- meeting title, summary, agenda items, and action item descriptions.
CREATE EXTENSION IF NOT EXISTS pg_trgm;
