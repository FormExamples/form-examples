CREATE TABLE IF NOT EXISTS "perioperative_optimization_grade_flags" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "flag_id" varchar NOT NULL,
    "category" varchar NOT NULL DEFAULT '',
    "priority" varchar NOT NULL DEFAULT '',
    "domain" varchar NOT NULL DEFAULT '',
    "description" varchar NOT NULL DEFAULT '',
    "suggested_action" varchar NOT NULL DEFAULT '',
    "perioperative_optimization_grade_id" uuid NOT NULL,
    CONSTRAINT "fk-perioperative_optimization_grade_flags-perioperative_optimization_grade_id-to-perioperative_optimization_grades" FOREIGN KEY ("perioperative_optimization_grade_id") REFERENCES "perioperative_optimization_grades" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE perioperative_optimization_grade_flags ALTER COLUMN id SET DEFAULT gen_random_uuid();
