CREATE TABLE IF NOT EXISTS "medical_human_leukocyte_and_disease_association_request_grade_flags" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "grade_id" uuid NOT NULL,
    "flag_id" varchar NOT NULL,
    "category" varchar NOT NULL DEFAULT '',
    "priority" varchar NOT NULL DEFAULT '',
    "description" varchar NOT NULL DEFAULT '',
    "suggested_action" varchar NOT NULL DEFAULT '',
    CONSTRAINT "fk-679af147edb6a46930721da991fada97" FOREIGN KEY ("grade_id") REFERENCES "medical_human_leukocyte_and_disease_association_request_grades" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE medical_human_leukocyte_and_disease_association_request_grade_flags ALTER COLUMN id SET DEFAULT gen_random_uuid();
