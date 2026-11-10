CREATE TABLE IF NOT EXISTS "medications" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "international_nonproprietary_name" text NOT NULL DEFAULT '',
    "brand_name" text NOT NULL DEFAULT '',
    "kind" text NOT NULL DEFAULT '',
    "nutrient_interaction" text NOT NULL DEFAULT '',
    "description" text NOT NULL DEFAULT ''
);

ALTER TABLE medications ALTER COLUMN id SET DEFAULT gen_random_uuid();
