CREATE TABLE IF NOT EXISTS "expense_reimbursement_grade_rules" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "rule_id" varchar NOT NULL,
    "axis" varchar NOT NULL DEFAULT '',
    "category" varchar NOT NULL DEFAULT '',
    "description" varchar NOT NULL DEFAULT '',
    "expense_reimbursement_grade_id" uuid NOT NULL,
    CONSTRAINT "fk-expense_reimbursement_grade_rules-expense_reimbursement_grade_id-to-expense_reimbursement_grades" FOREIGN KEY ("expense_reimbursement_grade_id") REFERENCES "expense_reimbursement_grades" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE expense_reimbursement_grade_rules ALTER COLUMN id SET DEFAULT gen_random_uuid();
