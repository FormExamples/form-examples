CREATE TABLE IF NOT EXISTS "united_kingdom_divorce_application_grades" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "united_kingdom_divorce_application_id" uuid NOT NULL UNIQUE,
    "application_class" varchar NOT NULL DEFAULT '',
    "earliest_eligible_date" date NULL,
    "jurisdiction_met" varchar NOT NULL DEFAULT '',
    "graded_at" timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "fk-c836b15bee662ea10bd0d95294ac8aed" FOREIGN KEY ("united_kingdom_divorce_application_id") REFERENCES "united_kingdom_divorce_applications" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE united_kingdom_divorce_application_grades ALTER COLUMN id SET DEFAULT gen_random_uuid();
