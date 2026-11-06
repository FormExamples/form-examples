CREATE TABLE IF NOT EXISTS "assessment_rom_measurements" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "movement" varchar NOT NULL DEFAULT '',
    "active_degrees" integer NULL,
    "passive_degrees" integer NULL,
    "normal_degrees" integer NULL,
    "end_feel" varchar NOT NULL DEFAULT '',
    "pain_on_movement" varchar NOT NULL DEFAULT '',
    "sort_order" integer NOT NULL DEFAULT 0,
    "assessment_range_of_motion_id" uuid NOT NULL,
    CONSTRAINT "fk-assessment_rom_measurements-assessment_range_of_motion_id-to-assessment_range_of_motions" FOREIGN KEY ("assessment_range_of_motion_id") REFERENCES "assessment_range_of_motions" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE assessment_rom_measurements ALTER COLUMN id SET DEFAULT gen_random_uuid();
