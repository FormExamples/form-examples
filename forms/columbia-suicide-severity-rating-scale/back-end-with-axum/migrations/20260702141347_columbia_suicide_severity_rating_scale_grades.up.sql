CREATE TABLE IF NOT EXISTS "columbia_suicide_severity_rating_scale_grades" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "ideation_level" integer NULL,
    "any_behaviour" varchar NOT NULL DEFAULT '',
    "recent_behaviour" varchar NOT NULL DEFAULT '',
    "risk_tier" varchar NOT NULL DEFAULT '',
    "positive_features" text NOT NULL DEFAULT '',
    "management_recommendation" text NOT NULL DEFAULT '',
    "graded_at" timestamp with time zone NOT NULL,
    "columbia_suicide_severity_rating_scale_id" uuid NOT NULL,
    CONSTRAINT "fk-columbia_suicide_severity_rating_scale_grades-columbia_suicide_severity_rating_scale_id-to-columbia_suicide_severity_rating_scales" FOREIGN KEY ("columbia_suicide_severity_rating_scale_id") REFERENCES "columbia_suicide_severity_rating_scales" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE columbia_suicide_severity_rating_scale_grades ALTER COLUMN id SET DEFAULT gen_random_uuid();
