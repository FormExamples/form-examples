CREATE TABLE IF NOT EXISTS "breast_screening_grades" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "eligibility_status" varchar NOT NULL DEFAULT '',
    "result_class" varchar NOT NULL DEFAULT '',
    "management_action" varchar NOT NULL DEFAULT '',
    "status" varchar NOT NULL DEFAULT '',
    "graded_at" timestamp with time zone NOT NULL,
    "breast_screening_id" uuid NOT NULL,
    CONSTRAINT "fk-breast_screening_grades-breast_screening_id-to-breast_screenings" FOREIGN KEY ("breast_screening_id") REFERENCES "breast_screenings" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE breast_screening_grades ALTER COLUMN id SET DEFAULT gen_random_uuid();
