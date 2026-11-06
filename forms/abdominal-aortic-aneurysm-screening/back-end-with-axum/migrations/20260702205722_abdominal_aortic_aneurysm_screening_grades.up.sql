CREATE TABLE IF NOT EXISTS "abdominal_aortic_aneurysm_screening_grades" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "category" varchar NOT NULL DEFAULT '',
    "surveillance_band" varchar NOT NULL DEFAULT '',
    "recommended_action" text NOT NULL DEFAULT '',
    "growth_cm" double precision NULL,
    "graded_at" timestamp with time zone NOT NULL,
    "abdominal_aortic_aneurysm_screening_id" uuid NOT NULL,
    CONSTRAINT "fk-abdominal_aortic_aneurysm_screening_grades-abdominal_aortic_aneurysm_screening_id-to-abdominal_aortic_aneurysm_screenings" FOREIGN KEY ("abdominal_aortic_aneurysm_screening_id") REFERENCES "abdominal_aortic_aneurysm_screenings" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE abdominal_aortic_aneurysm_screening_grades ALTER COLUMN id SET DEFAULT gen_random_uuid();
