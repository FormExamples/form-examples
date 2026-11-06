CREATE TABLE IF NOT EXISTS "architectures" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "name" text NOT NULL DEFAULT '',
    "version" text NOT NULL DEFAULT '',
    "owner" text NOT NULL DEFAULT '',
    "status" text NOT NULL DEFAULT '',
    "description" text NOT NULL DEFAULT ''
);

ALTER TABLE architectures ALTER COLUMN id SET DEFAULT gen_random_uuid();
