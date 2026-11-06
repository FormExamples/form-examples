CREATE TABLE IF NOT EXISTS "glasgow_coma_scale_grades" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "eye_score" integer NULL,
    "verbal_score" integer NULL,
    "motor_score" integer NULL,
    "total_score" integer NULL,
    "breakdown" varchar NOT NULL DEFAULT '',
    "total_display" varchar NOT NULL DEFAULT '',
    "severity_band" varchar NOT NULL DEFAULT '',
    "pupil_reactivity_score" integer NULL,
    "gcs_p" integer NULL,
    "graded_at" timestamp with time zone NOT NULL,
    "glasgow_coma_scale_id" uuid NOT NULL,
    CONSTRAINT "fk-glasgow_coma_scale_grades-glasgow_coma_scale_id-to-glasgow_coma_scales" FOREIGN KEY ("glasgow_coma_scale_id") REFERENCES "glasgow_coma_scales" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE glasgow_coma_scale_grades ALTER COLUMN id SET DEFAULT gen_random_uuid();
