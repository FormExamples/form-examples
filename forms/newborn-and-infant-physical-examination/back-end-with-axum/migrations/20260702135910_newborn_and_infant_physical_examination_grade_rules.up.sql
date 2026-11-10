CREATE TABLE IF NOT EXISTS "newborn_and_infant_physical_examination_grade_rules" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "rule_id" varchar NOT NULL,
    "component" varchar NOT NULL DEFAULT '',
    "category" varchar NOT NULL DEFAULT '',
    "description" varchar NOT NULL DEFAULT '',
    "newborn_and_infant_physical_examination_grade_id" uuid NOT NULL,
    CONSTRAINT "fk-newborn_and_infant_physical_examination_grade_rules-newborn_and_infant_physical_examination_grade_id-to-newborn_and_infant_physical_examination_grades" FOREIGN KEY ("newborn_and_infant_physical_examination_grade_id") REFERENCES "newborn_and_infant_physical_examination_grades" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE newborn_and_infant_physical_examination_grade_rules ALTER COLUMN id SET DEFAULT gen_random_uuid();
