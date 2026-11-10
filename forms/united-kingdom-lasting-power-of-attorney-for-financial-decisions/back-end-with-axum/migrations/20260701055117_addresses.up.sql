CREATE TABLE IF NOT EXISTS "addresses" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "address_line_1" text NOT NULL DEFAULT '',
    "address_line_2" text NOT NULL DEFAULT '',
    "address_line_3" text NOT NULL DEFAULT '',
    "postcode" text NOT NULL DEFAULT '',
    "country_as_iso_3166_1_alpha_2" text NOT NULL DEFAULT 'GB'
);

ALTER TABLE addresses ALTER COLUMN id SET DEFAULT gen_random_uuid();
