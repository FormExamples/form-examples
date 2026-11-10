CREATE TABLE IF NOT EXISTS "neurodiversity_adjustment_review_grade_flags" (
    "id" uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    "created_at" timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" timestamp with time zone NULL,
    "neurodiversity_adjustment_review_grade_id" uuid NOT NULL,
    "flag_id" varchar NOT NULL,
    "category" varchar NOT NULL,
    "priority" varchar NOT NULL,
    "description" varchar NOT NULL,
    "suggested_action" varchar NOT NULL,
    CONSTRAINT "fk_neurodiversity_adjustment_review_grade_flags_grade_id" FOREIGN KEY ("neurodiversity_adjustment_review_grade_id") REFERENCES "neurodiversity_adjustment_review_grades" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "index_neurodiversity_adjustment_review_grade_flag_grade_id" ON "neurodiversity_adjustment_review_grade_flags" ("neurodiversity_adjustment_review_grade_id");
