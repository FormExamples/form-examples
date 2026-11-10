CREATE TABLE IF NOT EXISTS "assessment_performance_ratings" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "overall_performance_score" double precision NULL,
    "self_care_performance_score" double precision NULL,
    "productivity_performance_score" double precision NULL,
    "leisure_performance_score" double precision NULL,
    "performance_notes" text NOT NULL DEFAULT '',
    "assessment_id" uuid NOT NULL,
    CONSTRAINT "fk-assessment_performance_ratings-assessment_id-to-assessments" FOREIGN KEY ("assessment_id") REFERENCES "assessments" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE assessment_performance_ratings ALTER COLUMN id SET DEFAULT gen_random_uuid();
