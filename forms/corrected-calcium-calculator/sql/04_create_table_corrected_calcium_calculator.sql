-- Main corrected-calcium calculation record: context and identification,
-- plus the two measured calculation inputs (total calcium and albumin) and
-- the symptomatic flag. The computed corrected value, its classification,
-- fired rules, and safety flags live in dedicated child tables.

CREATE TABLE corrected_calcium_calculator (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    patient_id UUID NOT NULL REFERENCES patient(id) ON DELETE RESTRICT,
    clinician_id UUID REFERENCES clinician(id) ON DELETE RESTRICT,

    -- Context and identification
    clinician_name VARCHAR(255) NOT NULL DEFAULT '',
    clinician_role VARCHAR(20) NOT NULL DEFAULT '' CHECK (clinician_role IN ('doctor', 'nurse', 'pharmacist', 'laboratory-staff', 'other', '')),
    assessed_at TIMESTAMPTZ,
    care_setting VARCHAR(30) NOT NULL DEFAULT '' CHECK (care_setting IN ('general-practice', 'ward', 'emergency-department', 'outpatient', 'laboratory', 'other', '')),
    sample_reference VARCHAR(100) NOT NULL DEFAULT '',
    patient_identifier VARCHAR(100) NOT NULL DEFAULT '',
    age_band VARCHAR(20) NOT NULL DEFAULT '' CHECK (age_band IN ('18-39', '40-64', '65-74', '75-84', '85-plus', '')),
    sex VARCHAR(20) NOT NULL DEFAULT '' CHECK (sex IN ('female', 'male', 'intersex', 'unknown', '')),

    -- Calculation inputs
    total_calcium_mmol_l NUMERIC(4,2),
    albumin_g_l NUMERIC(5,2),
    symptomatic VARCHAR(5) NOT NULL DEFAULT '' CHECK (symptomatic IN ('yes', 'no', ''))
);

CREATE INDEX corrected_calcium_calculator_patient_id_idx
    ON corrected_calcium_calculator (patient_id);
CREATE INDEX corrected_calcium_calculator_clinician_id_idx
    ON corrected_calcium_calculator (clinician_id);

CREATE TRIGGER trigger_corrected_calcium_calculator_updated_at
    BEFORE UPDATE ON corrected_calcium_calculator
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE corrected_calcium_calculator IS
    'Main corrected-calcium calculation record: context and identification, plus the measured total calcium and albumin inputs and the symptomatic flag.';
COMMENT ON COLUMN corrected_calcium_calculator.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN corrected_calcium_calculator.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN corrected_calcium_calculator.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN corrected_calcium_calculator.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN corrected_calcium_calculator.patient_id IS
    'Foreign key to the patient this calculation is for (restricted delete).';
COMMENT ON COLUMN corrected_calcium_calculator.clinician_id IS
    'Foreign key to the clinician who recorded the calculation (optional, restricted delete).';
COMMENT ON COLUMN corrected_calcium_calculator.clinician_name IS
    'Assessing clinician name as recorded on the form.';
COMMENT ON COLUMN corrected_calcium_calculator.clinician_role IS
    'Assessing clinician role: doctor, nurse, pharmacist, laboratory-staff, or other.';
COMMENT ON COLUMN corrected_calcium_calculator.assessed_at IS
    'Date and time the calculation was assessed.';
COMMENT ON COLUMN corrected_calcium_calculator.care_setting IS
    'Care setting: general-practice, ward, emergency-department, outpatient, laboratory, or other.';
COMMENT ON COLUMN corrected_calcium_calculator.sample_reference IS
    'Sample or collection reference for the blood specimen.';
COMMENT ON COLUMN corrected_calcium_calculator.patient_identifier IS
    'Local patient identifier as recorded on the form.';
COMMENT ON COLUMN corrected_calcium_calculator.age_band IS
    'Adult age band: 18-39, 40-64, 65-74, 75-84, or 85-plus.';
COMMENT ON COLUMN corrected_calcium_calculator.sex IS
    'Patient sex recorded for clinical purposes: female, male, intersex, or unknown.';
COMMENT ON COLUMN corrected_calcium_calculator.total_calcium_mmol_l IS
    'Measured total serum calcium in mmol/L (null when unanswered).';
COMMENT ON COLUMN corrected_calcium_calculator.albumin_g_l IS
    'Measured serum albumin in g/L (null when unanswered).';
COMMENT ON COLUMN corrected_calcium_calculator.symptomatic IS
    'Whether calcium-related symptoms are present: yes or no.';
