CREATE TABLE IF NOT EXISTS "glasgow_coma_scale_grade_rules" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "rule_id" varchar NOT NULL,
    "component" varchar NOT NULL,
    "points" integer NULL,
    "category" varchar NOT NULL DEFAULT '',
    "description" varchar NOT NULL DEFAULT '',
    "glasgow_coma_scale_grade_id" uuid NOT NULL,
    CONSTRAINT "fk-glasgow_coma_scale_grade_rules-glasgow_coma_scale_grade_id-to-glasgow_coma_scale_grades" FOREIGN KEY ("glasgow_coma_scale_grade_id") REFERENCES "glasgow_coma_scale_grades" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE glasgow_coma_scale_grade_rules ALTER COLUMN id SET DEFAULT gen_random_uuid();
