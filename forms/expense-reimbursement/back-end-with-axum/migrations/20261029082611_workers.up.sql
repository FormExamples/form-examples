CREATE TABLE IF NOT EXISTS "workers" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "name" varchar NOT NULL,
    "email" text NULL,
    "phone" text NULL,
    "postal_address_as_full_text" text NULL,
    "country_as_iso_3166_1_alpha_2" varchar NULL,
    "postcode" text NULL,
    "employee_reference" varchar NULL,
    "job_title" varchar NOT NULL DEFAULT '',
    "department" varchar NOT NULL DEFAULT '',
    "cost_centre" varchar NOT NULL DEFAULT ''
);

ALTER TABLE workers ALTER COLUMN id SET DEFAULT gen_random_uuid();
