-- Main anion-gap calculation record: context and identification, plus the
-- electrolyte-panel inputs (sodium, chloride, bicarbonate, optional potassium)
-- and the optional albumin used for the correction. The computed anion gap,
-- its classification, fired rules, and safety flags live in child tables.

CREATE TABLE anion_gap_calculator (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    patient_id UUID NOT NULL REFERENCES patient(id) ON DELETE RESTRICT,
    clinician_id UUID REFERENCES clinician(id) ON DELETE RESTRICT,

    -- Context and identification
    clinician_name VARCHAR(255) NOT NULL DEFAULT '',
    clinician_role VARCHAR(20) NOT NULL DEFAULT '' CHECK (clinician_role IN ('doctor', 'nurse', 'scientist', 'pharmacist', 'other', '')),
    calculated_at TIMESTAMPTZ,
    care_setting VARCHAR(30) NOT NULL DEFAULT '' CHECK (care_setting IN ('emergency-department', 'ward', 'intensive-care', 'laboratory', 'other', '')),
    clinical_context TEXT NOT NULL DEFAULT '',
    patient_identifier VARCHAR(100) NOT NULL DEFAULT '',
    age_band VARCHAR(20) NOT NULL DEFAULT '' CHECK (age_band IN ('18-39', '40-64', '65-74', '75-84', '85-plus', '')),
    sex VARCHAR(20) NOT NULL DEFAULT '' CHECK (sex IN ('female', 'male', 'intersex', 'unknown', '')),

    -- Calculation inputs
    sodium_mmol_l NUMERIC(5,2),
    potassium_mmol_l NUMERIC(5,2),
    chloride_mmol_l NUMERIC(5,2),
    bicarbonate_mmol_l NUMERIC(5,2),
    albumin_g_l NUMERIC(5,2),
    include_potassium VARCHAR(5) NOT NULL DEFAULT '' CHECK (include_potassium IN ('yes', 'no', ''))
);

CREATE INDEX anion_gap_calculator_patient_id_idx
    ON anion_gap_calculator (patient_id);
CREATE INDEX anion_gap_calculator_clinician_id_idx
    ON anion_gap_calculator (clinician_id);

CREATE TRIGGER trigger_anion_gap_calculator_updated_at
    BEFORE UPDATE ON anion_gap_calculator
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE anion_gap_calculator IS
    'Main anion-gap calculation record: context and identification, plus the electrolyte-panel inputs (sodium, chloride, bicarbonate, optional potassium) and the optional albumin used for the correction.';
COMMENT ON COLUMN anion_gap_calculator.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN anion_gap_calculator.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN anion_gap_calculator.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN anion_gap_calculator.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN anion_gap_calculator.patient_id IS
    'Foreign key to the patient this calculation is for (restricted delete).';
COMMENT ON COLUMN anion_gap_calculator.clinician_id IS
    'Foreign key to the clinician who recorded the calculation (optional, restricted delete).';
COMMENT ON COLUMN anion_gap_calculator.clinician_name IS
    'Assessing clinician name as recorded on the form.';
COMMENT ON COLUMN anion_gap_calculator.clinician_role IS
    'Assessing clinician role: doctor, nurse, scientist, pharmacist, or other.';
COMMENT ON COLUMN anion_gap_calculator.calculated_at IS
    'Date and time the calculation was performed.';
COMMENT ON COLUMN anion_gap_calculator.care_setting IS
    'Care setting: emergency-department, ward, intensive-care, laboratory, or other.';
COMMENT ON COLUMN anion_gap_calculator.clinical_context IS
    'Free-text indication or clinical context for the calculation.';
COMMENT ON COLUMN anion_gap_calculator.patient_identifier IS
    'Local patient identifier as recorded on the form.';
COMMENT ON COLUMN anion_gap_calculator.age_band IS
    'Adult age band: 18-39, 40-64, 65-74, 75-84, or 85-plus.';
COMMENT ON COLUMN anion_gap_calculator.sex IS
    'Patient sex recorded for clinical purposes: female, male, intersex, or unknown.';
COMMENT ON COLUMN anion_gap_calculator.sodium_mmol_l IS
    'Serum sodium in mmol/L; required input (null when unanswered).';
COMMENT ON COLUMN anion_gap_calculator.potassium_mmol_l IS
    'Serum potassium in mmol/L; optional input that selects the potassium-inclusive formula and reference range (null when unanswered).';
COMMENT ON COLUMN anion_gap_calculator.chloride_mmol_l IS
    'Serum chloride in mmol/L; required input (null when unanswered).';
COMMENT ON COLUMN anion_gap_calculator.bicarbonate_mmol_l IS
    'Serum bicarbonate (HCO3-) in mmol/L; required input (null when unanswered).';
COMMENT ON COLUMN anion_gap_calculator.albumin_g_l IS
    'Serum albumin in g/L; optional input that enables the albumin correction (null when unanswered).';
COMMENT ON COLUMN anion_gap_calculator.include_potassium IS
    'Whether potassium is included in the anion-gap formula: yes or no.';
