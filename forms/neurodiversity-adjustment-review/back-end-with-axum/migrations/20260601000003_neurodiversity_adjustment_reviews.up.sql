CREATE TABLE IF NOT EXISTS "neurodiversity_adjustment_reviews" (
    "id" uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    "created_at" timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" timestamp with time zone NULL,
    "worker_id" uuid NOT NULL,
    "manager_id" uuid NOT NULL,
    "review_status" varchar NOT NULL DEFAULT 'draft',
    "response_reference" varchar NOT NULL DEFAULT '',
    "review_method" varchar NOT NULL DEFAULT '',
    "review_date" date NULL,
    "next_review_date" date NULL,
    "effectiveness_working_environment" varchar NOT NULL DEFAULT '',
    "effectiveness_equipment_technology" varchar NOT NULL DEFAULT '',
    "effectiveness_working_arrangements" varchar NOT NULL DEFAULT '',
    "effectiveness_communication" varchar NOT NULL DEFAULT '',
    "effectiveness_support_mentoring" varchar NOT NULL DEFAULT '',
    "effectiveness_recruitment_process" varchar NOT NULL DEFAULT '',
    "effectiveness_policy_dress" varchar NOT NULL DEFAULT '',
    "effectiveness_other" varchar NOT NULL DEFAULT '',
    "worker_feedback" varchar NOT NULL DEFAULT '',
    "worker_satisfied" varchar NOT NULL DEFAULT '',
    "wellbeing_change" varchar NOT NULL DEFAULT '',
    "barriers_detail" varchar NOT NULL DEFAULT '',
    "changes_needed" boolean NOT NULL DEFAULT false,
    "changes_detail" varchar NOT NULL DEFAULT '',
    "updated_adjustments_detail" varchar NOT NULL DEFAULT '',
    "occupational_health_rereferral" boolean NOT NULL DEFAULT false,
    "escalated" boolean NOT NULL DEFAULT false,
    "escalation_detail" varchar NOT NULL DEFAULT '',
    "notes" varchar NOT NULL DEFAULT '',
    CONSTRAINT "fk_neurodiversity_adjustment_reviews_worker_id" FOREIGN KEY ("worker_id") REFERENCES "workers" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "fk_neurodiversity_adjustment_reviews_manager_id" FOREIGN KEY ("manager_id") REFERENCES "managers" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "index_neurodiversity_adjustment_review_worker_id" ON "neurodiversity_adjustment_reviews" ("worker_id");

CREATE INDEX IF NOT EXISTS "index_neurodiversity_adjustment_review_manager_id" ON "neurodiversity_adjustment_reviews" ("manager_id");
