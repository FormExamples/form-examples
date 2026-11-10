CREATE TABLE IF NOT EXISTS "has_bled_score_for_major_bleeding_risk_grade_rules" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "rule_id" varchar NOT NULL,
    "criterion" varchar NOT NULL,
    "points" integer NULL,
    "category" varchar NOT NULL DEFAULT '',
    "description" varchar NOT NULL DEFAULT '',
    "has_bled_score_for_major_bleeding_risk_grade_id" uuid NOT NULL,
    CONSTRAINT "fk-has_bled_score_for_major_bleeding_risk_grade_rules-has_bled_score_for_major_bleeding_risk_grade_id-to-has_bled_score_for_major_bleeding_risk_grades" FOREIGN KEY ("has_bled_score_for_major_bleeding_risk_grade_id") REFERENCES "has_bled_score_for_major_bleeding_risk_grades" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE has_bled_score_for_major_bleeding_risk_grade_rules ALTER COLUMN id SET DEFAULT gen_random_uuid();
