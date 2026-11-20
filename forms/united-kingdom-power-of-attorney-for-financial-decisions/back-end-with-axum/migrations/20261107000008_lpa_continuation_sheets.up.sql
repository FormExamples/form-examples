CREATE TABLE IF NOT EXISTS "lpa_continuation_sheets" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "lpa_id" uuid NOT NULL,
    "kind" text NOT NULL DEFAULT '',
    "body_text" text NOT NULL DEFAULT '',
    "signed_on" date NULL,
    "ordinal" integer NOT NULL DEFAULT 1,
    CONSTRAINT "fk-lpa_continuation_sheets-lpa_id-to-lasting_power_of_attorneys" FOREIGN KEY ("lpa_id") REFERENCES "lasting_power_of_attorneys" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE lpa_continuation_sheets ALTER COLUMN id SET DEFAULT gen_random_uuid();
