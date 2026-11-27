CREATE TABLE IF NOT EXISTS "medical_renal_living_donor_request_grade_rules" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "grade_id" uuid NOT NULL,
    "rule_id" varchar NOT NULL,
    "axis" varchar NOT NULL DEFAULT '',
    "category" varchar NOT NULL DEFAULT '',
    "description" varchar NOT NULL DEFAULT '',
    CONSTRAINT "fk-28d878b8a714e2d9600f7cc66041a15a" FOREIGN KEY ("grade_id") REFERENCES "medical_renal_living_donor_request_grades" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE medical_renal_living_donor_request_grade_rules ALTER COLUMN id SET DEFAULT gen_random_uuid();
