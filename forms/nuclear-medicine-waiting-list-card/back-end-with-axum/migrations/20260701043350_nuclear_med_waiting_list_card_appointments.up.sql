CREATE TABLE IF NOT EXISTS "nuclear_med_waiting_list_card_appointments" (
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
    "nuclear_med_waiting_list_card_id" uuid NOT NULL,
    CONSTRAINT "fk-nuclear_med_waiting_list_card_appointments-nuclear_med_waiting_list_card_id-to-nuclear_med_waiting_list_cards" FOREIGN KEY ("nuclear_med_waiting_list_card_id") REFERENCES "nuclear_med_waiting_list_cards" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE nuclear_med_waiting_list_card_appointments ALTER COLUMN id SET DEFAULT gen_random_uuid();
