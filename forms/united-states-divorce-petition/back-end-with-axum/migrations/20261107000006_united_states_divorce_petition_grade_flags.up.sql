CREATE TABLE IF NOT EXISTS "united_states_divorce_petition_grade_flags" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "united_states_divorce_petition_grade_id" uuid NOT NULL,
    "flag_id" varchar NOT NULL,
    "category" varchar NOT NULL DEFAULT '',
    "priority" varchar NOT NULL DEFAULT '',
    "description" varchar NOT NULL DEFAULT '',
    "suggested_action" varchar NOT NULL DEFAULT '',
    CONSTRAINT "fk-673e193323f6a38dd81576319f139f15" FOREIGN KEY ("united_states_divorce_petition_grade_id") REFERENCES "united_states_divorce_petition_grades" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE united_states_divorce_petition_grade_flags ALTER COLUMN id SET DEFAULT gen_random_uuid();
