CREATE TABLE IF NOT EXISTS "grades" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "overall_highest_ukmec_category" integer NOT NULL DEFAULT 1,
    "ukmec_cocp" integer NULL,
    "ukmec_pop" integer NULL,
    "ukmec_patch" integer NULL,
    "ukmec_ring" integer NULL,
    "ukmec_injection" integer NULL,
    "ukmec_implant" integer NULL,
    "ukmec_cu_iud" integer NULL,
    "ukmec_lng_ius" integer NULL,
    "ukmec_condom_male" integer NULL,
    "ukmec_condom_female" integer NULL,
    "ukmec_diaphragm" integer NULL,
    "graded_at" timestamp with time zone NOT NULL,
    "assessment_id" uuid NOT NULL,
    CONSTRAINT "fk-grades-assessment_id-to-assessments" FOREIGN KEY ("assessment_id") REFERENCES "assessments" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE grades ALTER COLUMN id SET DEFAULT gen_random_uuid();
