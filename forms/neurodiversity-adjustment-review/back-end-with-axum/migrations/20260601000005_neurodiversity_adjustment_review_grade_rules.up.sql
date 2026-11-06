CREATE TABLE IF NOT EXISTS "neurodiversity_adjustment_review_grade_rules" (
    "id" uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    "created_at" timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" timestamp with time zone NULL,
    "neurodiversity_adjustment_review_grade_id" uuid NOT NULL,
    "rule_id" varchar NOT NULL,
    "axis" varchar NOT NULL,
    "category" varchar NOT NULL,
    "description" varchar NOT NULL,
    CONSTRAINT "fk_neurodiversity_adjustment_review_grade_rules_grade_id" FOREIGN KEY ("neurodiversity_adjustment_review_grade_id") REFERENCES "neurodiversity_adjustment_review_grades" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "index_neurodiversity_adjustment_review_grade_rule_grade_id" ON "neurodiversity_adjustment_review_grade_rules" ("neurodiversity_adjustment_review_grade_id");
