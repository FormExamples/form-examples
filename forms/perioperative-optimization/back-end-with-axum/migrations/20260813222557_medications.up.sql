CREATE TABLE IF NOT EXISTS "medications" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "international_nonproprietary_name" text NOT NULL DEFAULT '',
    "brand_name" text NOT NULL DEFAULT '',
    "kind" text NOT NULL DEFAULT '',
    "hold_class" text NOT NULL DEFAULT '',
    "hold_required" boolean NOT NULL DEFAULT false,
    "default_hold_start_before_days" integer NULL,
    "default_restart_after_days" integer NULL,
    "perioperative_hold_guidance" text NOT NULL DEFAULT '',
    "description" text NOT NULL DEFAULT ''
);

ALTER TABLE medications ALTER COLUMN id SET DEFAULT gen_random_uuid();
