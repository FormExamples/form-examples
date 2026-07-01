-- Main Glasgow-Blatchford Bleeding Score assessment record: assessment
-- context, patient identification, and the eight weighted admission
-- parameter inputs (blood urea, haemoglobin with sex-specific bands,
-- systolic blood pressure, pulse, melaena, syncope, hepatic disease,
-- cardiac failure). The computed grade, fired rules, and flags live in
-- dedicated child tables.

CREATE TABLE glasgow_blatchford_bleeding_score (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    patient_id UUID NOT NULL REFERENCES patient(id) ON DELETE RESTRICT,
    clinician_id UUID REFERENCES clinician(id) ON DELETE RESTRICT,

    -- Step 1: assessment context
    clinician_name VARCHAR(255) NOT NULL DEFAULT '',
    clinician_role VARCHAR(30) NOT NULL DEFAULT '' CHECK (clinician_role IN ('doctor', 'nurse', 'advanced-practitioner', 'other', '')),
    assessed_at TIMESTAMPTZ,
    care_setting VARCHAR(30) NOT NULL DEFAULT '' CHECK (care_setting IN ('emergency-department', 'acute-medical-unit', 'ward', 'other', '')),
    presenting_complaint VARCHAR(20) NOT NULL DEFAULT '' CHECK (presenting_complaint IN ('haematemesis', 'coffee-ground', 'melaena', 'other', '')),

    -- Step 2: patient identification
    patient_identifier VARCHAR(100) NOT NULL DEFAULT '',
    age_band VARCHAR(10) NOT NULL DEFAULT '' CHECK (age_band IN ('16-39', '40-59', '60-74', '75-plus', '')),
    sex VARCHAR(20) NOT NULL DEFAULT '' CHECK (sex IN ('female', 'male', 'intersex', 'unknown', '')),

    -- Step 3: blood urea (parameter 1)
    blood_urea_mmol_l NUMERIC(6,1),

    -- Step 4: haemoglobin (parameters 2/3 — sex-specific bands)
    haemoglobin_g_l NUMERIC(5,1),

    -- Step 5: systolic blood pressure (parameter 4)
    systolic_blood_pressure_mmhg INT,

    -- Step 6: pulse (parameter 5)
    pulse_beats_per_min INT,

    -- Step 7: melaena (parameter 6)
    melaena_present VARCHAR(5) NOT NULL DEFAULT '' CHECK (melaena_present IN ('yes', 'no', '')),

    -- Step 8: syncope (parameter 7)
    syncope VARCHAR(5) NOT NULL DEFAULT '' CHECK (syncope IN ('yes', 'no', '')),

    -- Step 9: hepatic disease (parameter 8)
    hepatic_disease VARCHAR(5) NOT NULL DEFAULT '' CHECK (hepatic_disease IN ('yes', 'no', '')),

    -- Step 10: cardiac failure (parameter 9)
    cardiac_failure VARCHAR(5) NOT NULL DEFAULT '' CHECK (cardiac_failure IN ('yes', 'no', '')),

    -- Step 11: clinician free-text context note
    clinical_note TEXT NOT NULL DEFAULT ''
);

CREATE INDEX glasgow_blatchford_bleeding_score_patient_id_idx
    ON glasgow_blatchford_bleeding_score (patient_id);
CREATE INDEX glasgow_blatchford_bleeding_score_clinician_id_idx
    ON glasgow_blatchford_bleeding_score (clinician_id);

CREATE TRIGGER trigger_glasgow_blatchford_bleeding_score_updated_at
    BEFORE UPDATE ON glasgow_blatchford_bleeding_score
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE glasgow_blatchford_bleeding_score IS
    'Main Glasgow-Blatchford Bleeding Score assessment record: assessment context, patient identification, and the eight weighted admission parameter inputs (blood urea, haemoglobin, systolic blood pressure, pulse, melaena, syncope, hepatic disease, cardiac failure).';
COMMENT ON COLUMN glasgow_blatchford_bleeding_score.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN glasgow_blatchford_bleeding_score.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN glasgow_blatchford_bleeding_score.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN glasgow_blatchford_bleeding_score.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN glasgow_blatchford_bleeding_score.patient_id IS
    'Foreign key to the patient being assessed (delete restricted).';
COMMENT ON COLUMN glasgow_blatchford_bleeding_score.clinician_id IS
    'Foreign key to the assessing clinician (optional; delete restricted).';
COMMENT ON COLUMN glasgow_blatchford_bleeding_score.clinician_name IS
    'Name of the assessing clinician as recorded on the assessment.';
COMMENT ON COLUMN glasgow_blatchford_bleeding_score.clinician_role IS
    'Role of the assessing clinician: doctor, nurse, advanced-practitioner, or other.';
COMMENT ON COLUMN glasgow_blatchford_bleeding_score.assessed_at IS
    'Date and time the assessment was performed.';
COMMENT ON COLUMN glasgow_blatchford_bleeding_score.care_setting IS
    'Care setting: emergency-department, acute-medical-unit, ward, or other.';
COMMENT ON COLUMN glasgow_blatchford_bleeding_score.presenting_complaint IS
    'Presenting complaint: haematemesis, coffee-ground (vomit), melaena, or other.';
COMMENT ON COLUMN glasgow_blatchford_bleeding_score.patient_identifier IS
    'Local patient identifier as recorded on the assessment.';
COMMENT ON COLUMN glasgow_blatchford_bleeding_score.age_band IS
    'Adult age band: 16-39, 40-59, 60-74, or 75-plus.';
COMMENT ON COLUMN glasgow_blatchford_bleeding_score.sex IS
    'Patient sex recorded for the assessment: female, male, intersex, or unknown. Selects the haemoglobin band table; unknown falls back to the female table.';
COMMENT ON COLUMN glasgow_blatchford_bleeding_score.blood_urea_mmol_l IS
    'Parameter 1 — measured blood urea in millimoles per litre (mmol/L).';
COMMENT ON COLUMN glasgow_blatchford_bleeding_score.haemoglobin_g_l IS
    'Parameters 2/3 — measured haemoglobin in grams per litre (g/L); scored against sex-specific bands.';
COMMENT ON COLUMN glasgow_blatchford_bleeding_score.systolic_blood_pressure_mmhg IS
    'Parameter 4 — measured systolic blood pressure in millimetres of mercury (mmHg).';
COMMENT ON COLUMN glasgow_blatchford_bleeding_score.pulse_beats_per_min IS
    'Parameter 5 — measured pulse rate in beats per minute.';
COMMENT ON COLUMN glasgow_blatchford_bleeding_score.melaena_present IS
    'Parameter 6 — melaena (black tarry stool) present: yes or no.';
COMMENT ON COLUMN glasgow_blatchford_bleeding_score.syncope IS
    'Parameter 7 — syncope (fainting) present: yes or no.';
COMMENT ON COLUMN glasgow_blatchford_bleeding_score.hepatic_disease IS
    'Parameter 8 — history of hepatic (liver) disease: yes or no.';
COMMENT ON COLUMN glasgow_blatchford_bleeding_score.cardiac_failure IS
    'Parameter 9 — history of cardiac failure: yes or no.';
COMMENT ON COLUMN glasgow_blatchford_bleeding_score.clinical_note IS
    'Free-text clinical context note recorded with the assessment.';
