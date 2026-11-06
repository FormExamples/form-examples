CREATE TABLE IF NOT EXISTS "authorized_recipients" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "recipient_name" varchar NOT NULL DEFAULT '',
    "recipient_organization" varchar NOT NULL DEFAULT '',
    "recipient_address" text NOT NULL DEFAULT '',
    "recipient_phone" varchar NOT NULL DEFAULT '',
    "recipient_email" varchar NOT NULL DEFAULT '',
    "recipient_role" varchar NOT NULL DEFAULT '',
    "release_form_id" uuid NOT NULL,
    CONSTRAINT "fk-authorized_recipients-release_form_id-to-release_forms" FOREIGN KEY ("release_form_id") REFERENCES "release_forms" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE authorized_recipients ALTER COLUMN id SET DEFAULT gen_random_uuid();
