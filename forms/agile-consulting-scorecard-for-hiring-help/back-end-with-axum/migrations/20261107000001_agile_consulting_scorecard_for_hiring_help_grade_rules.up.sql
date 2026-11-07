CREATE TABLE IF NOT EXISTS "agile_consulting_scorecard_for_hiring_help_grade_rules" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "agile_consulting_scorecard_grade_id" uuid NOT NULL,
    "rule_id" varchar NOT NULL DEFAULT '',
    "instrument" varchar NOT NULL DEFAULT '',
    "item_number" integer NULL,
    "grade" varchar NOT NULL DEFAULT '',
    "points_awarded" integer NOT NULL DEFAULT 0,
    "category" varchar NOT NULL DEFAULT '',
    "description" varchar NOT NULL DEFAULT '',
    CONSTRAINT "fk-agile_consulting_scorecard_for_hiring_help_grade_rules-agile_consulting_scorecard_grade_id-to-agile_consulting_scorecard_for_hiring_help_grades" FOREIGN KEY ("agile_consulting_scorecard_grade_id") REFERENCES "agile_consulting_scorecard_for_hiring_help_grades" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE agile_consulting_scorecard_for_hiring_help_grade_rules ALTER COLUMN id SET DEFAULT gen_random_uuid();
