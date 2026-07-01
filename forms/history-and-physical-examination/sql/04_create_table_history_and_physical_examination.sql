-- Main history-and-physical-examination (H&P) clerking record: one
-- comprehensive clerking and admission document capturing the full history
-- (presenting complaint, history of presenting complaint, past
-- medical/surgical history, drug history and allergies, family history,
-- social history, systems review) and physical examination (vital signs
-- and examination by body system), plus investigations, an impression /
-- problem list, and a management plan, alongside encounter context and
-- patient / clinician identification. The completeness grade, the audit
-- trail of fired grading rules, and the safety flags live in dedicated
-- child tables. All clinical content is free text; presence of a
-- component is detected by a non-empty field, not by semantic analysis.

CREATE TABLE history_and_physical_examination (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    patient_id UUID NOT NULL REFERENCES patient(id) ON DELETE RESTRICT,
    clinician_id UUID REFERENCES clinician(id) ON DELETE RESTRICT,

    -- Encounter context and identification
    clerked_at TIMESTAMPTZ,
    clinician_role VARCHAR(30) NOT NULL DEFAULT '' CHECK (clinician_role IN ('doctor', 'acp', 'physician-associate', 'other', '')),
    registration_number VARCHAR(50) NOT NULL DEFAULT '',
    care_setting VARCHAR(30) NOT NULL DEFAULT '' CHECK (care_setting IN ('emergency-department', 'acute-medical-unit', 'ward', 'other', '')),
    admission_source VARCHAR(20) NOT NULL DEFAULT '' CHECK (admission_source IN ('self', 'gp', 'ambulance', 'transfer', 'other', '')),
    patient_identifier VARCHAR(100) NOT NULL DEFAULT '',
    age_band VARCHAR(20) NOT NULL DEFAULT '' CHECK (age_band IN ('18-39', '40-64', '65-79', '80-plus', '')),
    sex VARCHAR(20) NOT NULL DEFAULT '' CHECK (sex IN ('female', 'male', 'intersex', 'unknown', '')),

    -- History
    presenting_complaint TEXT NOT NULL DEFAULT '',
    history_of_presenting_complaint TEXT NOT NULL DEFAULT '',
    past_medical_surgical_history TEXT NOT NULL DEFAULT '',
    drug_history TEXT NOT NULL DEFAULT '',
    allergy_status VARCHAR(20) NOT NULL DEFAULT '' CHECK (allergy_status IN ('none-known', 'has-allergies', 'not-documented', '')),
    allergy_detail TEXT NOT NULL DEFAULT '',
    family_history TEXT NOT NULL DEFAULT '',
    social_history TEXT NOT NULL DEFAULT '',
    systems_review TEXT NOT NULL DEFAULT '',

    -- Vital signs (numeric; null when not measured)
    temperature NUMERIC(4,1),
    heart_rate INTEGER,
    respiratory_rate INTEGER,
    systolic_blood_pressure INTEGER,
    oxygen_saturation INTEGER,
    consciousness_level VARCHAR(15) NOT NULL DEFAULT '' CHECK (consciousness_level IN ('alert', 'voice', 'pain', 'unresponsive', '')),

    -- Examination by system, investigations, and plan
    exam_cardiovascular TEXT NOT NULL DEFAULT '',
    exam_respiratory TEXT NOT NULL DEFAULT '',
    exam_abdominal TEXT NOT NULL DEFAULT '',
    exam_neurological TEXT NOT NULL DEFAULT '',
    exam_other TEXT NOT NULL DEFAULT '',
    investigations TEXT NOT NULL DEFAULT '',
    impression TEXT NOT NULL DEFAULT '',
    red_flag_findings TEXT NOT NULL DEFAULT '',
    management_plan TEXT NOT NULL DEFAULT '',

    -- Free-text narrative
    clinical_note TEXT NOT NULL DEFAULT ''
);

CREATE INDEX history_and_physical_examination_patient_id_idx
    ON history_and_physical_examination (patient_id);
CREATE INDEX history_and_physical_examination_clinician_id_idx
    ON history_and_physical_examination (clinician_id);

CREATE TRIGGER trigger_history_and_physical_examination_updated_at
    BEFORE UPDATE ON history_and_physical_examination
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE history_and_physical_examination IS
    'Main H&P clerking record for one patient encounter: encounter context, patient and clinician identification, the full history, vital signs, examination by body system, investigations, impression, and management plan as free text. Completeness grade, fired rules, and flags live in child tables.';
COMMENT ON COLUMN history_and_physical_examination.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN history_and_physical_examination.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN history_and_physical_examination.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN history_and_physical_examination.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN history_and_physical_examination.patient_id IS
    'Foreign key to the patient this clerking documents (restrict delete).';
COMMENT ON COLUMN history_and_physical_examination.clinician_id IS
    'Foreign key to the clerking clinician (restrict delete); optional.';
