CREATE TABLE IF NOT EXISTS "assessment_performance_rating_items" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "occupational_issue" varchar NOT NULL DEFAULT '',
    "domain" varchar NOT NULL DEFAULT '',
    "importance_score" integer NULL,
    "performance_score" integer NULL,
    "sort_order" integer NOT NULL DEFAULT 0,
    "performance_ratings_id" uuid NOT NULL,
    CONSTRAINT "fk-assessment_performance_rating_items-performance_ratings_id-to-assessment_performance_ratings" FOREIGN KEY ("performance_ratings_id") REFERENCES "assessment_performance_ratings" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE assessment_performance_rating_items ALTER COLUMN id SET DEFAULT gen_random_uuid();
