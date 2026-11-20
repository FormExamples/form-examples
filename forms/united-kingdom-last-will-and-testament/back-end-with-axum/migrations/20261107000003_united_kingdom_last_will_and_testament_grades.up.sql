CREATE TABLE IF NOT EXISTS "united_kingdom_last_will_and_testament_grades" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "united_kingdom_last_will_and_testament_id" uuid NOT NULL UNIQUE,
    "validity_class" varchar NOT NULL DEFAULT '',
    "shares_total_percent" double precision NULL,
    "witness_count" integer NULL,
    "formality_risk" varchar NOT NULL DEFAULT '',
    "graded_at" timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "fk-c9abd17731ab03450e024b476a70e3ae" FOREIGN KEY ("united_kingdom_last_will_and_testament_id") REFERENCES "united_kingdom_last_will_and_testaments" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE united_kingdom_last_will_and_testament_grades ALTER COLUMN id SET DEFAULT gen_random_uuid();
