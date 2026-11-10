CREATE TABLE IF NOT EXISTS "ottawa_knee_rule_grades" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "xray_indicated" varchar NOT NULL DEFAULT '',
    "decision" varchar NOT NULL DEFAULT '',
    "recommended_action" text NOT NULL DEFAULT '',
    "graded_at" timestamp with time zone NOT NULL,
    "ottawa_knee_rule_id" uuid NOT NULL,
    CONSTRAINT "fk-ottawa_knee_rule_grades-ottawa_knee_rule_id-to-ottawa_knee_rules" FOREIGN KEY ("ottawa_knee_rule_id") REFERENCES "ottawa_knee_rules" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE ottawa_knee_rule_grades ALTER COLUMN id SET DEFAULT gen_random_uuid();
