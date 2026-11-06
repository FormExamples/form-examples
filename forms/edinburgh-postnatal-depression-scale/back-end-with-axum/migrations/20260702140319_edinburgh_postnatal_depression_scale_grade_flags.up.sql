CREATE TABLE IF NOT EXISTS "edinburgh_postnatal_depression_scale_grade_flags" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "flag_id" varchar NOT NULL,
    "category" varchar NOT NULL DEFAULT '',
    "priority" varchar NOT NULL DEFAULT '',
    "description" varchar NOT NULL DEFAULT '',
    "suggested_action" varchar NOT NULL DEFAULT '',
    "edinburgh_postnatal_depression_scale_grade_id" uuid NOT NULL,
    CONSTRAINT "fk-edinburgh_postnatal_depression_scale_grade_flags-edinburgh_postnatal_depression_scale_grade_id-to-edinburgh_postnatal_depression_scale_grades" FOREIGN KEY ("edinburgh_postnatal_depression_scale_grade_id") REFERENCES "edinburgh_postnatal_depression_scale_grades" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE edinburgh_postnatal_depression_scale_grade_flags ALTER COLUMN id SET DEFAULT gen_random_uuid();
