CREATE TABLE IF NOT EXISTS "child_safeguarding_referral_grades" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "status" varchar NOT NULL DEFAULT '',
    "urgency" varchar NOT NULL DEFAULT '',
    "completeness_percent" integer NULL,
    "graded_at" timestamp with time zone NOT NULL,
    "child_safeguarding_referral_id" uuid NOT NULL,
    CONSTRAINT "fk-child_safeguarding_referral_grades-child_safeguarding_referral_id-to-child_safeguarding_referrals" FOREIGN KEY ("child_safeguarding_referral_id") REFERENCES "child_safeguarding_referrals" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE child_safeguarding_referral_grades ALTER COLUMN id SET DEFAULT gen_random_uuid();
