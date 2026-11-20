CREATE TABLE IF NOT EXISTS "united_kingdom_divorce_application_grade_rules" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "united_kingdom_divorce_application_grade_id" uuid NOT NULL,
    "rule_id" varchar NOT NULL,
    "dimension" varchar NOT NULL DEFAULT '',
    "category" varchar NOT NULL DEFAULT '',
    "description" varchar NOT NULL DEFAULT '',
    CONSTRAINT "fk-6893e0a0cce64a55c013521619777c50" FOREIGN KEY ("united_kingdom_divorce_application_grade_id") REFERENCES "united_kingdom_divorce_application_grades" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE united_kingdom_divorce_application_grade_rules ALTER COLUMN id SET DEFAULT gen_random_uuid();
