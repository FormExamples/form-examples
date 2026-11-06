CREATE TABLE IF NOT EXISTS "parkland_formula_for_burns_grade_rules" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "rule_id" varchar NOT NULL,
    "instrument" varchar NOT NULL,
    "category" varchar NOT NULL DEFAULT '',
    "description" varchar NOT NULL DEFAULT '',
    "parkland_formula_for_burns_grade_id" uuid NOT NULL,
    CONSTRAINT "fk-parkland_formula_for_burns_grade_rules-parkland_formula_for_burns_grade_id-to-parkland_formula_for_burns_grades" FOREIGN KEY ("parkland_formula_for_burns_grade_id") REFERENCES "parkland_formula_for_burns_grades" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE parkland_formula_for_burns_grade_rules ALTER COLUMN id SET DEFAULT gen_random_uuid();
