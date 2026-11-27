CREATE TABLE IF NOT EXISTS "medical_human_leukocyte_and_disease_association_request_grade_rules" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "grade_id" uuid NOT NULL,
    "rule_id" varchar NOT NULL,
    "axis" varchar NOT NULL DEFAULT '',
    "category" varchar NOT NULL DEFAULT '',
    "description" varchar NOT NULL DEFAULT '',
    CONSTRAINT "fk-1553d64cd4548a299725f90ed3bb2823" FOREIGN KEY ("grade_id") REFERENCES "medical_human_leukocyte_and_disease_association_request_grades" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE medical_human_leukocyte_and_disease_association_request_grade_rules ALTER COLUMN id SET DEFAULT gen_random_uuid();
