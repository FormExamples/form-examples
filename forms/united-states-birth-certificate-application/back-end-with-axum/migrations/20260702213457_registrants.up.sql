CREATE TABLE IF NOT EXISTS "registrants" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "name" text NOT NULL,
    "birth_date" date NULL,
    "sex" varchar NOT NULL DEFAULT '',
    "place_of_birth" text NOT NULL DEFAULT '',
    "county_of_birth" text NOT NULL DEFAULT '',
    "birth_state" varchar NULL,
    "birth_facility" text NOT NULL DEFAULT '',
    "mother_name_before_first_marriage" text NOT NULL DEFAULT '',
    "father_name" text NOT NULL DEFAULT '',
    "is_deceased" varchar NOT NULL DEFAULT '',
    "is_adopted" varchar NOT NULL DEFAULT ''
);

ALTER TABLE registrants ALTER COLUMN id SET DEFAULT gen_random_uuid();
