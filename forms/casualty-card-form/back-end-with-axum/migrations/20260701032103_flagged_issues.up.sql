CREATE TABLE IF NOT EXISTS "flagged_issues" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "flag_id" text NOT NULL,
    "category" text NOT NULL,
    "message" text NOT NULL,
    "priority" text NOT NULL,
    "news2_result_id" uuid NOT NULL,
    CONSTRAINT "fk-flagged_issues-news2_result_id-to-news2_results" FOREIGN KEY ("news2_result_id") REFERENCES "news2_results" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE flagged_issues ALTER COLUMN id SET DEFAULT gen_random_uuid();
