CREATE TABLE IF NOT EXISTS "recognition_of_stroke_in_the_emergency_room_grades" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "rosier_score" integer NULL,
    "stroke_likely" varchar NOT NULL DEFAULT '',
    "glucose_excluded" varchar NOT NULL DEFAULT '',
    "graded_at" timestamp with time zone NOT NULL,
    "recognition_of_stroke_in_the_emergency_room_id" uuid NOT NULL,
    CONSTRAINT "fk-recognition_of_stroke_in_the_emergency_room_grades-recognition_of_stroke_in_the_emergency_room_id-to-recognition_of_stroke_in_the_emergency_rooms" FOREIGN KEY ("recognition_of_stroke_in_the_emergency_room_id") REFERENCES "recognition_of_stroke_in_the_emergency_rooms" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE recognition_of_stroke_in_the_emergency_room_grades ALTER COLUMN id SET DEFAULT gen_random_uuid();
