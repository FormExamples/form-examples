CREATE TABLE IF NOT EXISTS "architecture_decision_records" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "slug" varchar NOT NULL DEFAULT '',
    "number" integer NULL,
    "title" varchar NOT NULL,
    "decision_date" date NULL,
    "status" varchar NOT NULL DEFAULT 'pending',
    "decision_group" varchar NOT NULL DEFAULT '',
    "issue" text NOT NULL DEFAULT '',
    "decision" text NOT NULL DEFAULT '',
    "assumptions" text NOT NULL DEFAULT '',
    "constraints" text NOT NULL DEFAULT '',
    "argument" text NOT NULL DEFAULT '',
    "implications" text NOT NULL DEFAULT '',
    "related_decisions" text NOT NULL DEFAULT '',
    "related_requirements" text NOT NULL DEFAULT '',
    "related_artifacts" text NOT NULL DEFAULT '',
    "related_principles" text NOT NULL DEFAULT '',
    "signed_off_by" varchar NOT NULL DEFAULT '',
    "signed_off_at" timestamp with time zone NULL,
    "author_id" uuid NULL,
    "organization_id" uuid NULL,
    CONSTRAINT "fk-architecture_decision_records-author_id-to-authors" FOREIGN KEY ("author_id") REFERENCES "authors" (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "fk-architecture_decision_records-organization_id-to-organizations" FOREIGN KEY ("organization_id") REFERENCES "organizations" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE architecture_decision_records ALTER COLUMN id SET DEFAULT gen_random_uuid();
