CREATE TABLE IF NOT EXISTS "anaesthetic_record_drug_administrations" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "drug_name" varchar NOT NULL DEFAULT '',
    "dose" double precision NULL,
    "dose_unit" varchar NOT NULL DEFAULT '',
    "route" varchar NOT NULL DEFAULT '',
    "category" varchar NOT NULL DEFAULT '',
    "administered_at" timestamp with time zone NULL,
    "anaesthetic_record_id" uuid NOT NULL,
    CONSTRAINT "fk-anaesthetic_record_drug_administrations-anaesthetic_record_id-to-anaesthetic_records" FOREIGN KEY ("anaesthetic_record_id") REFERENCES "anaesthetic_records" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE anaesthetic_record_drug_administrations ALTER COLUMN id SET DEFAULT gen_random_uuid();
