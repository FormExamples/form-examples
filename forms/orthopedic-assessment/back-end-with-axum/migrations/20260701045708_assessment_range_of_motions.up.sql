CREATE TABLE IF NOT EXISTS "assessment_range_of_motions" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "joint_assessed" varchar NOT NULL DEFAULT '',
    "side_assessed" varchar NOT NULL DEFAULT '',
    "overall_rom_status" varchar NOT NULL DEFAULT '',
    "range_of_motion_notes" text NOT NULL DEFAULT '',
    "assessment_id" uuid NOT NULL,
    CONSTRAINT "fk-assessment_range_of_motions-assessment_id-to-assessments" FOREIGN KEY ("assessment_id") REFERENCES "assessments" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE assessment_range_of_motions ALTER COLUMN id SET DEFAULT gen_random_uuid();
