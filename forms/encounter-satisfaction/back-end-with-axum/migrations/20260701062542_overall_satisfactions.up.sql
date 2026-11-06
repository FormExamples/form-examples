CREATE TABLE IF NOT EXISTS "overall_satisfactions" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "overall_rating" integer NULL,
    "likely_to_recommend" integer NULL,
    "likely_to_return" integer NULL,
    "comments" text NOT NULL DEFAULT '',
    "encounter_satisfaction_id" uuid NOT NULL,
    CONSTRAINT "fk-overall_satisfactions-encounter_satisfaction_id-to-encounter_satisfactions" FOREIGN KEY ("encounter_satisfaction_id") REFERENCES "encounter_satisfactions" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE overall_satisfactions ALTER COLUMN id SET DEFAULT gen_random_uuid();
