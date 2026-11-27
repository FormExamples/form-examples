CREATE TABLE IF NOT EXISTS "medical_renal_transplant_recipient_request_tests" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "request_id" uuid NOT NULL,
    "test_code" varchar NOT NULL,
    "test_detail" varchar NOT NULL DEFAULT '',
    CONSTRAINT "fk-1bf857ef5d3b36cb172d4ecc0ca2fee5" FOREIGN KEY ("request_id") REFERENCES "medical_renal_transplant_recipient_requests" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE medical_renal_transplant_recipient_request_tests ALTER COLUMN id SET DEFAULT gen_random_uuid();
