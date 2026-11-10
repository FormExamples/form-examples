CREATE TABLE IF NOT EXISTS "physical_activity_diets" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "assessment_id" uuid NOT NULL UNIQUE,
    "physical_activity_minutes_per_week" integer NULL,
    "activity_intensity" varchar NOT NULL DEFAULT '',
    "fruit_veg_portions_per_day" integer NULL,
    "diet_quality" varchar NOT NULL DEFAULT '',
    "salt_intake" varchar NOT NULL DEFAULT '',
    CONSTRAINT "fk-physical_activity_diets-assessment_id-to-assessments" FOREIGN KEY ("assessment_id") REFERENCES "assessments" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE physical_activity_diets ALTER COLUMN id SET DEFAULT gen_random_uuid();
