CREATE TABLE IF NOT EXISTS "confusion_assessment_method_grades" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "classification" varchar NOT NULL DEFAULT '',
    "delirium_present" boolean NULL,
    "feature_1_positive" boolean NULL,
    "feature_2_positive" boolean NULL,
    "feature_3_positive" boolean NULL,
    "feature_4_positive" boolean NULL,
    "positive_features" text NOT NULL DEFAULT '',
    "motoric_subtype" varchar NOT NULL DEFAULT '',
    "graded_at" timestamp with time zone NOT NULL,
    "confusion_assessment_method_id" uuid NOT NULL,
    CONSTRAINT "fk-confusion_assessment_method_grades-confusion_assessment_method_id-to-confusion_assessment_methods" FOREIGN KEY ("confusion_assessment_method_id") REFERENCES "confusion_assessment_methods" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE confusion_assessment_method_grades ALTER COLUMN id SET DEFAULT gen_random_uuid();
