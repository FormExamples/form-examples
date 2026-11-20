CREATE TABLE IF NOT EXISTS "united_kingdom_vehicle_registration_application_grades" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "united_kingdom_vehicle_registration_application_id" uuid NOT NULL UNIQUE,
    "validity_class" varchar NOT NULL DEFAULT '',
    "fee_due_as_pence" integer NULL,
    "missing_item_count" integer NOT NULL DEFAULT 0,
    "graded_at" timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "fk-98d428c26c4f9b6a18a58ea7bde2908a" FOREIGN KEY ("united_kingdom_vehicle_registration_application_id") REFERENCES "united_kingdom_vehicle_registration_applications" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE united_kingdom_vehicle_registration_application_grades ALTER COLUMN id SET DEFAULT gen_random_uuid();
