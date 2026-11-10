CREATE TABLE IF NOT EXISTS "grades" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "psqi_global_score" integer NULL,
    "psqi_component1_subjective_quality" integer NULL,
    "psqi_component2_sleep_latency" integer NULL,
    "psqi_component3_sleep_duration" integer NULL,
    "psqi_component4_sleep_efficiency" integer NULL,
    "psqi_component5_sleep_disturbances" integer NULL,
    "psqi_component6_sleep_medication" integer NULL,
    "psqi_component7_daytime_dysfunction" integer NULL,
    "sleep_quality_category" varchar NOT NULL DEFAULT '',
    "graded_at" timestamp with time zone NOT NULL,
    "assessment_id" uuid NOT NULL,
    CONSTRAINT "fk-grades-assessment_id-to-assessments" FOREIGN KEY ("assessment_id") REFERENCES "assessments" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE grades ALTER COLUMN id SET DEFAULT gen_random_uuid();
