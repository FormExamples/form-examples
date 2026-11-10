CREATE TABLE IF NOT EXISTS "lpa_validity_fired_rules" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "rule_id" varchar NOT NULL,
    "severity" varchar NOT NULL DEFAULT '',
    "rule_family" varchar NOT NULL DEFAULT '',
    "source_citation" varchar NOT NULL DEFAULT '',
    "description" text NOT NULL DEFAULT '',
    "suggested_correction" text NOT NULL DEFAULT '',
    "lpa_validity_id" uuid NOT NULL,
    CONSTRAINT "fk-lpa_validity_fired_rules-lpa_validity_id-to-lpa_validities" FOREIGN KEY ("lpa_validity_id") REFERENCES "lpa_validities" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE lpa_validity_fired_rules ALTER COLUMN id SET DEFAULT gen_random_uuid();
