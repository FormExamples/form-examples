CREATE TABLE IF NOT EXISTS "grades" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "priority_level" varchar NOT NULL DEFAULT 'routine',
    "rule_count" integer NOT NULL DEFAULT 0,
    "graded_at" timestamp with time zone NOT NULL,
    "prescription_request_id" uuid NOT NULL,
    CONSTRAINT "fk-grades-prescription_request_id-to-prescription_requests" FOREIGN KEY ("prescription_request_id") REFERENCES "prescription_requests" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE grades ALTER COLUMN id SET DEFAULT gen_random_uuid();
