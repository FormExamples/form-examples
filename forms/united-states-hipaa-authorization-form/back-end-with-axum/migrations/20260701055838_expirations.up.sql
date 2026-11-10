CREATE TABLE IF NOT EXISTS "expirations" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "kind" varchar NOT NULL DEFAULT '',
    "expiration_date" date NULL,
    "expiration_event" text NOT NULL DEFAULT '',
    "duration_months" integer NULL,
    "duration_label" varchar NOT NULL DEFAULT '',
    "hipaa_authorization_id" uuid NOT NULL,
    CONSTRAINT "fk-expirations-hipaa_authorization_id-to-hipaa_authorizations" FOREIGN KEY ("hipaa_authorization_id") REFERENCES "hipaa_authorizations" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE expirations ALTER COLUMN id SET DEFAULT gen_random_uuid();
