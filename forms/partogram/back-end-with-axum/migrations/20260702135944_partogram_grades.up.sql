CREATE TABLE IF NOT EXISTS "partogram_grades" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "progress_status" varchar NOT NULL DEFAULT '',
    "latest_dilatation_cm" double precision NULL,
    "graded_at" timestamp with time zone NOT NULL,
    "partogram_id" uuid NOT NULL,
    CONSTRAINT "fk-partogram_grades-partogram_id-to-partograms" FOREIGN KEY ("partogram_id") REFERENCES "partograms" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE partogram_grades ALTER COLUMN id SET DEFAULT gen_random_uuid();
