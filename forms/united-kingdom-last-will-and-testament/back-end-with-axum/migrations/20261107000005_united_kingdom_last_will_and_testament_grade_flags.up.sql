CREATE TABLE IF NOT EXISTS "united_kingdom_last_will_and_testament_grade_flags" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "united_kingdom_last_will_and_testament_grade_id" uuid NOT NULL,
    "flag_id" varchar NOT NULL,
    "category" varchar NOT NULL DEFAULT '',
    "priority" varchar NOT NULL DEFAULT '',
    "description" varchar NOT NULL DEFAULT '',
    "suggested_action" varchar NOT NULL DEFAULT '',
    CONSTRAINT "fk-aacd33644ea6011b0f2d7ca0a440dbaa" FOREIGN KEY ("united_kingdom_last_will_and_testament_grade_id") REFERENCES "united_kingdom_last_will_and_testament_grades" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE united_kingdom_last_will_and_testament_grade_flags ALTER COLUMN id SET DEFAULT gen_random_uuid();
