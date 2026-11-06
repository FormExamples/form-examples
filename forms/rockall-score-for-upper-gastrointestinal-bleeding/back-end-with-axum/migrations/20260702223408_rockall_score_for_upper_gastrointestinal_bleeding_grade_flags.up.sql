CREATE TABLE IF NOT EXISTS "rockall_score_for_upper_gastrointestinal_bleeding_grade_flags" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "flag_id" varchar NOT NULL,
    "category" varchar NOT NULL DEFAULT '',
    "priority" varchar NOT NULL DEFAULT '',
    "description" varchar NOT NULL DEFAULT '',
    "suggested_action" varchar NOT NULL DEFAULT '',
    "rockall_score_for_upper_gastrointestinal_bleeding_grade_id" uuid NOT NULL,
    CONSTRAINT "fk-rockall_score_for_upper_gastrointestinal_bleeding_grade_flags-rockall_score_for_upper_gastrointestinal_bleeding_grade_id-to-rockall_score_for_upper_gastrointestinal_bleeding_grades" FOREIGN KEY ("rockall_score_for_upper_gastrointestinal_bleeding_grade_id") REFERENCES "rockall_score_for_upper_gastrointestinal_bleeding_grades" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE rockall_score_for_upper_gastrointestinal_bleeding_grade_flags ALTER COLUMN id SET DEFAULT gen_random_uuid();
