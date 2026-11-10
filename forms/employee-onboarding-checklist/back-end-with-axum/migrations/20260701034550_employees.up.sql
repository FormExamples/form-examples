CREATE TABLE IF NOT EXISTS "employees" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "first_name" varchar NOT NULL,
    "last_name" varchar NOT NULL,
    "date_of_birth" date NOT NULL,
    "nhs_number" varchar NULL,
    "email" varchar NOT NULL DEFAULT '',
    "phone" varchar NOT NULL DEFAULT '',
    "job_title" varchar NOT NULL DEFAULT '',
    "department" varchar NOT NULL DEFAULT '',
    "start_date" date NULL
);

ALTER TABLE employees ALTER COLUMN id SET DEFAULT gen_random_uuid();

CREATE UNIQUE INDEX IF NOT EXISTS "index_employees_nhs_number_unique" ON "employees" ("nhs_number");
