CREATE TABLE IF NOT EXISTS "lpa_person_to_notifies" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "order_position" integer NOT NULL,
    "lpa_id" uuid NOT NULL,
    "person_to_notify_id" uuid NOT NULL,
    CONSTRAINT "fk-lpa_person_to_notifies-lpa_id-to-lpas" FOREIGN KEY ("lpa_id") REFERENCES "lpas" (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "fk-lpa_person_to_notifies-person_to_notify_id-to-person_to_notifies" FOREIGN KEY ("person_to_notify_id") REFERENCES "person_to_notifies" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE lpa_person_to_notifies ALTER COLUMN id SET DEFAULT gen_random_uuid();
