CREATE TABLE IF NOT EXISTS "arc42_documentations" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "author_name" text NOT NULL DEFAULT '',
    "author_role" text NOT NULL DEFAULT '',
    "document_date" date NULL,
    "introduction" text NOT NULL DEFAULT '',
    "business_context_description" text NOT NULL DEFAULT '',
    "technical_context_description" text NOT NULL DEFAULT '',
    "solution_strategy_summary" text NOT NULL DEFAULT '',
    "top_level_decomposition_summary" text NOT NULL DEFAULT '',
    "building_block_overview" text NOT NULL DEFAULT '',
    "runtime_overview" text NOT NULL DEFAULT '',
    "deployment_overview" text NOT NULL DEFAULT '',
    "crosscutting_overview" text NOT NULL DEFAULT '',
    "quality_tree_summary" text NOT NULL DEFAULT '',
    "recommendation" text NOT NULL DEFAULT '',
    "additional_notes" text NOT NULL DEFAULT '',
    "signed_by" text NOT NULL DEFAULT '',
    "signed_at" timestamp with time zone NULL,
    "architecture_id" uuid NOT NULL,
    CONSTRAINT "fk-arc42_documentations-architecture_id-to-architectures" FOREIGN KEY ("architecture_id") REFERENCES "architectures" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE arc42_documentations ALTER COLUMN id SET DEFAULT gen_random_uuid();
