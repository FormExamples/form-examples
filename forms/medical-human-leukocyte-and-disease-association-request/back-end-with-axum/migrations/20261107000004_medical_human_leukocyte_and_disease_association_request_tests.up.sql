CREATE TABLE IF NOT EXISTS "medical_human_leukocyte_and_disease_association_request_tests" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "request_id" uuid NOT NULL,
    "test_code" varchar NOT NULL,
    "test_detail" varchar NOT NULL DEFAULT '',
    CONSTRAINT "fk-1530ee8923effcbf73d86e497b19e4bf" FOREIGN KEY ("request_id") REFERENCES "medical_human_leukocyte_and_disease_association_requests" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE medical_human_leukocyte_and_disease_association_request_tests ALTER COLUMN id SET DEFAULT gen_random_uuid();
