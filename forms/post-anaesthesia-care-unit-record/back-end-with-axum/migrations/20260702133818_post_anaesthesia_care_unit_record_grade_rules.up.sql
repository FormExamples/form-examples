CREATE TABLE IF NOT EXISTS "post_anaesthesia_care_unit_record_grade_rules" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "rule_id" varchar NOT NULL,
    "parameter" varchar NOT NULL,
    "points" integer NULL,
    "category" varchar NOT NULL DEFAULT '',
    "description" varchar NOT NULL DEFAULT '',
    "post_anaesthesia_care_unit_record_grade_id" uuid NOT NULL,
    CONSTRAINT "fk-post_anaesthesia_care_unit_record_grade_rules-post_anaesthesia_care_unit_record_grade_id-to-post_anaesthesia_care_unit_record_grades" FOREIGN KEY ("post_anaesthesia_care_unit_record_grade_id") REFERENCES "post_anaesthesia_care_unit_record_grades" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE post_anaesthesia_care_unit_record_grade_rules ALTER COLUMN id SET DEFAULT gen_random_uuid();
