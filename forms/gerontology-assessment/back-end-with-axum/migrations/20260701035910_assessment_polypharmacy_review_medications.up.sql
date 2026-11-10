CREATE TABLE IF NOT EXISTS "assessment_polypharmacy_review_medications" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "medication_name" varchar NOT NULL DEFAULT '',
    "dose" varchar NOT NULL DEFAULT '',
    "frequency" varchar NOT NULL DEFAULT '',
    "route" varchar NOT NULL DEFAULT '',
    "indication" varchar NOT NULL DEFAULT '',
    "is_prn" varchar NOT NULL DEFAULT '',
    "sort_order" integer NOT NULL DEFAULT 0,
    "assessment_polypharmacy_review_id" uuid NOT NULL,
    CONSTRAINT "fk-assessment_polypharmacy_review_medications-assessment_polypharmacy_review_id-to-assessment_polypharmacy_reviews" FOREIGN KEY ("assessment_polypharmacy_review_id") REFERENCES "assessment_polypharmacy_reviews" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE assessment_polypharmacy_review_medications ALTER COLUMN id SET DEFAULT gen_random_uuid();
