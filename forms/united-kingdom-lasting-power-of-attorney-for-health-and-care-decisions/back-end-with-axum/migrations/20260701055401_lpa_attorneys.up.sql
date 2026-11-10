CREATE TABLE IF NOT EXISTS "lpa_attorneys" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "order_position" integer NOT NULL,
    "lpa_id" uuid NOT NULL,
    "attorney_id" uuid NOT NULL,
    CONSTRAINT "fk-lpa_attorneys-lpa_id-to-lpas" FOREIGN KEY ("lpa_id") REFERENCES "lpas" (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "fk-lpa_attorneys-attorney_id-to-attorneys" FOREIGN KEY ("attorney_id") REFERENCES "attorneys" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE lpa_attorneys ALTER COLUMN id SET DEFAULT gen_random_uuid();
