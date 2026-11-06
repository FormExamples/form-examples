CREATE TABLE IF NOT EXISTS "lpa_replacement_attorneys" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "order_position" integer NOT NULL,
    "replacement_trigger" text NOT NULL DEFAULT '',
    "lpa_id" uuid NOT NULL,
    "replacement_attorney_id" uuid NOT NULL,
    CONSTRAINT "fk-lpa_replacement_attorneys-lpa_id-to-lpas" FOREIGN KEY ("lpa_id") REFERENCES "lpas" (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "fk-lpa_replacement_attorneys-replacement_attorney_id-to-replacement_attorneys" FOREIGN KEY ("replacement_attorney_id") REFERENCES "replacement_attorneys" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE lpa_replacement_attorneys ALTER COLUMN id SET DEFAULT gen_random_uuid();
