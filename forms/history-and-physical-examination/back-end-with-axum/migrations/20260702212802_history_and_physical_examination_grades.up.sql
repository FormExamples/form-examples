CREATE TABLE IF NOT EXISTS "history_and_physical_examination_grades" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "status" varchar NOT NULL DEFAULT '',
    "completeness_percent" integer NULL,
    "graded_at" timestamp with time zone NOT NULL,
    "history_and_physical_examination_id" uuid NOT NULL,
    CONSTRAINT "fk-history_and_physical_examination_grades-history_and_physical_examination_id-to-history_and_physical_examinations" FOREIGN KEY ("history_and_physical_examination_id") REFERENCES "history_and_physical_examinations" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE history_and_physical_examination_grades ALTER COLUMN id SET DEFAULT gen_random_uuid();
