CREATE TABLE IF NOT EXISTS "ottawa_ankle_rules_grade_flags" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "flag_id" varchar NOT NULL,
    "category" varchar NOT NULL DEFAULT '',
    "priority" varchar NOT NULL DEFAULT '',
    "description" varchar NOT NULL DEFAULT '',
    "suggested_action" varchar NOT NULL DEFAULT '',
    "ottawa_ankle_rules_grade_id" uuid NOT NULL,
    CONSTRAINT "fk-ottawa_ankle_rules_grade_flags-ottawa_ankle_rules_grade_id-to-ottawa_ankle_rules_grades" FOREIGN KEY ("ottawa_ankle_rules_grade_id") REFERENCES "ottawa_ankle_rules_grades" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE ottawa_ankle_rules_grade_flags ALTER COLUMN id SET DEFAULT gen_random_uuid();
