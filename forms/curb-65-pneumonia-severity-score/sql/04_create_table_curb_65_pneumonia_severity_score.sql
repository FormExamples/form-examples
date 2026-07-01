-- Main CURB-65 pneumonia severity assessment record: assessment
-- context, patient identification, the five scored criterion inputs
-- (confusion, urea, respiratory rate, blood pressure, age), advisory
-- adjuncts, and the clinician disposition override. The computed grade,
-- fired rules, and flags live in dedicated child tables.

CREATE TABLE curb_65_pneumonia_severity_score (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    patient_id UUID NOT NULL REFERENCES patient(id) ON DELETE RESTRICT,
    clinician_id UUID REFERENCES clinician(id) ON DELETE RESTRICT,

    -- Step 1: assessment context
    clinician_name VARCHAR(255) NOT NULL DEFAULT '',
    clinician_role VARCHAR(40) NOT NULL DEFAULT '' CHECK (clinician_role IN ('physician', 'general-practitioner', 'advanced-nurse-practitioner', 'nurse', 'paramedic', 'pharmacist', 'other', '')),
    assessed_at TIMESTAMPTZ,
    care_setting VARCHAR(30) NOT NULL DEFAULT '' CHECK (care_setting IN ('primary-care', 'emergency-department', 'acute-medical-unit', 'ward', 'community', 'other', '')),

    -- Step 2: patient identification
    patient_identifier VARCHAR(100) NOT NULL DEFAULT '',
    sex VARCHAR(20) NOT NULL DEFAULT '' CHECK (sex IN ('female', 'male', 'intersex', 'unknown', '')),
    age_years INT,

    -- Step 3: Confusion (criterion C)
    confusion_present VARCHAR(10) NOT NULL DEFAULT '' CHECK (confusion_present IN ('yes', 'no', '')),
    amt_score INT,

    -- Step 4: Urea (criterion U) — urea_measured drives the CRB-65 fallback
    urea_measured VARCHAR(10) NOT NULL DEFAULT '' CHECK (urea_measured IN ('yes', 'no', '')),
    urea_mmol_l NUMERIC(5,1),

    -- Step 5: Respiratory rate (criterion R)
    respiratory_rate INT,

    -- Step 6: Blood pressure (criterion B)
    systolic_bp INT,
    diastolic_bp INT,

    -- Step 7: advisory adjuncts (recorded but not scored)
    oxygen_saturation INT,
    temperature_c NUMERIC(4,1),
    significant_comorbidity VARCHAR(10) NOT NULL DEFAULT '' CHECK (significant_comorbidity IN ('yes', 'no', '')),
    multilobar_changes VARCHAR(10) NOT NULL DEFAULT '' CHECK (multilobar_changes IN ('yes', 'no', '')),

    -- Step 8: clinician disposition override
    clinician_override_band VARCHAR(15) NOT NULL DEFAULT '' CHECK (clinician_override_band IN ('low', 'intermediate', 'high', '')),
    override_reason TEXT NOT NULL DEFAULT '',

    -- Step 9: clinician free-text note
    clinical_note TEXT NOT NULL DEFAULT ''
);

CREATE INDEX curb_65_pneumonia_severity_score_patient_id_idx
    ON curb_65_pneumonia_severity_score (patient_id);
CREATE INDEX curb_65_pneumonia_severity_score_clinician_id_idx
    ON curb_65_pneumonia_severity_score (clinician_id);

CREATE TRIGGER trigger_curb_65_pneumonia_severity_score_updated_at
    BEFORE UPDATE ON curb_65_pneumonia_severity_score
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE curb_65_pneumonia_severity_score IS
    'Main CURB-65 pneumonia severity assessment record: assessment context, patient identification, the five scored criterion inputs (confusion, urea, respiratory rate, blood pressure, age), advisory adjuncts, and the clinician disposition override.';
COMMENT ON COLUMN curb_65_pneumonia_severity_score.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN curb_65_pneumonia_severity_score.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN curb_65_pneumonia_severity_score.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN curb_65_pneumonia_severity_score.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN curb_65_pneumonia_severity_score.patient_id IS
    'Foreign key to the patient being assessed (delete restricted).';
