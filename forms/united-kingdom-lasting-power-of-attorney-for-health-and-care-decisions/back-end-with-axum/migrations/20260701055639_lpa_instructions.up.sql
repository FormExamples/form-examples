CREATE TABLE IF NOT EXISTS "lpa_instructions" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "order_position" integer NOT NULL DEFAULT 1,
    "category" varchar NOT NULL DEFAULT '',
    "statement" text NOT NULL DEFAULT '',
    "lawfulness_assessed" varchar NOT NULL DEFAULT '',
    "contradicts_adrt" varchar NOT NULL DEFAULT '',
    "lpa_id" uuid NOT NULL,
    CONSTRAINT "fk-lpa_instructions-lpa_id-to-lpas" FOREIGN KEY ("lpa_id") REFERENCES "lpas" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE lpa_instructions ALTER COLUMN id SET DEFAULT gen_random_uuid();
