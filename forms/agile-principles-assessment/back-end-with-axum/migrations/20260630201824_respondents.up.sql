CREATE TABLE IF NOT EXISTS "respondents" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "full_name" varchar NOT NULL DEFAULT '',
    "email" varchar NOT NULL DEFAULT '',
    "role" varchar NOT NULL DEFAULT '',
    "team_name" varchar NOT NULL DEFAULT '',
    "organisation_name" varchar NOT NULL DEFAULT '',
    "years_in_agile" integer NULL
);

ALTER TABLE respondents ALTER COLUMN id SET DEFAULT gen_random_uuid();