COMMENT ON COLUMN curb_65_pneumonia_severity_score.clinician_id IS
    'Foreign key to the assessing clinician (optional; delete restricted).';
COMMENT ON COLUMN curb_65_pneumonia_severity_score.clinician_name IS
    'Name of the assessing clinician as recorded on the assessment.';
COMMENT ON COLUMN curb_65_pneumonia_severity_score.clinician_role IS
    'Role of the assessing clinician: physician, general-practitioner, advanced-nurse-practitioner, nurse, paramedic, pharmacist, or other.';
COMMENT ON COLUMN curb_65_pneumonia_severity_score.assessed_at IS
    'Date and time the assessment was performed.';
COMMENT ON COLUMN curb_65_pneumonia_severity_score.care_setting IS
    'Care setting: primary-care, emergency-department, acute-medical-unit, ward, community, or other.';
COMMENT ON COLUMN curb_65_pneumonia_severity_score.patient_identifier IS
    'Local patient identifier as recorded on the assessment.';
COMMENT ON COLUMN curb_65_pneumonia_severity_score.sex IS
    'Patient sex recorded for the assessment: female, male, intersex, or unknown.';
COMMENT ON COLUMN curb_65_pneumonia_severity_score.age_years IS
    'Criterion A65 — patient age in years, derived from date of birth and confirmed at assessment; scores 1 when >= 65.';
COMMENT ON COLUMN curb_65_pneumonia_severity_score.confusion_present IS
    'Criterion C — whether new-onset confusion is present: yes, no, or unanswered.';
COMMENT ON COLUMN curb_65_pneumonia_severity_score.amt_score IS
    'Supporting evidence for confusion — Abbreviated Mental Test score (0-10); not scored directly.';
COMMENT ON COLUMN curb_65_pneumonia_severity_score.urea_measured IS
    'Whether serum urea was measured; when no, the four-criterion CRB-65 fallback is computed instead of CURB-65.';
COMMENT ON COLUMN curb_65_pneumonia_severity_score.urea_mmol_l IS
    'Criterion U — serum urea in millimoles per litre (mmol/L); scores 1 when > 7.';
COMMENT ON COLUMN curb_65_pneumonia_severity_score.respiratory_rate IS
    'Criterion R — respiratory rate in breaths per minute; scores 1 when >= 30.';
COMMENT ON COLUMN curb_65_pneumonia_severity_score.systolic_bp IS
    'Criterion B — systolic blood pressure in mmHg; scores 1 when < 90 (or diastolic <= 60).';
COMMENT ON COLUMN curb_65_pneumonia_severity_score.diastolic_bp IS
    'Criterion B — diastolic blood pressure in mmHg; scores 1 when <= 60 (or systolic < 90).';
COMMENT ON COLUMN curb_65_pneumonia_severity_score.oxygen_saturation IS
    'Advisory adjunct — peripheral oxygen saturation (SpO2) as a percentage; not scored, raises the hypoxia flag when < 92.';
COMMENT ON COLUMN curb_65_pneumonia_severity_score.temperature_c IS
    'Advisory adjunct — body temperature in degrees Celsius; not scored.';
COMMENT ON COLUMN curb_65_pneumonia_severity_score.significant_comorbidity IS
    'Advisory adjunct — whether a significant comorbidity is present: yes, no, or unanswered; not scored.';
COMMENT ON COLUMN curb_65_pneumonia_severity_score.multilobar_changes IS
    'Advisory adjunct — whether multilobar changes are present on chest imaging: yes, no, or unanswered; not scored.';
COMMENT ON COLUMN curb_65_pneumonia_severity_score.clinician_override_band IS
    'Optional clinician-set final risk band overriding the computed band: low, intermediate, or high.';
COMMENT ON COLUMN curb_65_pneumonia_severity_score.override_reason IS
    'Documented reason for the clinician disposition override (mandatory when an override band is set).';
COMMENT ON COLUMN curb_65_pneumonia_severity_score.clinical_note IS
    'Free-text clinical note recorded with the assessment.';
