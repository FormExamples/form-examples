CREATE TABLE IF NOT EXISTS "edinburgh_postnatal_depression_scale_grade_rules" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "rule_id" varchar NOT NULL,
    "parameter" varchar NOT NULL,
    "points" integer NULL,
    "category" varchar NOT NULL DEFAULT '',
    "description" varchar NOT NULL DEFAULT '',
    "edinburgh_postnatal_depression_scale_grade_id" uuid NOT NULL,
    CONSTRAINT "fk-edinburgh_postnatal_depression_scale_grade_rules-edinburgh_postnatal_depression_scale_grade_id-to-edinburgh_postnatal_depression_scale_grades" FOREIGN KEY ("edinburgh_postnatal_depression_scale_grade_id") REFERENCES "edinburgh_postnatal_depression_scale_grades" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE edinburgh_postnatal_depression_scale_grade_rules ALTER COLUMN id SET DEFAULT gen_random_uuid();
