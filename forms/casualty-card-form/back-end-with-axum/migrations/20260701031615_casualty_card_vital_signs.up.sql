CREATE TABLE IF NOT EXISTS "casualty_card_vital_signs" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "heart_rate" integer NULL,
    "systolic_bp" integer NULL,
    "diastolic_bp" integer NULL,
    "respiratory_rate" integer NULL,
    "oxygen_saturation" integer NULL,
    "supplemental_oxygen" text NOT NULL DEFAULT '',
    "oxygen_flow_rate" text NOT NULL DEFAULT '',
    "temperature" double precision NULL,
    "blood_glucose" double precision NULL,
    "consciousness_level" text NOT NULL DEFAULT '',
    "pupil_left_size" integer NULL,
    "pupil_left_reactive" text NOT NULL DEFAULT '',
    "pupil_right_size" integer NULL,
    "pupil_right_reactive" text NOT NULL DEFAULT '',
    "capillary_refill_time" text NOT NULL DEFAULT '',
    "weight" double precision NULL,
    "casualty_card_id" uuid NOT NULL,
    CONSTRAINT "fk-casualty_card_vital_signs-casualty_card_id-to-casualty_cards" FOREIGN KEY ("casualty_card_id") REFERENCES "casualty_cards" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE casualty_card_vital_signs ALTER COLUMN id SET DEFAULT gen_random_uuid();
