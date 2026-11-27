CREATE TABLE IF NOT EXISTS "hsct_hla_typing_request_grade_rules" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "grade_id" uuid NOT NULL,
    "rule_id" varchar NOT NULL,
    "axis" varchar NOT NULL DEFAULT '',
    "category" varchar NOT NULL DEFAULT '',
    "description" varchar NOT NULL DEFAULT '',
    CONSTRAINT "fk-1d5ac8b085a5834b966ed7ee2979ec40" FOREIGN KEY ("grade_id") REFERENCES "hsct_hla_typing_request_grades" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE hsct_hla_typing_request_grade_rules ALTER COLUMN id SET DEFAULT gen_random_uuid();
