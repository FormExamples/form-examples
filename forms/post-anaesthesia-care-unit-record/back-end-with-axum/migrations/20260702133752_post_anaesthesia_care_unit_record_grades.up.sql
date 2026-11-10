CREATE TABLE IF NOT EXISTS "post_anaesthesia_care_unit_record_grades" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "activity_score" integer NULL,
    "respiration_score" integer NULL,
    "circulation_score" integer NULL,
    "consciousness_score" integer NULL,
    "oxygen_saturation_score" integer NULL,
    "aldrete_total" integer NULL,
    "discharge_ready" varchar NOT NULL DEFAULT '',
    "padss_total" integer NULL,
    "padss_street_fit" varchar NOT NULL DEFAULT '',
    "graded_at" timestamp with time zone NOT NULL,
    "post_anaesthesia_care_unit_record_id" uuid NOT NULL,
    CONSTRAINT "fk-post_anaesthesia_care_unit_record_grades-post_anaesthesia_care_unit_record_id-to-post_anaesthesia_care_unit_records" FOREIGN KEY ("post_anaesthesia_care_unit_record_id") REFERENCES "post_anaesthesia_care_unit_records" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE post_anaesthesia_care_unit_record_grades ALTER COLUMN id SET DEFAULT gen_random_uuid();
