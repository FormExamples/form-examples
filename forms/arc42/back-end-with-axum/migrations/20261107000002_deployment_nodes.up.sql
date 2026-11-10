CREATE TABLE IF NOT EXISTS "deployment_nodes" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "arc42_documentation_id" uuid NOT NULL,
    "ordinal" integer NOT NULL DEFAULT 0,
    "environment" text NOT NULL DEFAULT '',
    "node_name" text NOT NULL DEFAULT '',
    "responsibility" text NOT NULL DEFAULT '',
    CONSTRAINT "fk-deployment_nodes-arc42_documentation_id-to-arc42_documentations" FOREIGN KEY ("arc42_documentation_id") REFERENCES "arc42_documentations" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE deployment_nodes ALTER COLUMN id SET DEFAULT gen_random_uuid();
