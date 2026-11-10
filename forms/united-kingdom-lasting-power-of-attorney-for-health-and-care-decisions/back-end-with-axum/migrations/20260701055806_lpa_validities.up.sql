CREATE TABLE IF NOT EXISTS "lpa_validities" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "validity_status" varchar NOT NULL DEFAULT '',
    "completeness_score" integer NOT NULL DEFAULT 0,
    "effective_date" date NULL,
    "computed_at" timestamp with time zone NOT NULL,
    "engine_version" varchar NOT NULL DEFAULT '',
    "notes" text NOT NULL DEFAULT '',
    "lpa_id" uuid NOT NULL,
    CONSTRAINT "fk-lpa_validities-lpa_id-to-lpas" FOREIGN KEY ("lpa_id") REFERENCES "lpas" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE lpa_validities ALTER COLUMN id SET DEFAULT gen_random_uuid();
