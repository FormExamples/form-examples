CREATE TABLE IF NOT EXISTS "general_practitioner_referral_letter_grades" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "status" varchar NOT NULL DEFAULT '',
    "urgency" varchar NOT NULL DEFAULT '',
    "completeness_percent" integer NULL,
    "graded_at" timestamp with time zone NOT NULL,
    "general_practitioner_referral_letter_id" uuid NOT NULL,
    CONSTRAINT "fk-general_practitioner_referral_letter_grades-general_practitioner_referral_letter_id-to-general_practitioner_referral_letters" FOREIGN KEY ("general_practitioner_referral_letter_id") REFERENCES "general_practitioner_referral_letters" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE general_practitioner_referral_letter_grades ALTER COLUMN id SET DEFAULT gen_random_uuid();
