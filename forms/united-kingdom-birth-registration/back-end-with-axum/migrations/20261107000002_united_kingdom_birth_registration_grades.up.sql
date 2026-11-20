CREATE TABLE IF NOT EXISTS "united_kingdom_birth_registration_grades" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "united_kingdom_birth_registration_id" uuid NOT NULL UNIQUE,
    "readiness_class" varchar NOT NULL DEFAULT '',
    "days_since_birth" integer NULL,
    "late_registration" varchar NOT NULL DEFAULT '',
    "missing_item_count" integer NULL,
    "graded_at" timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "fk-56fa59b675c1f287c6e533895b27e895" FOREIGN KEY ("united_kingdom_birth_registration_id") REFERENCES "united_kingdom_birth_registrations" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE united_kingdom_birth_registration_grades ALTER COLUMN id SET DEFAULT gen_random_uuid();
