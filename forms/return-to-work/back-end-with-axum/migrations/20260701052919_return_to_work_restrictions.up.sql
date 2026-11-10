CREATE TABLE IF NOT EXISTS "return_to_work_restrictions" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "kind" varchar NOT NULL DEFAULT '',
    "severity" varchar NOT NULL DEFAULT '',
    "quantitative_limit" varchar NOT NULL DEFAULT '',
    "notes" varchar NOT NULL DEFAULT '',
    "start_date" date NULL,
    "end_date" date NULL,
    "priority_rank" integer NOT NULL DEFAULT 0,
    "return_to_work_id" uuid NOT NULL,
    CONSTRAINT "fk-return_to_work_restrictions-return_to_work_id-to-return_to_works" FOREIGN KEY ("return_to_work_id") REFERENCES "return_to_works" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE return_to_work_restrictions ALTER COLUMN id SET DEFAULT gen_random_uuid();
