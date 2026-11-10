CREATE TABLE IF NOT EXISTS "apgar_score_grades" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "total_one_minute" integer NULL,
    "total_five_minute" integer NULL,
    "total_ten_minute" integer NULL,
    "band_one_minute" varchar NOT NULL DEFAULT '',
    "band_five_minute" varchar NOT NULL DEFAULT '',
    "band_ten_minute" varchar NOT NULL DEFAULT '',
    "summary_band" varchar NOT NULL DEFAULT '',
    "trend" varchar NOT NULL DEFAULT '',
    "graded_at" timestamp with time zone NOT NULL,
    "apgar_score_id" uuid NOT NULL,
    CONSTRAINT "fk-apgar_score_grades-apgar_score_id-to-apgar_scores" FOREIGN KEY ("apgar_score_id") REFERENCES "apgar_scores" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE apgar_score_grades ALTER COLUMN id SET DEFAULT gen_random_uuid();
