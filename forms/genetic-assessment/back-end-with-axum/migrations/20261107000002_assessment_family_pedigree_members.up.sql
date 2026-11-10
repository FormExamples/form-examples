CREATE TABLE IF NOT EXISTS "assessment_family_pedigree_members" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "family_pedigree_id" uuid NOT NULL,
    "relationship" varchar NOT NULL DEFAULT '',
    "sex" varchar NOT NULL DEFAULT '',
    "age" integer NULL,
    "alive" varchar NOT NULL DEFAULT '',
    "age_at_death" integer NULL,
    "cause_of_death" varchar NOT NULL DEFAULT '',
    "medical_conditions" text NOT NULL DEFAULT '',
    "sort_order" integer NOT NULL DEFAULT 0,
    CONSTRAINT "fk-assessment_family_pedigree_members-family_pedigree_id-to-assessment_family_pedigrees" FOREIGN KEY ("family_pedigree_id") REFERENCES "assessment_family_pedigrees" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE assessment_family_pedigree_members ALTER COLUMN id SET DEFAULT gen_random_uuid();
