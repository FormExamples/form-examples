CREATE TABLE IF NOT EXISTS "wells_score_for_deep_vein_thrombosis_grades" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "wells_score" integer NULL,
    "two_level_band" varchar NOT NULL DEFAULT '',
    "three_level_band" varchar NOT NULL DEFAULT '',
    "recommended_pathway" text NOT NULL DEFAULT '',
    "graded_at" timestamp with time zone NOT NULL,
    "wells_score_for_deep_vein_thrombosis_id" uuid NOT NULL,
    CONSTRAINT "fk-wells_score_for_deep_vein_thrombosis_grades-wells_score_for_deep_vein_thrombosis_id-to-wells_score_for_deep_vein_thromboses" FOREIGN KEY ("wells_score_for_deep_vein_thrombosis_id") REFERENCES "wells_score_for_deep_vein_thromboses" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE wells_score_for_deep_vein_thrombosis_grades ALTER COLUMN id SET DEFAULT gen_random_uuid();
