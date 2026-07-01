-- Main body-mass-index and body-surface-area calculation record: context and
-- identification, plus the two measured calculation inputs (height and weight)
-- and the preferred BSA formula. The computed BMI, its WHO category, the two
-- BSA values, fired rules, and safety flags live in dedicated child tables.

CREATE TABLE body_mass_index_and_body_surface_area_calculator (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    patient_id UUID NOT NULL REFERENCES patient(id) ON DELETE RESTRICT,
    clinician_id UUID REFERENCES clinician(id) ON DELETE RESTRICT,

    -- Context and identification
    clinician_name VARCHAR(255) NOT NULL DEFAULT '',
    clinician_role VARCHAR(20) NOT NULL DEFAULT '' CHECK (clinician_role IN ('doctor', 'nurse', 'pharmacist', 'dietitian', 'other', '')),
    assessed_at TIMESTAMPTZ,
    care_setting VARCHAR(20) NOT NULL DEFAULT '' CHECK (care_setting IN ('primary-care', 'outpatient', 'inpatient', 'oncology', 'pre-operative', 'other', '')),
    purpose VARCHAR(20) NOT NULL DEFAULT '' CHECK (purpose IN ('screening', 'drug-dosing', 'monitoring', 'other', '')),
    patient_identifier VARCHAR(100) NOT NULL DEFAULT '',
    age_band VARCHAR(20) NOT NULL DEFAULT '' CHECK (age_band IN ('18-39', '40-64', '65-74', '75-84', '85-plus', '')),
    sex VARCHAR(20) NOT NULL DEFAULT '' CHECK (sex IN ('female', 'male', 'intersex', 'unknown', '')),
    ancestry VARCHAR(20) NOT NULL DEFAULT '' CHECK (ancestry IN ('asian', 'other', 'unspecified', '')),

    -- Calculation inputs
    height_cm NUMERIC(5,1),
    weight_kg NUMERIC(5,1),
    bsa_formula VARCHAR(15) NOT NULL DEFAULT 'mosteller' CHECK (bsa_formula IN ('mosteller', 'du-bois', ''))
);

CREATE INDEX body_mass_index_and_body_surface_area_calculator_patient_id_idx
    ON body_mass_index_and_body_surface_area_calculator (patient_id);
CREATE INDEX body_mass_index_and_body_surface_area_calculator_clinician_id_idx
    ON body_mass_index_and_body_surface_area_calculator (clinician_id);

CREATE TRIGGER trigger_body_mass_index_and_body_surface_area_calculator_updated_at
    BEFORE UPDATE ON body_mass_index_and_body_surface_area_calculator
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE body_mass_index_and_body_surface_area_calculator IS
    'Main body-mass-index and body-surface-area calculation record: context and identification, plus the measured height and weight inputs and the preferred BSA formula.';
COMMENT ON COLUMN body_mass_index_and_body_surface_area_calculator.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN body_mass_index_and_body_surface_area_calculator.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN body_mass_index_and_body_surface_area_calculator.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN body_mass_index_and_body_surface_area_calculator.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN body_mass_index_and_body_surface_area_calculator.patient_id IS
    'Foreign key to the patient this calculation is for (restricted delete).';
COMMENT ON COLUMN body_mass_index_and_body_surface_area_calculator.clinician_id IS
    'Foreign key to the clinician who recorded the calculation (optional, restricted delete).';
COMMENT ON COLUMN body_mass_index_and_body_surface_area_calculator.clinician_name IS
    'Recording clinician name as entered on the form.';
COMMENT ON COLUMN body_mass_index_and_body_surface_area_calculator.clinician_role IS
    'Recording clinician role: doctor, nurse, pharmacist, dietitian, or other.';
COMMENT ON COLUMN body_mass_index_and_body_surface_area_calculator.assessed_at IS
    'Date and time the measurement was taken.';
COMMENT ON COLUMN body_mass_index_and_body_surface_area_calculator.care_setting IS
    'Care setting: primary-care, outpatient, inpatient, oncology, pre-operative, or other.';
COMMENT ON COLUMN body_mass_index_and_body_surface_area_calculator.purpose IS
    'Purpose of the calculation: screening, drug-dosing, monitoring, or other.';
COMMENT ON COLUMN body_mass_index_and_body_surface_area_calculator.patient_identifier IS
    'Local patient identifier as recorded on the form.';
COMMENT ON COLUMN body_mass_index_and_body_surface_area_calculator.age_band IS
    'Adult age band: 18-39, 40-64, 65-74, 75-84, or 85-plus.';
COMMENT ON COLUMN body_mass_index_and_body_surface_area_calculator.sex IS
    'Patient sex recorded for clinical purposes: female, male, intersex, or unknown.';
COMMENT ON COLUMN body_mass_index_and_body_surface_area_calculator.ancestry IS
    'Patient ancestry for the Asian lower-threshold action points: asian, other, or unspecified.';
COMMENT ON COLUMN body_mass_index_and_body_surface_area_calculator.height_cm IS
    'Measured height in centimetres (null when unanswered).';
COMMENT ON COLUMN body_mass_index_and_body_surface_area_calculator.weight_kg IS
    'Measured weight in kilograms (null when unanswered).';
COMMENT ON COLUMN body_mass_index_and_body_surface_area_calculator.bsa_formula IS
    'Preferred body-surface-area formula shown as primary: mosteller (default) or du-bois; both values are always computed.';
