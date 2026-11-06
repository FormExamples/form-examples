CREATE TABLE IF NOT EXISTS "cervical_screening_grades" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "result_class" varchar NOT NULL DEFAULT '',
    "management_action" varchar NOT NULL DEFAULT '',
    "status" varchar NOT NULL DEFAULT '',
    "graded_at" timestamp with time zone NOT NULL,
    "cervical_screening_id" uuid NOT NULL,
    CONSTRAINT "fk-cervical_screening_grades-cervical_screening_id-to-cervical_screenings" FOREIGN KEY ("cervical_screening_id") REFERENCES "cervical_screenings" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE cervical_screening_grades ALTER COLUMN id SET DEFAULT gen_random_uuid();
