CREATE TABLE IF NOT EXISTS "validation_results" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "validity_status" varchar NOT NULL DEFAULT '',
    "completeness_score" integer NOT NULL DEFAULT 0,
    "completeness_status" varchar NOT NULL DEFAULT '',
    "validated_at" timestamp with time zone NULL,
    "validator_version" varchar NOT NULL DEFAULT '',
    "hipaa_authorization_id" uuid NOT NULL,
    CONSTRAINT "fk-validation_results-hipaa_authorization_id-to-hipaa_authorizations" FOREIGN KEY ("hipaa_authorization_id") REFERENCES "hipaa_authorizations" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE validation_results ALTER COLUMN id SET DEFAULT gen_random_uuid();
