CREATE TABLE IF NOT EXISTS "medical_renal_living_donor_request_grade_flags" (
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
    CONSTRAINT "fk-28e7922f1b57c159bfa4d4d3e18ea4e7" FOREIGN KEY ("grade_id") REFERENCES "medical_renal_living_donor_request_grades" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE medical_renal_living_donor_request_grade_flags ALTER COLUMN id SET DEFAULT gen_random_uuid();
