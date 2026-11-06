CREATE TABLE IF NOT EXISTS "pre_anaesthesia_assessment_grades" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "computed_asa_grade" varchar NOT NULL DEFAULT '',
    "final_asa_grade" varchar NOT NULL DEFAULT '',
    "asa_emergency_suffix" varchar NOT NULL DEFAULT '',
    "override_reason" varchar NOT NULL DEFAULT '',
    "mallampati_class" varchar NOT NULL DEFAULT '',
    "rcri_score" integer NULL,
    "stopbang_score" integer NULL,
    "frailty_scale" integer NULL,
    "composite_risk" varchar NOT NULL DEFAULT '',
    "recommendation" varchar NOT NULL DEFAULT '',
    "clinician_notes" text NOT NULL DEFAULT '',
    "signed_at" timestamp with time zone NULL,
    "graded_at" timestamp with time zone NOT NULL,
    "pre_anaesthesia_assessment_id" uuid NOT NULL,
    CONSTRAINT "fk-pre_anaesthesia_assessment_grades-pre_anaesthesia_assessment_id-to-pre_anaesthesia_assessments" FOREIGN KEY ("pre_anaesthesia_assessment_id") REFERENCES "pre_anaesthesia_assessments" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE pre_anaesthesia_assessment_grades ALTER COLUMN id SET DEFAULT gen_random_uuid();
