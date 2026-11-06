CREATE TABLE IF NOT EXISTS "audit_c_grades" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "total_score" integer NULL,
    "risk_band" varchar NOT NULL DEFAULT '',
    "positive_screen" varchar NOT NULL DEFAULT '',
    "graded_at" timestamp with time zone NOT NULL,
    "audit_c_id" uuid NOT NULL,
    CONSTRAINT "fk-audit_c_grades-audit_c_id-to-audit_cs" FOREIGN KEY ("audit_c_id") REFERENCES "audit_cs" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE audit_c_grades ALTER COLUMN id SET DEFAULT gen_random_uuid();
