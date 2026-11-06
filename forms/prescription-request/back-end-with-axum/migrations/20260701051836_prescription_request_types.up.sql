CREATE TABLE IF NOT EXISTS "prescription_request_types" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "is_new_prescription" varchar NOT NULL DEFAULT '',
    "is_emergency" varchar NOT NULL DEFAULT '',
    "additional_notes" text NOT NULL DEFAULT '',
    "prescription_request_id" uuid NOT NULL,
    CONSTRAINT "fk-prescription_request_types-prescription_request_id-to-prescription_requests" FOREIGN KEY ("prescription_request_id") REFERENCES "prescription_requests" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE prescription_request_types ALTER COLUMN id SET DEFAULT gen_random_uuid();
