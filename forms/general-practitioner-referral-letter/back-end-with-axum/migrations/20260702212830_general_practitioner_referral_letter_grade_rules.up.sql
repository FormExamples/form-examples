CREATE TABLE IF NOT EXISTS "general_practitioner_referral_letter_grade_rules" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "rule_id" varchar NOT NULL,
    "category" varchar NOT NULL DEFAULT '',
    "description" varchar NOT NULL DEFAULT '',
    "general_practitioner_referral_letter_grade_id" uuid NOT NULL,
    CONSTRAINT "fk-general_practitioner_referral_letter_grade_rules-general_practitioner_referral_letter_grade_id-to-general_practitioner_referral_letter_grades" FOREIGN KEY ("general_practitioner_referral_letter_grade_id") REFERENCES "general_practitioner_referral_letter_grades" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE general_practitioner_referral_letter_grade_rules ALTER COLUMN id SET DEFAULT gen_random_uuid();
