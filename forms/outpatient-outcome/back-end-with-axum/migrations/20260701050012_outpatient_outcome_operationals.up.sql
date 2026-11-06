CREATE TABLE IF NOT EXISTS "outpatient_outcome_operationals" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "referral_date" date NULL,
    "appointment_date" date NULL,
    "wait_time_days" integer NULL,
    "service_target_days" integer NULL,
    "nhs_attendance_outcome" varchar NOT NULL DEFAULT '',
    "outpatient_outcome_id" uuid NOT NULL,
    CONSTRAINT "fk-outpatient_outcome_operationals-outpatient_outcome_id-to-outpatient_outcomes" FOREIGN KEY ("outpatient_outcome_id") REFERENCES "outpatient_outcomes" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE outpatient_outcome_operationals ALTER COLUMN id SET DEFAULT gen_random_uuid();
