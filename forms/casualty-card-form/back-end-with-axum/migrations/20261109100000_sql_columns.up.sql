-- The sql/ columns the scaffold left out, with their CHECKs.
ALTER TABLE "news2_results" ADD COLUMN "parameter_scores" jsonb DEFAULT '{}' NOT NULL;
