CREATE TABLE IF NOT EXISTS "workers" (
    "id" uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    "created_at" timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" timestamp with time zone NULL,
    "name" varchar NOT NULL,
    "email" text NULL,
    "phone" text NULL,
    "postal_address_as_full_text" text NULL,
    "country_as_iso_3166_1_alpha_2" varchar NULL,
    "postcode" text NULL,
    "employee_reference" varchar NULL UNIQUE,
    "job_title" varchar NOT NULL DEFAULT '',
    "department" varchar NOT NULL DEFAULT '',
    "employment_type" varchar NOT NULL DEFAULT '',
    "work_pattern" varchar NOT NULL DEFAULT '',
    "work_location" varchar NOT NULL DEFAULT '',
    "employment_start_date" date NULL
);
