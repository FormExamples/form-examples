-- Hematology waiting list card: the top-level record placing a patient on a list.

CREATE TABLE hematology_waiting_list_card (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    patient_id UUID NOT NULL
        REFERENCES patient(id) ON DELETE CASCADE,
    practitioner_id UUID NOT NULL
        REFERENCES practitioner(id) ON DELETE CASCADE,

    -- Lifecycle
    status VARCHAR(20) NOT NULL DEFAULT 'draft'
        CHECK (status IN ('draft', 'submitted', 'reviewed', 'closed')),
    entry_date DATE,
    entry_time TIME,

    -- Step 3 — referral details
    referral_source VARCHAR(30) NOT NULL DEFAULT ''
        CHECK (referral_source IN (
            'gp',
            'consultant',
            'a-and-e',
            'self',
            'community',
            'screening',
            'other',
            ''
        )),
    referral_date DATE,
    referral_letter_reference VARCHAR(100) NOT NULL DEFAULT '',
    reason_for_referral TEXT NOT NULL DEFAULT '',
    presenting_condition TEXT NOT NULL DEFAULT '',
    icd_10_code VARCHAR(20) NOT NULL DEFAULT '',
    snomed_ct_code VARCHAR(30) NOT NULL DEFAULT '',
    suspected_cancer VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (suspected_cancer IN ('yes', 'no', '')),

    -- Step 4 — waiting list entry
    list_name VARCHAR(255) NOT NULL DEFAULT '',
    specialty VARCHAR(100) NOT NULL DEFAULT '',
    sub_specialty VARCHAR(100) NOT NULL DEFAULT '',
    procedure_description TEXT NOT NULL DEFAULT '',
    opcs_4_code VARCHAR(20) NOT NULL DEFAULT '',
    clinical_priority VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (clinical_priority IN ('P1a', 'P1b', 'P2', 'P3', 'P4', 'P5', 'P6', '')),
    rtt_clock_start_date DATE,
    expected_procedure_type VARCHAR(40) NOT NULL DEFAULT ''
        CHECK (expected_procedure_type IN (
            'first-outpatient-appointment',
            'follow-up-appointment',
            'day-case-procedure',
            'inpatient-procedure',
            'diagnostic',
            'therapy',
            'multi-disciplinary-team-review',
            'other',
            ''
        )),
    expected_wait_weeks INTEGER
        CHECK (expected_wait_weeks IS NULL OR expected_wait_weeks BETWEEN 0 AND 260),

    -- Step 6 — patient communication
    consent_to_reminders VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (consent_to_reminders IN ('yes', 'no', '')),
    communication_notes TEXT NOT NULL DEFAULT '',

    -- Step 7 — sign-off
    additional_notes TEXT NOT NULL DEFAULT '',
    signed_at TIMESTAMPTZ
);

CREATE TRIGGER trigger_hematology_waiting_list_card_updated_at
    BEFORE UPDATE ON hematology_waiting_list_card
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

CREATE INDEX index_hematology_waiting_list_card_patient_id
    ON hematology_waiting_list_card(patient_id);

CREATE INDEX index_hematology_waiting_list_card_practitioner_id
    ON hematology_waiting_list_card(practitioner_id);

CREATE INDEX index_hematology_waiting_list_card_clock_start
    ON hematology_waiting_list_card(rtt_clock_start_date);

COMMENT ON TABLE hematology_waiting_list_card IS
    'Top-level record placing a patient on a hematology waiting list. Parent of appointment(s) and grading result.';
COMMENT ON COLUMN hematology_waiting_list_card.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN hematology_waiting_list_card.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN hematology_waiting_list_card.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN hematology_waiting_list_card.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN hematology_waiting_list_card.patient_id IS
    'Foreign key to the patient placed on the list.';
COMMENT ON COLUMN hematology_waiting_list_card.practitioner_id IS
    'Foreign key to the practitioner who placed the patient on the list.';
COMMENT ON COLUMN hematology_waiting_list_card.status IS
    'Lifecycle status: draft, submitted, reviewed, or closed.';
COMMENT ON COLUMN hematology_waiting_list_card.entry_date IS
    'Date the practitioner entered the card.';
COMMENT ON COLUMN hematology_waiting_list_card.entry_time IS
    'Time the practitioner entered the card.';
COMMENT ON COLUMN hematology_waiting_list_card.referral_source IS
    'Where the referral originated: gp, consultant, a-and-e, self, community, screening, other.';
COMMENT ON COLUMN hematology_waiting_list_card.referral_date IS
    'Date the referral was made.';
COMMENT ON COLUMN hematology_waiting_list_card.referral_letter_reference IS
    'Reference number / identifier for the originating referral letter.';
COMMENT ON COLUMN hematology_waiting_list_card.reason_for_referral IS
    'Free-text reason for referral.';
COMMENT ON COLUMN hematology_waiting_list_card.presenting_condition IS
    'Free-text presenting condition / clinical summary.';
COMMENT ON COLUMN hematology_waiting_list_card.icd_10_code IS
    'ICD-10 diagnostic code for the presenting condition.';
COMMENT ON COLUMN hematology_waiting_list_card.snomed_ct_code IS
    'SNOMED CT clinical concept code for the presenting condition.';
COMMENT ON COLUMN hematology_waiting_list_card.suspected_cancer IS
    'Whether this is a suspected-cancer (two-week wait) referral.';
COMMENT ON COLUMN hematology_waiting_list_card.list_name IS
    'Display name for the waiting list (e.g. "Orthopaedic — knee replacement").';
COMMENT ON COLUMN hematology_waiting_list_card.specialty IS
    'NHS specialty (e.g. "Trauma & Orthopaedics").';
COMMENT ON COLUMN hematology_waiting_list_card.sub_specialty IS
    'NHS sub-specialty (e.g. "Knee surgery").';
COMMENT ON COLUMN hematology_waiting_list_card.procedure_description IS
    'Plain-language description of what the patient is waiting to do.';
COMMENT ON COLUMN hematology_waiting_list_card.opcs_4_code IS
    'OPCS-4 procedure code if a specific procedure is planned.';
COMMENT ON COLUMN hematology_waiting_list_card.clinical_priority IS
    'NHS England clinical priority: P1a, P1b, P2, P3, P4, P5, P6.';
COMMENT ON COLUMN hematology_waiting_list_card.rtt_clock_start_date IS
    'Referral to Treatment (RTT) clock-start date. The date the patient joined the list.';
COMMENT ON COLUMN hematology_waiting_list_card.expected_procedure_type IS
    'Expected next event for the patient.';
COMMENT ON COLUMN hematology_waiting_list_card.expected_wait_weeks IS
    'Expected wait, in weeks, communicated to the patient at entry.';
COMMENT ON COLUMN hematology_waiting_list_card.consent_to_reminders IS
    'Whether the patient has consented to appointment reminders.';
COMMENT ON COLUMN hematology_waiting_list_card.communication_notes IS
    'Free-text communication preferences and notes.';
COMMENT ON COLUMN hematology_waiting_list_card.additional_notes IS
    'Free-text practitioner sign-off notes.';
COMMENT ON COLUMN hematology_waiting_list_card.signed_at IS
    'Timestamp of practitioner electronic signature.';
