CREATE TABLE IF NOT EXISTS "fluid_balance_chart_grade_rules" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "rule_id" varchar NOT NULL,
    "category" varchar NOT NULL DEFAULT '',
    "description" varchar NOT NULL DEFAULT '',
    "fluid_balance_chart_grade_id" uuid NOT NULL,
    CONSTRAINT "fk-fluid_balance_chart_grade_rules-fluid_balance_chart_grade_id-to-fluid_balance_chart_grades" FOREIGN KEY ("fluid_balance_chart_grade_id") REFERENCES "fluid_balance_chart_grades" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE fluid_balance_chart_grade_rules ALTER COLUMN id SET DEFAULT gen_random_uuid();
