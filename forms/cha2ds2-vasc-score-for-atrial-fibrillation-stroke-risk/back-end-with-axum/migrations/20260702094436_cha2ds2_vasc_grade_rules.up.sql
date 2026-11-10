CREATE TABLE IF NOT EXISTS "cha2ds2_vasc_grade_rules" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "rule_id" varchar NOT NULL,
    "criterion" varchar NOT NULL,
    "points" integer NULL,
    "category" varchar NOT NULL DEFAULT '',
    "description" varchar NOT NULL DEFAULT '',
    "cha2ds2_vasc_grade_id" uuid NOT NULL,
    CONSTRAINT "fk-cha2ds2_vasc_grade_rules-cha2ds2_vasc_grade_id-to-cha2ds2_vasc_grades" FOREIGN KEY ("cha2ds2_vasc_grade_id") REFERENCES "cha2ds2_vasc_grades" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE cha2ds2_vasc_grade_rules ALTER COLUMN id SET DEFAULT gen_random_uuid();
