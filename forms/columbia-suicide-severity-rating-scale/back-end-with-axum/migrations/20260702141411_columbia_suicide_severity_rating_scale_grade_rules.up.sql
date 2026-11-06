CREATE TABLE IF NOT EXISTS "columbia_suicide_severity_rating_scale_grade_rules" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "rule_id" varchar NOT NULL,
    "dimension" varchar NOT NULL,
    "tier" varchar NOT NULL DEFAULT '',
    "category" varchar NOT NULL DEFAULT '',
    "description" varchar NOT NULL DEFAULT '',
    "columbia_suicide_severity_rating_scale_grade_id" uuid NOT NULL,
    CONSTRAINT "fk-columbia_suicide_severity_rating_scale_grade_rules-columbia_suicide_severity_rating_scale_grade_id-to-columbia_suicide_severity_rating_scale_grades" FOREIGN KEY ("columbia_suicide_severity_rating_scale_grade_id") REFERENCES "columbia_suicide_severity_rating_scale_grades" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE columbia_suicide_severity_rating_scale_grade_rules ALTER COLUMN id SET DEFAULT gen_random_uuid();
