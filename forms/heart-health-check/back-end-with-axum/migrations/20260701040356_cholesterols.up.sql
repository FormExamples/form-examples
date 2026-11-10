CREATE TABLE IF NOT EXISTS "cholesterols" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "total_cholesterol" double precision NULL,
    "hdl_cholesterol" double precision NULL,
    "total_hdl_ratio" double precision NULL,
    "on_statin" varchar NOT NULL DEFAULT '',
    "assessment_id" uuid NOT NULL,
    CONSTRAINT "fk-cholesterols-assessment_id-to-assessments" FOREIGN KEY ("assessment_id") REFERENCES "assessments" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE cholesterols ALTER COLUMN id SET DEFAULT gen_random_uuid();
