CREATE TABLE IF NOT EXISTS "validation_additional_flags" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "flag_id" varchar NOT NULL,
    "category" varchar NOT NULL DEFAULT '',
    "message" text NOT NULL DEFAULT '',
    "priority" varchar NOT NULL DEFAULT 'low',
    "validation_result_id" uuid NOT NULL,
    CONSTRAINT "fk-validation_additional_flags-validation_result_id-to-validation_results" FOREIGN KEY ("validation_result_id") REFERENCES "validation_results" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE validation_additional_flags ALTER COLUMN id SET DEFAULT gen_random_uuid();