COMMENT ON COLUMN history_and_physical_examination.clerked_at IS
    'Date and time of clerking.';
COMMENT ON COLUMN history_and_physical_examination.clinician_role IS
    'Clerking clinician role: doctor, acp, physician-associate, or other.';
COMMENT ON COLUMN history_and_physical_examination.registration_number IS
    'Clerking clinician professional registration number (GMC / NMC / HCPC).';
COMMENT ON COLUMN history_and_physical_examination.care_setting IS
    'Care setting: emergency-department, acute-medical-unit, ward, or other.';
COMMENT ON COLUMN history_and_physical_examination.admission_source IS
    'Admission source: self, gp, ambulance, transfer, or other.';
COMMENT ON COLUMN history_and_physical_examination.patient_identifier IS
    'Local patient or encounter identifier as recorded on the clerking.';
COMMENT ON COLUMN history_and_physical_examination.age_band IS
    'Adult age band: 18-39, 40-64, 65-79, or 80-plus.';
COMMENT ON COLUMN history_and_physical_examination.sex IS
    'Patient sex recorded for clinical purposes: female, male, intersex, or unknown.';
COMMENT ON COLUMN history_and_physical_examination.presenting_complaint IS
    'History: the presenting complaint (required component).';
COMMENT ON COLUMN history_and_physical_examination.history_of_presenting_complaint IS
    'History: the history of the presenting complaint (required component).';
COMMENT ON COLUMN history_and_physical_examination.past_medical_surgical_history IS
    'History: past medical and surgical history, or an explicit "nil" (required component).';
COMMENT ON COLUMN history_and_physical_examination.drug_history IS
    'History: current medications / drug history (required component).';
COMMENT ON COLUMN history_and_physical_examination.allergy_status IS
    'Allergy status: none-known, has-allergies, or not-documented; not-documented (or empty) is a blocking flag.';
COMMENT ON COLUMN history_and_physical_examination.allergy_detail IS
    'Allergy detail: reactions recorded when allergy_status is has-allergies.';
COMMENT ON COLUMN history_and_physical_examination.family_history IS
    'History: family history, or an explicit "nil" (optional component).';
COMMENT ON COLUMN history_and_physical_examination.social_history IS
    'History: social history — smoking, alcohol, occupation, living situation (required component).';
COMMENT ON COLUMN history_and_physical_examination.systems_review IS
    'History: systems review narrative or structured findings (required component).';
COMMENT ON COLUMN history_and_physical_examination.temperature IS
    'Vital sign: temperature in degrees Celsius; normal range 36.1-38.0. Null when not measured.';
COMMENT ON COLUMN history_and_physical_examination.heart_rate IS
    'Vital sign: heart rate in beats per minute; normal range 51-90. Null when not measured.';
COMMENT ON COLUMN history_and_physical_examination.respiratory_rate IS
    'Vital sign: respiratory rate in breaths per minute; normal range 12-20. Null when not measured.';
COMMENT ON COLUMN history_and_physical_examination.systolic_blood_pressure IS
    'Vital sign: systolic blood pressure in mmHg; normal range 111-219. Null when not measured.';
COMMENT ON COLUMN history_and_physical_examination.oxygen_saturation IS
    'Vital sign: oxygen saturation as a percentage; normal >= 96. Null when not measured.';
COMMENT ON COLUMN history_and_physical_examination.consciousness_level IS
    'Vital sign: consciousness level (AVPU) — alert, voice, pain, or unresponsive; anything other than alert is flagged.';
COMMENT ON COLUMN history_and_physical_examination.exam_cardiovascular IS
    'Examination: cardiovascular system findings, or explicit "deferred" (core system).';
COMMENT ON COLUMN history_and_physical_examination.exam_respiratory IS
    'Examination: respiratory system findings, or explicit "deferred" (core system).';
COMMENT ON COLUMN history_and_physical_examination.exam_abdominal IS
    'Examination: abdominal system findings, or explicit "deferred" (core system).';
COMMENT ON COLUMN history_and_physical_examination.exam_neurological IS
    'Examination: neurological system findings, or explicit "deferred" (core system).';
COMMENT ON COLUMN history_and_physical_examination.exam_other IS
    'Examination: other systems / general inspection findings (optional).';
COMMENT ON COLUMN history_and_physical_examination.investigations IS
    'Investigations: bedside, laboratory, and imaging results (optional).';
COMMENT ON COLUMN history_and_physical_examination.impression IS
    'Working impression / problem list (required component).';
COMMENT ON COLUMN history_and_physical_examination.red_flag_findings IS
    'Red-flag examination or history findings; drives the red-flag-no-plan flag.';
COMMENT ON COLUMN history_and_physical_examination.management_plan IS
    'Management plan: treatment, referrals, escalation, disposition (required component).';
COMMENT ON COLUMN history_and_physical_examination.clinical_note IS
    'Optional free-text narrative shown in the summary.';
