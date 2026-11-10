CREATE TABLE IF NOT EXISTS "prescription_substitution_options" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "allow_brand_substitution" varchar NOT NULL DEFAULT '',
    "allow_generic_substitution" varchar NOT NULL DEFAULT '',
    "allow_dosage_adjustment" varchar NOT NULL DEFAULT '',
    "substitution_notes" text NOT NULL DEFAULT '',
    "prescription_request_id" uuid NOT NULL,
    CONSTRAINT "fk-prescription_substitution_options-prescription_request_id-to-prescription_requests" FOREIGN KEY ("prescription_request_id") REFERENCES "prescription_requests" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE prescription_substitution_options ALTER COLUMN id SET DEFAULT gen_random_uuid();
