CREATE TABLE IF NOT EXISTS "assessment_family_pedigrees" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "assessment_id" uuid NOT NULL UNIQUE,
    "total_first_degree_relatives" integer NULL,
    "total_second_degree_relatives" integer NULL,
    "consanguinity_in_family" varchar NOT NULL DEFAULT '',
    "consanguinity_details" text NOT NULL DEFAULT '',
    "adoption_status" varchar NOT NULL DEFAULT '',
    "pedigree_notes" text NOT NULL DEFAULT '',
    "three_generation_pedigree_drawn" varchar NOT NULL DEFAULT '',
    CONSTRAINT "fk-assessment_family_pedigrees-assessment_id-to-assessments" FOREIGN KEY ("assessment_id") REFERENCES "assessments" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE assessment_family_pedigrees ALTER COLUMN id SET DEFAULT gen_random_uuid();
