CREATE TABLE IF NOT EXISTS "travel_vaccinations" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "travel_planned" varchar NOT NULL DEFAULT '',
    "travel_destination" varchar NOT NULL DEFAULT '',
    "hepatitis_a" integer NULL,
    "hepatitis_b" integer NULL,
    "typhoid" integer NULL,
    "yellow_fever" integer NULL,
    "rabies" integer NULL,
    "japanese_encephalitis" integer NULL,
    "assessment_id" uuid NOT NULL,
    CONSTRAINT "fk-travel_vaccinations-assessment_id-to-assessments" FOREIGN KEY ("assessment_id") REFERENCES "assessments" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE travel_vaccinations ALTER COLUMN id SET DEFAULT gen_random_uuid();
