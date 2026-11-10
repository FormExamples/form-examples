CREATE TABLE IF NOT EXISTS "agile_principles_assessment_grade_flags" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "flag_id" varchar NOT NULL,
    "category" varchar NOT NULL DEFAULT '',
    "priority" varchar NOT NULL DEFAULT 'medium',
    "principle_number" integer NULL,
    "description" varchar NOT NULL DEFAULT '',
    "suggested_action" varchar NOT NULL DEFAULT '',
    "agile_principles_assessment_grade_id" uuid NOT NULL,
    CONSTRAINT "fk-agile_principles_assessment_grade_flags-agile_principles_assessment_grade_id-to-agile_principles_assessment_grades" FOREIGN KEY ("agile_principles_assessment_grade_id") REFERENCES "agile_principles_assessment_grades" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE agile_principles_assessment_grade_flags ALTER COLUMN id SET DEFAULT gen_random_uuid();
