-- Main emergency-department triage-note record: the first-contact triage
-- assessment for a single patient. Captures arrival and context,
-- presenting complaint and brief history, the triage vital signs (the
-- NEWS2 inputs), a pain score, and the Manchester Triage System
-- discriminator flags. The computed classification (NEWS2 aggregate,
-- priority level, colour, name, and target time), the audit trail of
-- fired rules, and the red-flag issues live in dedicated child tables.
-- This is a classification record, not a summed score. Raw numeric
-- observations use NULL when a measurement was not recorded; text and
-- enum fields default to the empty string.

CREATE TABLE emergency_department_triage_note (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    patient_id UUID NOT NULL REFERENCES patient(id) ON DELETE RESTRICT,
    clinician_id UUID REFERENCES clinician(id) ON DELETE RESTRICT,

    status VARCHAR(20) NOT NULL DEFAULT 'draft'
        CHECK (status IN ('draft', 'submitted', 'amended', 'signed')),

    -- Context and arrival
    nurse_name TEXT NOT NULL DEFAULT '',
    triaged_at TIMESTAMPTZ,
    care_setting VARCHAR(30) NOT NULL DEFAULT ''
        CHECK (care_setting IN ('emergency-department', 'urgent-treatment-centre', 'minor-injuries-unit', '')),
    arrival_mode VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (arrival_mode IN ('walk-in', 'ambulance', 'other', '')),
    arrived_at TIMESTAMPTZ,
    referral_source TEXT NOT NULL DEFAULT '',

    -- Identification
    patient_identifier TEXT NOT NULL DEFAULT '',
    age_band VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (age_band IN ('paediatric', 'adult', 'older-adult', '')),

    -- Presenting complaint
    presenting_complaint TEXT NOT NULL DEFAULT '',
    brief_history TEXT NOT NULL DEFAULT '',
    symptom_onset TEXT NOT NULL DEFAULT '',

    -- Vital signs (NEWS2 inputs)
    respiratory_rate INTEGER,
    spo2 INTEGER,
    on_oxygen VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (on_oxygen IN ('air', 'oxygen', '')),
    systolic_bp INTEGER,
    pulse INTEGER,
    consciousness_acvpu VARCHAR(1) NOT NULL DEFAULT ''
        CHECK (consciousness_acvpu IN ('A', 'C', 'V', 'P', 'U', '')),
    temperature NUMERIC(4,1),
    glasgow_coma_scale INTEGER
        CHECK (glasgow_coma_scale IS NULL OR glasgow_coma_scale BETWEEN 3 AND 15),
    pain_score INTEGER
        CHECK (pain_score IS NULL OR pain_score BETWEEN 0 AND 10),

    -- Discriminator flags (Manchester Triage System)
    airway_threat VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (airway_threat IN ('yes', 'no', '')),
    breathing_inadequate VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (breathing_inadequate IN ('yes', 'no', '')),
    circulation_shock VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (circulation_shock IN ('yes', 'no', '')),
    haemorrhage_major VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (haemorrhage_major IN ('yes', 'no', '')),
    consciousness_reduced VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (consciousness_reduced IN ('yes', 'no', '')),
    seizure_active VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (seizure_active IN ('yes', 'no', '')),
    focal_neurology VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (focal_neurology IN ('yes', 'no', '')),
    sepsis_features VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (sepsis_features IN ('yes', 'no', '')),
    chest_pain_cardiac VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (chest_pain_cardiac IN ('yes', 'no', '')),
    stroke_features VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (stroke_features IN ('yes', 'no', '')),
    paediatric_red_flag VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (paediatric_red_flag IN ('yes', 'no', '')),

    clinical_notes TEXT NOT NULL DEFAULT ''
);

CREATE INDEX emergency_department_triage_note_patient_id_idx
    ON emergency_department_triage_note (patient_id);
CREATE INDEX emergency_department_triage_note_clinician_id_idx
    ON emergency_department_triage_note (clinician_id);

CREATE TRIGGER trigger_emergency_department_triage_note_updated_at
    BEFORE UPDATE ON emergency_department_triage_note
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE emergency_department_triage_note IS
    'Main emergency-department triage-note record: arrival and context, presenting complaint and brief history, triage vital signs (NEWS2 inputs), pain score, and Manchester Triage System discriminator flags. The classification result, fired rules, and red-flag issues live in child tables.';
COMMENT ON COLUMN emergency_department_triage_note.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN emergency_department_triage_note.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN emergency_department_triage_note.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN emergency_department_triage_note.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN emergency_department_triage_note.patient_id IS
    'Foreign key to the patient being triaged (RESTRICT: patients are not deleted while triage notes exist).';
COMMENT ON COLUMN emergency_department_triage_note.clinician_id IS
    'Foreign key to the triaging clinician (RESTRICT); NULL until assigned.';
COMMENT ON COLUMN emergency_department_triage_note.status IS
    'Workflow status: draft, submitted, amended, or signed.';
