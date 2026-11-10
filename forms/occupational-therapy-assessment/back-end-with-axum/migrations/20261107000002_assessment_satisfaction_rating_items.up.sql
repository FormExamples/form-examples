CREATE TABLE IF NOT EXISTS "assessment_satisfaction_rating_items" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "satisfaction_ratings_id" uuid NOT NULL,
    "occupational_issue" varchar NOT NULL DEFAULT '',
    "domain" varchar NOT NULL DEFAULT '',
    "satisfaction_score" integer NULL,
    "sort_order" integer NOT NULL DEFAULT 0,
    CONSTRAINT "fk-assessment_satisfaction_rating_items-satisfaction_ratings_id-to-assessment_satisfaction_ratings" FOREIGN KEY ("satisfaction_ratings_id") REFERENCES "assessment_satisfaction_ratings" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE assessment_satisfaction_rating_items ALTER COLUMN id SET DEFAULT gen_random_uuid();
