CREATE TABLE IF NOT EXISTS "assessment_current_medications" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "takes_psychiatric_medications" varchar NOT NULL DEFAULT '',
    "takes_other_medications" varchar NOT NULL DEFAULT '',
    "medication_adherence" varchar NOT NULL DEFAULT '',
    "adherence_barriers" text NOT NULL DEFAULT '',
    "side_effects" text NOT NULL DEFAULT '',
    "clozapine_registered" varchar NOT NULL DEFAULT '',
    "depot_injection" varchar NOT NULL DEFAULT '',
    "depot_details" text NOT NULL DEFAULT '',
    "adverse_drug_reactions" text NOT NULL DEFAULT '',
    "additional_notes" text NOT NULL DEFAULT '',
    "assessment_id" uuid NOT NULL,
    CONSTRAINT "fk-assessment_current_medications-assessment_id-to-assessments" FOREIGN KEY ("assessment_id") REFERENCES "assessments" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE assessment_current_medications ALTER COLUMN id SET DEFAULT gen_random_uuid();