COMMENT ON COLUMN emergency_department_triage_note.nurse_name IS
    'Name of the triage nurse or clinician who performed the assessment.';
COMMENT ON COLUMN emergency_department_triage_note.triaged_at IS
    'Date and time the triage assessment was performed; NULL when not yet recorded.';
COMMENT ON COLUMN emergency_department_triage_note.care_setting IS
    'Care setting: emergency-department, urgent-treatment-centre, or minor-injuries-unit.';
COMMENT ON COLUMN emergency_department_triage_note.arrival_mode IS
    'Mode of arrival: walk-in, ambulance, or other.';
COMMENT ON COLUMN emergency_department_triage_note.arrived_at IS
    'Date and time the patient arrived; NULL when not recorded.';
COMMENT ON COLUMN emergency_department_triage_note.referral_source IS
    'Referral source (e.g. self, GP, ambulance service, other).';
COMMENT ON COLUMN emergency_department_triage_note.patient_identifier IS
    'Local patient identifier as recorded at triage.';
COMMENT ON COLUMN emergency_department_triage_note.age_band IS
    'Age band: paediatric, adult, or older-adult.';
COMMENT ON COLUMN emergency_department_triage_note.presenting_complaint IS
    'Chief presenting complaint in the patient''s or clinician''s words.';
COMMENT ON COLUMN emergency_department_triage_note.brief_history IS
    'Relevant brief history accompanying the presenting complaint.';
COMMENT ON COLUMN emergency_department_triage_note.symptom_onset IS
    'Timing of symptom onset (free text).';
COMMENT ON COLUMN emergency_department_triage_note.respiratory_rate IS
    'Respiration rate in breaths per minute; NULL when not recorded.';
COMMENT ON COLUMN emergency_department_triage_note.spo2 IS
    'Oxygen saturation as a percentage (SpO2); NULL when not recorded.';
COMMENT ON COLUMN emergency_department_triage_note.on_oxygen IS
    'Whether the patient is breathing air or receiving supplemental oxygen (NEWS2 +2 when oxygen).';
COMMENT ON COLUMN emergency_department_triage_note.systolic_bp IS
    'Systolic blood pressure in mmHg; NULL when not recorded.';
COMMENT ON COLUMN emergency_department_triage_note.pulse IS
    'Pulse rate in beats per minute; NULL when not recorded.';
COMMENT ON COLUMN emergency_department_triage_note.consciousness_acvpu IS
    'Consciousness level on the ACVPU scale: A (alert), C (new confusion), V (voice), P (pain), U (unresponsive).';
COMMENT ON COLUMN emergency_department_triage_note.temperature IS
    'Body temperature in degrees Celsius; NULL when not recorded.';
COMMENT ON COLUMN emergency_department_triage_note.glasgow_coma_scale IS
    'Optional Glasgow Coma Scale total (3-15) as a supporting disability finding; NULL when not recorded.';
COMMENT ON COLUMN emergency_department_triage_note.pain_score IS
    'Pain score (0-10) used as a pain discriminator; NULL when not recorded.';
COMMENT ON COLUMN emergency_department_triage_note.airway_threat IS
    'Discriminator: threat to the airway (Level-1 immediate).';
COMMENT ON COLUMN emergency_department_triage_note.breathing_inadequate IS
    'Discriminator: severely inadequate breathing (Level-1 immediate).';
COMMENT ON COLUMN emergency_department_triage_note.circulation_shock IS
    'Discriminator: shock or circulatory compromise (Level-1 immediate).';
COMMENT ON COLUMN emergency_department_triage_note.haemorrhage_major IS
    'Discriminator: major or catastrophic haemorrhage (Level-1 immediate).';
COMMENT ON COLUMN emergency_department_triage_note.consciousness_reduced IS
    'Discriminator: reduced consciousness responding to voice or pain (Level-2 very urgent).';
COMMENT ON COLUMN emergency_department_triage_note.seizure_active IS
    'Discriminator: active seizure (Level-1 immediate).';
COMMENT ON COLUMN emergency_department_triage_note.focal_neurology IS
    'Discriminator: acute focal neurological deficit (Level-2 very urgent).';
COMMENT ON COLUMN emergency_department_triage_note.sepsis_features IS
    'Discriminator: features suggestive of sepsis (Level-2 very urgent; sepsis screen).';
COMMENT ON COLUMN emergency_department_triage_note.chest_pain_cardiac IS
    'Discriminator: chest pain of possible cardiac origin (Level-2 very urgent; time-critical).';
COMMENT ON COLUMN emergency_department_triage_note.stroke_features IS
    'Discriminator: features suggestive of acute stroke (Level-2 very urgent; time-critical).';
COMMENT ON COLUMN emergency_department_triage_note.paediatric_red_flag IS
    'Discriminator: paediatric red flag (Level-2 very urgent; time-critical).';
COMMENT ON COLUMN emergency_department_triage_note.clinical_notes IS
    'Free-text clinical notes accompanying the triage assessment.';
