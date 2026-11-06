CREATE TABLE IF NOT EXISTS "structured_medication_review_medicines" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "drug_name" text NOT NULL DEFAULT '',
    "form_strength" text NOT NULL DEFAULT '',
    "dose_regimen" text NOT NULL DEFAULT '',
    "indication" text NOT NULL DEFAULT '',
    "indication_recorded" varchar NOT NULL DEFAULT '',
    "is_regular" varchar NOT NULL DEFAULT '',
    "is_high_risk" varchar NOT NULL DEFAULT '',
    "high_risk_class" varchar NOT NULL DEFAULT '',
    "adherence" varchar NOT NULL DEFAULT '',
    "anticholinergic_burden_points" integer NULL,
    "monitoring_required" varchar NOT NULL DEFAULT '',
    "monitoring_up_to_date" varchar NOT NULL DEFAULT '',
    "deprescribing_candidate" varchar NOT NULL DEFAULT '',
    "stopp_criterion" text NOT NULL DEFAULT '',
    "start_criterion" text NOT NULL DEFAULT '',
    "structured_medication_review_id" uuid NOT NULL,
    CONSTRAINT "fk-structured_medication_review_medicines-structured_medication_review_id-to-structured_medication_reviews" FOREIGN KEY ("structured_medication_review_id") REFERENCES "structured_medication_reviews" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE structured_medication_review_medicines ALTER COLUMN id SET DEFAULT gen_random_uuid();
