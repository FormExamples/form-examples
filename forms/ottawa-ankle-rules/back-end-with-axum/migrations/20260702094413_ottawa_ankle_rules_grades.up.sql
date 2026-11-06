CREATE TABLE IF NOT EXISTS "ottawa_ankle_rules_grades" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "unable_to_bear_weight" varchar NOT NULL DEFAULT '',
    "ankle_xray_indicated" varchar NOT NULL DEFAULT '',
    "foot_xray_indicated" varchar NOT NULL DEFAULT '',
    "recommended_action" text NOT NULL DEFAULT '',
    "graded_at" timestamp with time zone NOT NULL,
    "ottawa_ankle_rules_id" uuid NOT NULL,
    CONSTRAINT "fk-ottawa_ankle_rules_grades-ottawa_ankle_rules_id-to-ottawa_ankle_rules" FOREIGN KEY ("ottawa_ankle_rules_id") REFERENCES "ottawa_ankle_rules" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE ottawa_ankle_rules_grades ALTER COLUMN id SET DEFAULT gen_random_uuid();
