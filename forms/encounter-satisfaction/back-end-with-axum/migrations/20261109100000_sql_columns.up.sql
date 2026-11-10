-- The sql/ columns the scaffold left out, with their CHECKs.
ALTER TABLE "satisfaction_results" ADD COLUMN "domain_scores" jsonb DEFAULT '[]' NOT NULL;
