CREATE TABLE IF NOT EXISTS "newborn_blood_spot_screening_grades" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "overall_outcome" varchar NOT NULL DEFAULT '',
    "referral_status" varchar NOT NULL DEFAULT '',
    "sample_adequate" boolean NULL,
    "within_window" boolean NULL,
    "avoidable_repeat" boolean NULL,
    "graded_at" timestamp with time zone NOT NULL,
    "newborn_blood_spot_screening_id" uuid NOT NULL,
    CONSTRAINT "fk-newborn_blood_spot_screening_grades-newborn_blood_spot_screening_id-to-newborn_blood_spot_screenings" FOREIGN KEY ("newborn_blood_spot_screening_id") REFERENCES "newborn_blood_spot_screenings" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE newborn_blood_spot_screening_grades ALTER COLUMN id SET DEFAULT gen_random_uuid();
