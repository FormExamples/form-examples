CREATE TABLE IF NOT EXISTS "audit_c_grade_rules" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "rule_id" varchar NOT NULL,
    "item" varchar NOT NULL,
    "points" integer NULL,
    "category" varchar NOT NULL DEFAULT '',
    "description" varchar NOT NULL DEFAULT '',
    "audit_c_grade_id" uuid NOT NULL,
    CONSTRAINT "fk-audit_c_grade_rules-audit_c_grade_id-to-audit_c_grades" FOREIGN KEY ("audit_c_grade_id") REFERENCES "audit_c_grades" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE audit_c_grade_rules ALTER COLUMN id SET DEFAULT gen_random_uuid();
