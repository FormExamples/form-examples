CREATE TABLE IF NOT EXISTS "ottawa_knee_rule_grade_rules" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "rule_id" varchar NOT NULL,
    "instrument" varchar NOT NULL,
    "criterion" varchar NOT NULL DEFAULT '',
    "fired" boolean NOT NULL DEFAULT false,
    "category" varchar NOT NULL DEFAULT '',
    "description" varchar NOT NULL DEFAULT '',
    "ottawa_knee_rule_grade_id" uuid NOT NULL,
    CONSTRAINT "fk-ottawa_knee_rule_grade_rules-ottawa_knee_rule_grade_id-to-ottawa_knee_rule_grades" FOREIGN KEY ("ottawa_knee_rule_grade_id") REFERENCES "ottawa_knee_rule_grades" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE ottawa_knee_rule_grade_rules ALTER COLUMN id SET DEFAULT gen_random_uuid();
