CREATE TABLE IF NOT EXISTS "assessment_surgical_histories" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "assessment_id" uuid NOT NULL UNIQUE,
    "has_previous_surgery" varchar NOT NULL DEFAULT '',
    "surgery_considered" varchar NOT NULL DEFAULT '',
    "surgery_considered_details" text NOT NULL DEFAULT '',
    "patient_preference" varchar NOT NULL DEFAULT '',
    "comorbidities_affecting_surgery" text NOT NULL DEFAULT '',
    "anaesthetic_risk" varchar NOT NULL DEFAULT '',
    "anticoagulant_use" varchar NOT NULL DEFAULT '',
    "anticoagulant_details" text NOT NULL DEFAULT '',
    "surgical_history_notes" text NOT NULL DEFAULT '',
    CONSTRAINT "fk-assessment_surgical_histories-assessment_id-to-assessments" FOREIGN KEY ("assessment_id") REFERENCES "assessments" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE assessment_surgical_histories ALTER COLUMN id SET DEFAULT gen_random_uuid();
