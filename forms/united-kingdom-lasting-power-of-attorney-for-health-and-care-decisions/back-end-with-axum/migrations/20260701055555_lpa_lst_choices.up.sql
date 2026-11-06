CREATE TABLE IF NOT EXISTS "lpa_lst_choices" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "lst_choice" varchar NOT NULL DEFAULT '',
    "donor_initialled" varchar NOT NULL DEFAULT '',
    "initialled_at" timestamp with time zone NULL,
    "lpa_id" uuid NOT NULL,
    CONSTRAINT "fk-lpa_lst_choices-lpa_id-to-lpas" FOREIGN KEY ("lpa_id") REFERENCES "lpas" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE lpa_lst_choices ALTER COLUMN id SET DEFAULT gen_random_uuid();
