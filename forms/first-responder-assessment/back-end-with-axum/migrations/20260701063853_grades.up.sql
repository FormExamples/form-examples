CREATE TABLE IF NOT EXISTS "grades" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "physical_fitness_level" varchar NOT NULL DEFAULT '',
    "clinical_skills_level" varchar NOT NULL DEFAULT '',
    "equipment_vehicle_level" varchar NOT NULL DEFAULT '',
    "communication_level" varchar NOT NULL DEFAULT '',
    "psychological_level" varchar NOT NULL DEFAULT '',
    "overall_competency" varchar NOT NULL DEFAULT '',
    "overall_fitness" varchar NOT NULL DEFAULT '',
    "graded_at" timestamp with time zone NOT NULL,
    "assessment_id" uuid NOT NULL,
    CONSTRAINT "fk-grades-assessment_id-to-assessments" FOREIGN KEY ("assessment_id") REFERENCES "assessments" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE grades ALTER COLUMN id SET DEFAULT gen_random_uuid();
