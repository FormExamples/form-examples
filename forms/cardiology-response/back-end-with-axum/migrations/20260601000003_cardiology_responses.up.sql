CREATE TABLE IF NOT EXISTS "cardiology_responses" (
    "id" uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    "created_at" timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" timestamp with time zone NULL,
    "patient_id" uuid NOT NULL,
    "clinician_id" uuid NOT NULL,
    "originating_request_reference" varchar NOT NULL,
    "response_status" varchar NOT NULL,
    "consultation_type" varchar NOT NULL,
    "assessed_date" date NULL,
    "responded_date" date NULL,
    "clinical_summary" varchar NOT NULL,
    "examination_findings" varchar NOT NULL,
    "investigations_performed" varchar NOT NULL,
    "ischaemia_or_cad" boolean NOT NULL,
    "significant_arrhythmia" boolean NOT NULL,
    "reduced_ejection_fraction" boolean NOT NULL,
    "significant_valve_disease" boolean NOT NULL,
    "structural_abnormality" boolean NOT NULL,
    "uncontrolled_hypertension" boolean NOT NULL,
    "non_cardiac_cause" boolean NOT NULL,
    "primary_diagnosis_category" varchar NOT NULL,
    "diagnosis_narrative" varchar NOT NULL,
    "lv_ejection_fraction_percent" double precision NULL,
    "management_plan" varchar NOT NULL,
    "medication_changes" varchar NOT NULL,
    "recommended_follow_up" varchar NOT NULL,
    "critical_result" boolean NOT NULL,
    "critical_result_communicated" boolean NOT NULL,
    "reported_to" varchar NOT NULL,
    CONSTRAINT "fk_cardiology_responses_patient_id" FOREIGN KEY ("patient_id") REFERENCES "patients" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "fk_cardiology_responses_clinician_id" FOREIGN KEY ("clinician_id") REFERENCES "clinicians" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "index_cardiology_response_patient_id" ON "cardiology_responses" ("patient_id");

CREATE INDEX IF NOT EXISTS "index_cardiology_response_clinician_id" ON "cardiology_responses" ("clinician_id");
