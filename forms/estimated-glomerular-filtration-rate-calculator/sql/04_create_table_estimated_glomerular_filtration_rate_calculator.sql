-- Main eGFR calculation record: context and identification, plus the
-- calculation inputs (serum creatinine, age, sex, specimen date, and the
-- steady-state flag) and the chosen estimating equation. The computed eGFR,
-- its CKD G-stage classification, fired rules, and safety flags live in
-- dedicated child tables.

CREATE TABLE estimated_glomerular_filtration_rate_calculator (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    patient_id UUID NOT NULL REFERENCES patient(id) ON DELETE RESTRICT,
    clinician_id UUID REFERENCES clinician(id) ON DELETE RESTRICT,

    -- Context and identification
    clinician_name VARCHAR(255) NOT NULL DEFAULT '',
    clinician_role VARCHAR(20) NOT NULL DEFAULT '' CHECK (clinician_role IN ('doctor', 'nurse', 'pharmacist', 'laboratory', 'other', '')),
    assessed_at TIMESTAMPTZ,
    care_setting VARCHAR(20) NOT NULL DEFAULT '' CHECK (care_setting IN ('primary-care', 'secondary-care', 'laboratory', 'pharmacy', 'other', '')),
    equation VARCHAR(30) NOT NULL DEFAULT 'ckd-epi-2021-creatinine' CHECK (equation IN ('ckd-epi-2021-creatinine', 'ckd-epi-2021-cystatin-c', 'mdrd', '')),
    patient_identifier VARCHAR(100) NOT NULL DEFAULT '',

    -- Calculation inputs
    serum_creatinine_umol_l NUMERIC(6,1),
    age_years INT,
    sex VARCHAR(20) NOT NULL DEFAULT '' CHECK (sex IN ('female', 'male', '')),
    specimen_date DATE,
    steady_state VARCHAR(5) NOT NULL DEFAULT '' CHECK (steady_state IN ('yes', 'no', ''))
);

CREATE INDEX estimated_glomerular_filtration_rate_calculator_patient_id_idx
    ON estimated_glomerular_filtration_rate_calculator (patient_id);
CREATE INDEX estimated_glomerular_filtration_rate_calculator_clinician_id_idx
    ON estimated_glomerular_filtration_rate_calculator (clinician_id);

CREATE TRIGGER trigger_estimated_glomerular_filtration_rate_calculator_updated_at
    BEFORE UPDATE ON estimated_glomerular_filtration_rate_calculator
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE estimated_glomerular_filtration_rate_calculator IS
    'Main eGFR calculation record: context and identification, plus the serum creatinine, age, sex, specimen date, and steady-state inputs and the chosen estimating equation.';
COMMENT ON COLUMN estimated_glomerular_filtration_rate_calculator.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN estimated_glomerular_filtration_rate_calculator.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN estimated_glomerular_filtration_rate_calculator.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN estimated_glomerular_filtration_rate_calculator.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN estimated_glomerular_filtration_rate_calculator.patient_id IS
    'Foreign key to the patient this calculation is for (restricted delete).';
COMMENT ON COLUMN estimated_glomerular_filtration_rate_calculator.clinician_id IS
    'Foreign key to the clinician who recorded the calculation (optional, restricted delete).';
COMMENT ON COLUMN estimated_glomerular_filtration_rate_calculator.clinician_name IS
    'Requesting or interpreting clinician name as recorded on the form.';
COMMENT ON COLUMN estimated_glomerular_filtration_rate_calculator.clinician_role IS
    'Clinician role: doctor, nurse, pharmacist, laboratory, or other.';
COMMENT ON COLUMN estimated_glomerular_filtration_rate_calculator.assessed_at IS
    'Date and time the calculation was assessed.';
COMMENT ON COLUMN estimated_glomerular_filtration_rate_calculator.care_setting IS
    'Care setting: primary-care, secondary-care, laboratory, pharmacy, or other.';
COMMENT ON COLUMN estimated_glomerular_filtration_rate_calculator.equation IS
    'Estimating equation: ckd-epi-2021-creatinine (default), ckd-epi-2021-cystatin-c, or mdrd. The engine computes the CKD-EPI 2021 creatinine equation; the others are named for context.';
COMMENT ON COLUMN estimated_glomerular_filtration_rate_calculator.patient_identifier IS
    'Local patient identifier as recorded on the form.';
COMMENT ON COLUMN estimated_glomerular_filtration_rate_calculator.serum_creatinine_umol_l IS
    'Standardised (IDMS-traceable) serum creatinine in micromoles per litre (null when unanswered).';
COMMENT ON COLUMN estimated_glomerular_filtration_rate_calculator.age_years IS
    'Patient age in whole years (null when unanswered).';
COMMENT ON COLUMN estimated_glomerular_filtration_rate_calculator.sex IS
    'Patient sex driving the equation parameters (kappa, alpha, female multiplier): female or male.';
COMMENT ON COLUMN estimated_glomerular_filtration_rate_calculator.specimen_date IS
    'Date the serum creatinine specimen was taken (null when unanswered).';
COMMENT ON COLUMN estimated_glomerular_filtration_rate_calculator.steady_state IS
    'Whether renal function is at steady state: yes or no.';
