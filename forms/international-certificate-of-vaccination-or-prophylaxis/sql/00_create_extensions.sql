-- pgcrypto provides gen_random_uuid() for UUID primary key generation.
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- pg_trgm provides trigram-based fuzzy text search indexes
-- (gin_trgm_ops) used by the patient/clinician/centre name lookups.
CREATE EXTENSION IF NOT EXISTS pg_trgm;
