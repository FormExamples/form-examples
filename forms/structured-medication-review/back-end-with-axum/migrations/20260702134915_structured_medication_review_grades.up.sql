CREATE TABLE IF NOT EXISTS "structured_medication_review_grades" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "review_status" varchar NOT NULL DEFAULT '',
    "anticholinergic_burden_score" integer NOT NULL DEFAULT 0,
    "anticholinergic_band" varchar NOT NULL DEFAULT '',
    "polypharmacy_band" varchar NOT NULL DEFAULT '',
    "burden_band" varchar NOT NULL DEFAULT '',
    "medicine_count" integer NOT NULL DEFAULT 0,
    "regular_medicine_count" integer NOT NULL DEFAULT 0,
    "graded_at" timestamp with time zone NOT NULL,
    "structured_medication_review_id" uuid NOT NULL,
    CONSTRAINT "fk-structured_medication_review_grades-structured_medication_review_id-to-structured_medication_reviews" FOREIGN KEY ("structured_medication_review_id") REFERENCES "structured_medication_reviews" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE structured_medication_review_grades ALTER COLUMN id SET DEFAULT gen_random_uuid();
