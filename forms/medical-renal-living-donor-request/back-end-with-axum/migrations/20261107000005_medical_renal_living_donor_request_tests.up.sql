CREATE TABLE IF NOT EXISTS "medical_renal_living_donor_request_tests" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "request_id" uuid NOT NULL,
    "test_code" varchar NOT NULL,
    "test_detail" varchar NOT NULL DEFAULT '',
    CONSTRAINT "fk-3b8caaab73d0b21b7e8b55dbb26c7c0a" FOREIGN KEY ("request_id") REFERENCES "medical_renal_living_donor_requests" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE medical_renal_living_donor_request_tests ALTER COLUMN id SET DEFAULT gen_random_uuid();
