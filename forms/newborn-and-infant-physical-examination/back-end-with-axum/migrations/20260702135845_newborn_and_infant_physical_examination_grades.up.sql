CREATE TABLE IF NOT EXISTS "newborn_and_infant_physical_examination_grades" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "eyes_result" varchar NOT NULL DEFAULT '',
    "heart_result" varchar NOT NULL DEFAULT '',
    "hips_result" varchar NOT NULL DEFAULT '',
    "testes_result" varchar NOT NULL DEFAULT '',
    "overall_outcome" varchar NOT NULL DEFAULT '',
    "completeness" varchar NOT NULL DEFAULT '',
    "completeness_percent" integer NULL,
    "graded_at" timestamp with time zone NOT NULL,
    "newborn_and_infant_physical_examination_id" uuid NOT NULL,
    CONSTRAINT "fk-newborn_and_infant_physical_examination_grades-newborn_and_infant_physical_examination_id-to-newborn_and_infant_physical_examinations" FOREIGN KEY ("newborn_and_infant_physical_examination_id") REFERENCES "newborn_and_infant_physical_examinations" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE newborn_and_infant_physical_examination_grades ALTER COLUMN id SET DEFAULT gen_random_uuid();
