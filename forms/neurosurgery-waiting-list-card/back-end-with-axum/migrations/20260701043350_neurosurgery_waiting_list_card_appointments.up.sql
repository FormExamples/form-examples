CREATE TABLE IF NOT EXISTS "neurosurgery_waiting_list_card_appointments" (
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
    "neurosurgery_waiting_list_card_id" uuid NOT NULL,
    CONSTRAINT "fk-neurosurgery_waiting_list_card_appointments-neurosurgery_waiting_list_card_id-to-neurosurgery_waiting_list_cards" FOREIGN KEY ("neurosurgery_waiting_list_card_id") REFERENCES "neurosurgery_waiting_list_cards" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE neurosurgery_waiting_list_card_appointments ALTER COLUMN id SET DEFAULT gen_random_uuid();
