CREATE TABLE IF NOT EXISTS "assessments" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "status" varchar NOT NULL DEFAULT 'draft',
    "employee_id" uuid NOT NULL,
    CONSTRAINT "fk-assessments-employee_id-to-employees" FOREIGN KEY ("employee_id") REFERENCES "employees" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE assessments ALTER COLUMN id SET DEFAULT gen_random_uuid();
