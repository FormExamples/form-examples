CREATE TABLE IF NOT EXISTS "recognition_of_stroke_in_the_emergency_room_grade_flags" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "flag_id" varchar NOT NULL,
    "category" varchar NOT NULL DEFAULT '',
    "priority" varchar NOT NULL DEFAULT '',
    "description" varchar NOT NULL DEFAULT '',
    "suggested_action" varchar NOT NULL DEFAULT '',
    "recognition_of_stroke_in_the_emergency_room_grade_id" uuid NOT NULL,
    CONSTRAINT "fk-recognition_of_stroke_in_the_emergency_room_grade_flags-recognition_of_stroke_in_the_emergency_room_grade_id-to-recognition_of_stroke_in_the_emergency_room_grades" FOREIGN KEY ("recognition_of_stroke_in_the_emergency_room_grade_id") REFERENCES "recognition_of_stroke_in_the_emergency_room_grades" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE recognition_of_stroke_in_the_emergency_room_grade_flags ALTER COLUMN id SET DEFAULT gen_random_uuid();
