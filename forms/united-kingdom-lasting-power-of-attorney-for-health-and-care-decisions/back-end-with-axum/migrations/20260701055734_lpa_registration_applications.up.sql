CREATE TABLE IF NOT EXISTS "lpa_registration_applications" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "applicant_role" varchar NOT NULL DEFAULT '',
    "applicant_signed_at" timestamp with time zone NULL,
    "fee_amount_pounds" double precision NOT NULL DEFAULT 0,
    "fee_remission" varchar NOT NULL DEFAULT '',
    "fee_remission_reason" varchar NOT NULL DEFAULT '',
    "submitted_at" timestamp with time zone NULL,
    "submission_channel" varchar NOT NULL DEFAULT '',
    "lpa_id" uuid NOT NULL,
    CONSTRAINT "fk-lpa_registration_applications-lpa_id-to-lpas" FOREIGN KEY ("lpa_id") REFERENCES "lpas" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE lpa_registration_applications ALTER COLUMN id SET DEFAULT gen_random_uuid();
