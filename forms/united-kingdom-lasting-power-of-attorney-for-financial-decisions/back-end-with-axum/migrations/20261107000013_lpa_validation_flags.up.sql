CREATE TABLE IF NOT EXISTS "lpa_validation_flags" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "lpa_id" uuid NOT NULL,
    "flag_name" text NOT NULL DEFAULT '',
    "priority" text NOT NULL DEFAULT '',
    "category" text NOT NULL DEFAULT '',
    "remediation_hint" text NOT NULL DEFAULT '',
    "fired_at" timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "fk-lpa_validation_flags-lpa_id-to-lasting_power_of_attorneys" FOREIGN KEY ("lpa_id") REFERENCES "lasting_power_of_attorneys" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE lpa_validation_flags ALTER COLUMN id SET DEFAULT gen_random_uuid();
CREATE UNIQUE INDEX IF NOT EXISTS "index_lpa_validation_flags_0_unique" ON "lpa_validation_flags" ("lpa_id", "flag_name");
