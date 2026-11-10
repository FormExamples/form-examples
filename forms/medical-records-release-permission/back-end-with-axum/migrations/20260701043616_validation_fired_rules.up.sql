CREATE TABLE IF NOT EXISTS "validation_fired_rules" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "rule_id" varchar NOT NULL,
    "domain" varchar NOT NULL DEFAULT '',
    "description" text NOT NULL DEFAULT '',
    "score" integer NOT NULL DEFAULT 0,
    "validation_result_id" uuid NOT NULL,
    CONSTRAINT "fk-validation_fired_rules-validation_result_id-to-validation_results" FOREIGN KEY ("validation_result_id") REFERENCES "validation_results" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE validation_fired_rules ALTER COLUMN id SET DEFAULT gen_random_uuid();
