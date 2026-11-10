CREATE TABLE IF NOT EXISTS "assessment_current_managements" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "assessment_id" uuid NOT NULL UNIQUE,
    "antihistamines" varchar NOT NULL DEFAULT '',
    "antihistamine_details" text NOT NULL DEFAULT '',
    "nasal_steroids" varchar NOT NULL DEFAULT '',
    "adrenaline_auto_injector" varchar NOT NULL DEFAULT '',
    "immunotherapy" varchar NOT NULL DEFAULT '',
    "immunotherapy_details" text NOT NULL DEFAULT '',
    "biologics" varchar NOT NULL DEFAULT '',
    "biologic_details" text NOT NULL DEFAULT '',
    "allergen_avoidance_strategies" text NOT NULL DEFAULT '',
    CONSTRAINT "fk-assessment_current_managements-assessment_id-to-assessments" FOREIGN KEY ("assessment_id") REFERENCES "assessments" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE assessment_current_managements ALTER COLUMN id SET DEFAULT gen_random_uuid();
