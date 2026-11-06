CREATE TABLE IF NOT EXISTS "casualty_card_clinical_examinations" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "general_appearance" text NOT NULL DEFAULT '',
    "head_and_face" text NOT NULL DEFAULT '',
    "neck" text NOT NULL DEFAULT '',
    "chest_cardiovascular" text NOT NULL DEFAULT '',
    "chest_respiratory" text NOT NULL DEFAULT '',
    "abdomen" text NOT NULL DEFAULT '',
    "pelvis" text NOT NULL DEFAULT '',
    "musculoskeletal_limbs" text NOT NULL DEFAULT '',
    "neurological" text NOT NULL DEFAULT '',
    "skin" text NOT NULL DEFAULT '',
    "mental_state" text NOT NULL DEFAULT '',
    "body_diagram_notes" text NOT NULL DEFAULT '',
    "casualty_card_id" uuid NOT NULL,
    CONSTRAINT "fk-casualty_card_clinical_examinations-casualty_card_id-to-casualty_cards" FOREIGN KEY ("casualty_card_id") REFERENCES "casualty_cards" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE casualty_card_clinical_examinations ALTER COLUMN id SET DEFAULT gen_random_uuid();
