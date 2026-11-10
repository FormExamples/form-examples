CREATE TABLE IF NOT EXISTS "partogram_observations" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "observed_at" timestamp with time zone NULL,
    "cervical_dilatation_cm" double precision NULL,
    "descent_fifths" double precision NULL,
    "contractions_per_10_min" double precision NULL,
    "contraction_duration_band" varchar NOT NULL DEFAULT '',
    "contraction_strength" varchar NOT NULL DEFAULT '',
    "fetal_heart_rate" integer NULL,
    "liquor_state" varchar NOT NULL DEFAULT '',
    "moulding" varchar NOT NULL DEFAULT '',
    "systolic_blood_pressure" integer NULL,
    "diastolic_blood_pressure" integer NULL,
    "pulse" integer NULL,
    "temperature" double precision NULL,
    "urine_volume_ml" double precision NULL,
    "urine_protein" varchar NOT NULL DEFAULT '',
    "urine_ketones" varchar NOT NULL DEFAULT '',
    "urine_glucose" varchar NOT NULL DEFAULT '',
    "oxytocin_rate" double precision NULL,
    "drugs_and_fluids" text NOT NULL DEFAULT '',
    "partogram_id" uuid NOT NULL,
    CONSTRAINT "fk-partogram_observations-partogram_id-to-partograms" FOREIGN KEY ("partogram_id") REFERENCES "partograms" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE partogram_observations ALTER COLUMN id SET DEFAULT gen_random_uuid();
