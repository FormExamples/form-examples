CREATE TABLE IF NOT EXISTS "lasting_power_of_attorneys" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "decision_mode" text NOT NULL DEFAULT '',
    "decision_mode_mixed_text" text NOT NULL DEFAULT '',
    "when_attorneys_can_act" text NOT NULL DEFAULT '',
    "preferences_text" text NOT NULL DEFAULT '',
    "instructions_text" text NOT NULL DEFAULT '',
    "legal_rights_acknowledged" boolean NOT NULL DEFAULT false,
    "opg_reference_number" text NOT NULL DEFAULT '',
    "opg_registration_date" date NULL,
    "status" text NOT NULL DEFAULT '',
    "donor_person_id" uuid NOT NULL,
    CONSTRAINT "fk-lasting_power_of_attorneys-donor_person_id-to-people" FOREIGN KEY ("donor_person_id") REFERENCES "people" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE lasting_power_of_attorneys ALTER COLUMN id SET DEFAULT gen_random_uuid();
