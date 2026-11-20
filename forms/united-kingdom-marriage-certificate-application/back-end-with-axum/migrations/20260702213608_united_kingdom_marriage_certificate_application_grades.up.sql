CREATE TABLE IF NOT EXISTS "united_kingdom_marriage_certificate_application_grades" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "validity_class" varchar NOT NULL DEFAULT '',
    "earliest_ceremony_date" date NULL,
    "latest_ceremony_date" date NULL,
    "immigration_referral_indicated" varchar NOT NULL DEFAULT '',
    "graded_at" timestamp with time zone NOT NULL,
    "united_kingdom_marriage_certificate_application_id" uuid NOT NULL,
    CONSTRAINT "fk-3fba4bd0f432ec2a6749f737a4eaab0e" FOREIGN KEY ("united_kingdom_marriage_certificate_application_id") REFERENCES "united_kingdom_marriage_certificate_applications" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE united_kingdom_marriage_certificate_application_grades ALTER COLUMN id SET DEFAULT gen_random_uuid();
