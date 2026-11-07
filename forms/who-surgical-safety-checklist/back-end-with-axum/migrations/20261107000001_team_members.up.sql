CREATE TABLE IF NOT EXISTS "team_members" (
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" uuid PRIMARY KEY,
    "deleted_at" timestamp with time zone NULL,
    "checklist_id" uuid NOT NULL,
    "clinician_id" uuid NULL,
    "name" varchar NOT NULL DEFAULT '',
    "role" varchar NOT NULL DEFAULT '',
    "introduced_during_time_out" varchar NOT NULL DEFAULT '',
    "notes" varchar NOT NULL DEFAULT '',
    CONSTRAINT "fk-team_members-checklist_id-to-who_surgical_safety_checklists" FOREIGN KEY ("checklist_id") REFERENCES "who_surgical_safety_checklists" (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "fk-team_members-clinician_id-to-clinicians" FOREIGN KEY ("clinician_id") REFERENCES "clinicians" (id) ON DELETE RESTRICT ON UPDATE CASCADE
);

ALTER TABLE team_members ALTER COLUMN id SET DEFAULT gen_random_uuid();
