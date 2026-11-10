CREATE TABLE IF NOT EXISTS "parkland_formula_for_burns" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "clinician_name" varchar NOT NULL DEFAULT '',
    "clinician_role" varchar NOT NULL DEFAULT '',
    "care_setting" varchar NOT NULL DEFAULT '',
    "assessed_at" timestamp with time zone NULL,
    "patient_identifier" varchar NOT NULL DEFAULT '',
    "age_band" varchar NOT NULL DEFAULT '',
    "sex" varchar NOT NULL DEFAULT '',
    "weight_kg" double precision NULL,
    "tbsa_percent" double precision NULL,
    "tbsa_method" varchar NOT NULL DEFAULT '',
    "injury_at" timestamp with time zone NULL,
    "injury_time_known" varchar NOT NULL DEFAULT '',
    "inhalation_suspected" varchar NOT NULL DEFAULT '',
    "circumferential_or_deep" varchar NOT NULL DEFAULT '',
    "mechanism" varchar NOT NULL DEFAULT '',
    "patient_id" uuid NOT NULL,
    "clinician_id" uuid NULL,
    CONSTRAINT "fk-parkland_formula_for_burns-patient_id-to-patients" FOREIGN KEY ("patient_id") REFERENCES "patients" (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "fk-parkland_formula_for_burns-clinician_id-to-clinicians" FOREIGN KEY ("clinician_id") REFERENCES "clinicians" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE parkland_formula_for_burns ALTER COLUMN id SET DEFAULT gen_random_uuid();
