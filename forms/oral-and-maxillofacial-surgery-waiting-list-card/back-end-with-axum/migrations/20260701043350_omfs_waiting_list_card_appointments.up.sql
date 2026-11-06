CREATE TABLE IF NOT EXISTS "omfs_waiting_list_card_appointments" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "appointment_date" date NULL,
    "appointment_time" varchar NULL,
    "duration_minutes" integer NULL,
    "appointment_type" varchar NOT NULL DEFAULT '',
    "site_name" varchar NOT NULL DEFAULT '',
    "site_address" text NOT NULL DEFAULT '',
    "clinic_name" varchar NOT NULL DEFAULT '',
    "room" varchar NOT NULL DEFAULT '',
    "clinician_name" varchar NOT NULL DEFAULT '',
    "clinician_team" varchar NOT NULL DEFAULT '',
    "status" varchar NOT NULL DEFAULT 'scheduled',
    "travel_notes" text NOT NULL DEFAULT '',
    "access_notes" text NOT NULL DEFAULT '',
    "omfs_waiting_list_card_id" uuid NOT NULL,
    CONSTRAINT "fk-omfs_waiting_list_card_appointments-omfs_waiting_list_card_id-to-omfs_waiting_list_cards" FOREIGN KEY ("omfs_waiting_list_card_id") REFERENCES "omfs_waiting_list_cards" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE omfs_waiting_list_card_appointments ALTER COLUMN id SET DEFAULT gen_random_uuid();
