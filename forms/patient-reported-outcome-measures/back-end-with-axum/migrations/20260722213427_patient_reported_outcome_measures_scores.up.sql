CREATE TABLE IF NOT EXISTS "patient_reported_outcome_measures_scores" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "sf36_pf" double precision NULL,
    "sf36_rp" double precision NULL,
    "sf36_bp" double precision NULL,
    "sf36_gh" double precision NULL,
    "sf36_vt" double precision NULL,
    "sf36_sf" double precision NULL,
    "sf36_re" double precision NULL,
    "sf36_mh" double precision NULL,
    "sf36_pcs_approx" double precision NULL,
    "sf36_mcs_approx" double precision NULL,
    "ndi_raw_score" integer NULL,
    "ndi_answered_sections" integer NULL,
    "ndi_percentage_score" double precision NULL,
    "ndi_band" varchar NOT NULL DEFAULT '',
    "mjoa_total_score" integer NULL,
    "mjoa_band" varchar NOT NULL DEFAULT '',
    "eq5d_health_state_descriptor" varchar NOT NULL DEFAULT '',
    "eq5d_uk_index_value" double precision NULL,
    "eq5d_vas_score" double precision NULL,
    "patient_reported_outcome_measures_id" uuid NOT NULL,
    CONSTRAINT "fk-patient_reported_outcome_measures_scores-patient_reported_outcome_measures_id-to-patient_reported_outcome_measures" FOREIGN KEY ("patient_reported_outcome_measures_id") REFERENCES "patient_reported_outcome_measures" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE patient_reported_outcome_measures_scores ALTER COLUMN id SET DEFAULT gen_random_uuid();

CREATE UNIQUE INDEX "idx-patient_reported_outcome_measures_scores-patient_reported_outcome_measures_id" ON "patient_reported_outcome_measures_scores" ("patient_reported_outcome_measures_id");
