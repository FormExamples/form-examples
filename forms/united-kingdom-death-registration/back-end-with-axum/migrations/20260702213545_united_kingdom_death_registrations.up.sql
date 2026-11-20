CREATE TABLE IF NOT EXISTS "united_kingdom_death_registrations" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "patient_id" uuid NOT NULL,
    "informant_id" uuid NULL,
    CONSTRAINT "fk-united_kingdom_death_registrations-patient_id-to-patients" FOREIGN KEY ("patient_id") REFERENCES "patients" (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "fk-united_kingdom_death_registrations-informant_id-to-informants" FOREIGN KEY ("informant_id") REFERENCES "informants" (id) ON DELETE SET NULL ON UPDATE NO ACTION
);

ALTER TABLE united_kingdom_death_registrations ALTER COLUMN id SET DEFAULT gen_random_uuid();
