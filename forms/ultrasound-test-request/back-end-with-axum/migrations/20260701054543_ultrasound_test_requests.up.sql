CREATE TABLE IF NOT EXISTS "ultrasound_test_requests" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "status" varchar NOT NULL DEFAULT 'draft',
    "site_name" varchar NOT NULL DEFAULT '',
    "setting" varchar NOT NULL DEFAULT '',
    "referral_date" date NULL,
    "requested_by_date" date NULL,
    "body_region" varchar NOT NULL DEFAULT '',
    "laterality" varchar NOT NULL DEFAULT '',
    "primary_indication" varchar NOT NULL DEFAULT '',
    "clinical_question" varchar NOT NULL DEFAULT '',
    "relevant_history" varchar NOT NULL DEFAULT '',
    "fasting_required" boolean NOT NULL DEFAULT false,
    "full_bladder_required" boolean NOT NULL DEFAULT false,
    "urgency" varchar NOT NULL DEFAULT 'routine',
    "supervising_consultant" varchar NOT NULL DEFAULT '',
    "requester_contact" varchar NOT NULL DEFAULT '',
    "notes" varchar NOT NULL DEFAULT '',
    "patient_id" uuid NOT NULL,
    "clinician_id" uuid NOT NULL,
    CONSTRAINT "fk-ultrasound_test_requests-patient_id-to-patients" FOREIGN KEY ("patient_id") REFERENCES "patients" (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "fk-ultrasound_test_requests-clinician_id-to-clinicians" FOREIGN KEY ("clinician_id") REFERENCES "clinicians" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE ultrasound_test_requests ALTER COLUMN id SET DEFAULT gen_random_uuid();
