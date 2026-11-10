CREATE TABLE IF NOT EXISTS "bhutani_bilirubin_nomogram_grade_rules" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "rule_id" varchar NOT NULL,
    "category" varchar NOT NULL DEFAULT '',
    "description" varchar NOT NULL DEFAULT '',
    "bhutani_bilirubin_nomogram_grade_id" uuid NOT NULL,
    CONSTRAINT "fk-bhutani_bilirubin_nomogram_grade_rules-bhutani_bilirubin_nomogram_grade_id-to-bhutani_bilirubin_nomogram_grades" FOREIGN KEY ("bhutani_bilirubin_nomogram_grade_id") REFERENCES "bhutani_bilirubin_nomogram_grades" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE bhutani_bilirubin_nomogram_grade_rules ALTER COLUMN id SET DEFAULT gen_random_uuid();
