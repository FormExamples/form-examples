CREATE TABLE IF NOT EXISTS "assessment_polypharmacy_reviews" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "total_regular_medications" integer NULL,
    "total_prn_medications" integer NULL,
    "polypharmacy_flag" varchar NOT NULL DEFAULT '',
    "medication_review_date" date NULL,
    "falls_risk_medications" varchar NOT NULL DEFAULT '',
    "falls_risk_medication_details" text NOT NULL DEFAULT '',
    "anticholinergic_burden" varchar NOT NULL DEFAULT '',
    "drug_interactions_identified" varchar NOT NULL DEFAULT '',
    "drug_interaction_details" text NOT NULL DEFAULT '',
    "adherence_concerns" varchar NOT NULL DEFAULT '',
    "adherence_details" text NOT NULL DEFAULT '',
    "stopp_start_review_done" varchar NOT NULL DEFAULT '',
    "deprescribing_opportunities" text NOT NULL DEFAULT '',
    "polypharmacy_notes" text NOT NULL DEFAULT '',
    "assessment_id" uuid NOT NULL,
    CONSTRAINT "fk-assessment_polypharmacy_reviews-assessment_id-to-assessments" FOREIGN KEY ("assessment_id") REFERENCES "assessments" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE assessment_polypharmacy_reviews ALTER COLUMN id SET DEFAULT gen_random_uuid();
