CREATE TABLE IF NOT EXISTS "records_to_discloses" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "include_medical_health" varchar NOT NULL DEFAULT '',
    "medical_health_initials" varchar NOT NULL DEFAULT '',
    "include_mental_health" varchar NOT NULL DEFAULT '',
    "mental_health_initials" varchar NOT NULL DEFAULT '',
    "include_substance_use" varchar NOT NULL DEFAULT '',
    "substance_use_initials" varchar NOT NULL DEFAULT '',
    "part2_redisclosure_notice_included" varchar NOT NULL DEFAULT '',
    "include_hiv_aids" varchar NOT NULL DEFAULT '',
    "hiv_aids_initials" varchar NOT NULL DEFAULT '',
    "hiv_aids_state_consent_included" varchar NOT NULL DEFAULT '',
    "include_psychotherapy_notes" varchar NOT NULL DEFAULT '',
    "include_genetic_information" varchar NOT NULL DEFAULT '',
    "include_reproductive_health" varchar NOT NULL DEFAULT '',
    "section_7332_notice_included" varchar NOT NULL DEFAULT '',
    "date_range_specified" varchar NOT NULL DEFAULT '',
    "date_from" date NULL,
    "date_to" date NULL,
    "other_description" text NOT NULL DEFAULT '',
    "hipaa_authorization_id" uuid NOT NULL,
    CONSTRAINT "fk-records_to_discloses-hipaa_authorization_id-to-hipaa_authorizations" FOREIGN KEY ("hipaa_authorization_id") REFERENCES "hipaa_authorizations" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE records_to_discloses ALTER COLUMN id SET DEFAULT gen_random_uuid();
