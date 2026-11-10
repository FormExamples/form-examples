CREATE TABLE IF NOT EXISTS "grace_score_for_acute_coronary_syndrome_grade_flags" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "flag_id" varchar NOT NULL,
    "category" varchar NOT NULL DEFAULT '',
    "priority" varchar NOT NULL DEFAULT '',
    "description" varchar NOT NULL DEFAULT '',
    "suggested_action" varchar NOT NULL DEFAULT '',
    "grace_score_for_acute_coronary_syndrome_grade_id" uuid NOT NULL,
    CONSTRAINT "fk-grace_score_for_acute_coronary_syndrome_grade_flags-grace_score_for_acute_coronary_syndrome_grade_id-to-grace_score_for_acute_coronary_syndrome_grades" FOREIGN KEY ("grace_score_for_acute_coronary_syndrome_grade_id") REFERENCES "grace_score_for_acute_coronary_syndrome_grades" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE grace_score_for_acute_coronary_syndrome_grade_flags ALTER COLUMN id SET DEFAULT gen_random_uuid();
