CREATE TABLE IF NOT EXISTS "assessment_cancer_history_items" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "relative_relationship" varchar NOT NULL DEFAULT '',
    "cancer_type" varchar NOT NULL DEFAULT '',
    "age_at_diagnosis" integer NULL,
    "outcome" varchar NOT NULL DEFAULT '',
    "sort_order" integer NOT NULL DEFAULT 0,
    "assessment_cancer_history_id" uuid NOT NULL,
    CONSTRAINT "fk-assessment_cancer_history_items-assessment_cancer_history_id-to-assessment_cancer_histories" FOREIGN KEY ("assessment_cancer_history_id") REFERENCES "assessment_cancer_histories" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE assessment_cancer_history_items ALTER COLUMN id SET DEFAULT gen_random_uuid();
