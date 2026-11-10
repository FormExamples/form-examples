CREATE TABLE IF NOT EXISTS "agile_principles_assessment_grade_rules" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "rule_id" varchar NOT NULL,
    "principle_number" integer NOT NULL,
    "band" varchar NOT NULL DEFAULT '',
    "principle_slug" varchar NOT NULL DEFAULT '',
    "description" varchar NOT NULL DEFAULT '',
    "agile_principles_assessment_grade_id" uuid NOT NULL,
    CONSTRAINT "fk-agile_principles_assessment_grade_rules-agile_principles_assessment_grade_id-to-agile_principles_assessment_grades" FOREIGN KEY ("agile_principles_assessment_grade_id") REFERENCES "agile_principles_assessment_grades" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE agile_principles_assessment_grade_rules ALTER COLUMN id SET DEFAULT gen_random_uuid();
