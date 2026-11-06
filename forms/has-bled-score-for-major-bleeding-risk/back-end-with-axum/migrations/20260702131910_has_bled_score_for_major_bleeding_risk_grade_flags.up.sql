CREATE TABLE IF NOT EXISTS "has_bled_score_for_major_bleeding_risk_grade_flags" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "flag_id" varchar NOT NULL,
    "category" varchar NOT NULL DEFAULT '',
    "priority" varchar NOT NULL DEFAULT '',
    "description" varchar NOT NULL DEFAULT '',
    "suggested_action" varchar NOT NULL DEFAULT '',
    "has_bled_score_for_major_bleeding_risk_grade_id" uuid NOT NULL,
    CONSTRAINT "fk-has_bled_score_for_major_bleeding_risk_grade_flags-has_bled_score_for_major_bleeding_risk_grade_id-to-has_bled_score_for_major_bleeding_risk_grades" FOREIGN KEY ("has_bled_score_for_major_bleeding_risk_grade_id") REFERENCES "has_bled_score_for_major_bleeding_risk_grades" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE has_bled_score_for_major_bleeding_risk_grade_flags ALTER COLUMN id SET DEFAULT gen_random_uuid();
