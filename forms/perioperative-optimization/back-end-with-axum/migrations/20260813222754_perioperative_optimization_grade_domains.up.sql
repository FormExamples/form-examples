CREATE TABLE IF NOT EXISTS "perioperative_optimization_grade_domains" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "domain" varchar NOT NULL,
    "status" varchar NOT NULL DEFAULT '',
    "triggered" boolean NOT NULL DEFAULT false,
    "lead_time_weeks" integer NOT NULL DEFAULT 0,
    "weeks_shortfall" integer NULL,
    "rule_id" varchar NOT NULL DEFAULT '',
    "finding" varchar NOT NULL DEFAULT '',
    "intervention" varchar NOT NULL DEFAULT '',
    "intervention_started" boolean NOT NULL DEFAULT false,
    "referral_made" boolean NOT NULL DEFAULT false,
    "target_value" varchar NOT NULL DEFAULT '',
    "start_date" date NULL,
    "perioperative_optimization_grade_id" uuid NOT NULL,
    CONSTRAINT "fk-perioperative_optimization_grade_domains-perioperative_optimization_grade_id-to-perioperative_optimization_grades" FOREIGN KEY ("perioperative_optimization_grade_id") REFERENCES "perioperative_optimization_grades" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE perioperative_optimization_grade_domains ALTER COLUMN id SET DEFAULT gen_random_uuid();
