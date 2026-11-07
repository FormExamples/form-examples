CREATE TABLE IF NOT EXISTS "assessment_satisfaction_ratings" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "assessment_id" uuid NOT NULL UNIQUE,
    "overall_satisfaction_score" double precision NULL,
    "self_care_satisfaction_score" double precision NULL,
    "productivity_satisfaction_score" double precision NULL,
    "leisure_satisfaction_score" double precision NULL,
    "satisfaction_notes" text NOT NULL DEFAULT '',
    CONSTRAINT "fk-assessment_satisfaction_ratings-assessment_id-to-assessments" FOREIGN KEY ("assessment_id") REFERENCES "assessments" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE assessment_satisfaction_ratings ALTER COLUMN id SET DEFAULT gen_random_uuid();
