CREATE TABLE IF NOT EXISTS "cardiology_response_grade_flags" (
    "id" uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    "created_at" timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" timestamp with time zone NULL,
    "cardiology_response_grade_id" uuid NOT NULL,
    "flag_id" varchar NOT NULL,
    "category" varchar NOT NULL,
    "priority" varchar NOT NULL,
    "description" varchar NOT NULL,
    "suggested_action" varchar NOT NULL,
    CONSTRAINT "fk_cardiology_response_grade_flags_grade_id" FOREIGN KEY ("cardiology_response_grade_id") REFERENCES "cardiology_response_grades" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "index_cardiology_response_grade_flag_grade_id" ON "cardiology_response_grade_flags" ("cardiology_response_grade_id");
