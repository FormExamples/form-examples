CREATE TABLE IF NOT EXISTS "united_kingdom_death_registration_grades" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "united_kingdom_death_registration_id" uuid NOT NULL,
    "graded_at" timestamp with time zone NOT NULL,
    CONSTRAINT "fk-united_kingdom_death_registration_grades-united_kingdom_death_registration_id-to-united_kingdom_death_registrations" FOREIGN KEY ("united_kingdom_death_registration_id") REFERENCES "united_kingdom_death_registrations" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE united_kingdom_death_registration_grades ALTER COLUMN id SET DEFAULT gen_random_uuid();
