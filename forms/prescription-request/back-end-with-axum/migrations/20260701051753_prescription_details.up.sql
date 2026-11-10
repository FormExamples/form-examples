CREATE TABLE IF NOT EXISTS "prescription_details" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "request_date" date NOT NULL,
    "medication_name" varchar NOT NULL DEFAULT '',
    "dosage" varchar NOT NULL DEFAULT '',
    "frequency" varchar NOT NULL DEFAULT '',
    "route_of_administration" varchar NOT NULL DEFAULT '',
    "treatment_instructions" text NOT NULL DEFAULT '',
    "prescription_request_id" uuid NOT NULL,
    CONSTRAINT "fk-prescription_details-prescription_request_id-to-prescription_requests" FOREIGN KEY ("prescription_request_id") REFERENCES "prescription_requests" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE prescription_details ALTER COLUMN id SET DEFAULT gen_random_uuid();
