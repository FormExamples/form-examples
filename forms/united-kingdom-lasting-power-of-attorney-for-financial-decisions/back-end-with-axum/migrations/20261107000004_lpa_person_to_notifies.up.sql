CREATE TABLE IF NOT EXISTS "lpa_person_to_notifies" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "lpa_id" uuid NOT NULL,
    "person_id" uuid NOT NULL,
    "ordinal" integer NOT NULL,
    CONSTRAINT "fk-lpa_person_to_notifies-lpa_id-to-lasting_power_of_attorneys" FOREIGN KEY ("lpa_id") REFERENCES "lasting_power_of_attorneys" (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "fk-lpa_person_to_notifies-person_id-to-people" FOREIGN KEY ("person_id") REFERENCES "people" (id) ON DELETE RESTRICT ON UPDATE CASCADE
);

ALTER TABLE lpa_person_to_notifies ALTER COLUMN id SET DEFAULT gen_random_uuid();
CREATE UNIQUE INDEX IF NOT EXISTS "index_lpa_person_to_notifies_0_unique" ON "lpa_person_to_notifies" ("lpa_id", "ordinal");
