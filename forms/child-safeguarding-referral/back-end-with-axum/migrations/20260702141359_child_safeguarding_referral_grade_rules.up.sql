CREATE TABLE IF NOT EXISTS "child_safeguarding_referral_grade_rules" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "rule_id" varchar NOT NULL,
    "section" varchar NOT NULL DEFAULT '',
    "category" varchar NOT NULL DEFAULT '',
    "description" varchar NOT NULL DEFAULT '',
    "child_safeguarding_referral_grade_id" uuid NOT NULL,
    CONSTRAINT "fk-child_safeguarding_referral_grade_rules-child_safeguarding_referral_grade_id-to-child_safeguarding_referral_grades" FOREIGN KEY ("child_safeguarding_referral_grade_id") REFERENCES "child_safeguarding_referral_grades" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE child_safeguarding_referral_grade_rules ALTER COLUMN id SET DEFAULT gen_random_uuid();
