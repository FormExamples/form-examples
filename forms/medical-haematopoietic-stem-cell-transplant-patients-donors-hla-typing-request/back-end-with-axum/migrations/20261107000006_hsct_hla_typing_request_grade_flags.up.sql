CREATE TABLE IF NOT EXISTS "hsct_hla_typing_request_grade_flags" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "grade_id" uuid NOT NULL,
    "flag_id" varchar NOT NULL,
    "category" varchar NOT NULL DEFAULT '',
    "priority" varchar NOT NULL DEFAULT '',
    "description" varchar NOT NULL DEFAULT '',
    "suggested_action" varchar NOT NULL DEFAULT '',
    CONSTRAINT "fk-2346aebab54886c2b8d62dd70c8af714" FOREIGN KEY ("grade_id") REFERENCES "hsct_hla_typing_request_grades" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE hsct_hla_typing_request_grade_flags ALTER COLUMN id SET DEFAULT gen_random_uuid();
