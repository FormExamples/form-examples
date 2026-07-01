-- Main Waterlow pressure ulcer risk assessment record: assessment
-- context, patient identification, the five weighted core category
-- inputs (build / weight for height, skin type, sex and age,
-- continence, mobility) and the four special-risk group inputs
-- (tissue malnutrition, neurological deficit, major surgery or trauma,
-- medication), plus the existing-pressure-damage flag. The computed
-- grade, fired rules, and flags live in dedicated child tables.

CREATE TABLE waterlow_pressure_ulcer_risk_assessment (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    patient_id UUID NOT NULL REFERENCES patient(id) ON DELETE RESTRICT,
    clinician_id UUID REFERENCES clinician(id) ON DELETE RESTRICT,

    -- Step 1: assessment context and identification
    nurse_name VARCHAR(255) NOT NULL DEFAULT '',
    nurse_role VARCHAR(30) NOT NULL DEFAULT '' CHECK (nurse_role IN ('registered-nurse', 'healthcare-assistant', 'tissue-viability', 'other', '')),
    assessed_at TIMESTAMPTZ,
    care_setting VARCHAR(20) NOT NULL DEFAULT '' CHECK (care_setting IN ('acute-ward', 'community', 'care-home', 'hospice', 'other', '')),
    assessment_reason VARCHAR(30) NOT NULL DEFAULT '' CHECK (assessment_reason IN ('admission', 'routine', 'change-in-condition', '')),
    patient_identifier VARCHAR(100) NOT NULL DEFAULT '',
    age_band VARCHAR(10) NOT NULL DEFAULT '' CHECK (age_band IN ('14-49', '50-64', '65-74', '75-80', '81-plus', '')),
    sex VARCHAR(20) NOT NULL DEFAULT '' CHECK (sex IN ('female', 'male', '')),

    -- Step 2: core category — build / weight for height (BMI proxy)
    build_weight_for_height VARCHAR(20) NOT NULL DEFAULT '' CHECK (build_weight_for_height IN ('average', 'above-average', 'obese', 'below-average', '')),

    -- Step 3: core category — skin type / visual risk areas
    skin_type VARCHAR(20) NOT NULL DEFAULT '' CHECK (skin_type IN ('healthy', 'tissue-paper', 'dry', 'oedematous', 'clammy-pyrexial', 'discoloured', 'broken', '')),

    -- Step 4: core category — continence
    continence VARCHAR(30) NOT NULL DEFAULT '' CHECK (continence IN ('complete-catheterised', 'incontinent-urine', 'incontinent-faeces', 'doubly-incontinent', '')),

    -- Step 5: core category — mobility
    mobility VARCHAR(20) NOT NULL DEFAULT '' CHECK (mobility IN ('fully-mobile', 'restless', 'apathetic', 'restricted', 'bedbound', 'chairbound', '')),

    -- Step 6: special-risk group — tissue malnutrition
    tissue_malnutrition VARCHAR(30) NOT NULL DEFAULT '' CHECK (tissue_malnutrition IN ('none', 'smoking', 'anaemia', 'peripheral-vascular-disease', 'single-organ-failure', 'multiple-organ-failure', 'terminal-cachexia', '')),

    -- Step 7: special-risk group — neurological deficit
    neurological_deficit VARCHAR(20) NOT NULL DEFAULT '' CHECK (neurological_deficit IN ('none', 'mild', 'moderate', 'severe', '')),

    -- Step 8: special-risk group — major surgery or trauma
    major_surgery_trauma VARCHAR(30) NOT NULL DEFAULT '' CHECK (major_surgery_trauma IN ('none', 'orthopaedic-spinal', 'on-table-over-2h', 'on-table-over-6h', '')),

    -- Step 9: special-risk group — medication
    medication VARCHAR(50) NOT NULL DEFAULT '' CHECK (medication IN ('none', 'high-dose-steroids-cytotoxics-anti-inflammatory', '')),

    -- Step 10: existing pressure damage flag
    existing_pressure_damage VARCHAR(5) NOT NULL DEFAULT '' CHECK (existing_pressure_damage IN ('no', 'yes', '')),

    -- Step 11: clinician free-text note
    clinical_note TEXT NOT NULL DEFAULT ''
);

CREATE INDEX waterlow_pressure_ulcer_risk_assessment_patient_id_idx
    ON waterlow_pressure_ulcer_risk_assessment (patient_id);
CREATE INDEX waterlow_pressure_ulcer_risk_assessment_clinician_id_idx
    ON waterlow_pressure_ulcer_risk_assessment (clinician_id);

CREATE TRIGGER trigger_waterlow_pressure_ulcer_risk_assessment_updated_at
    BEFORE UPDATE ON waterlow_pressure_ulcer_risk_assessment
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE waterlow_pressure_ulcer_risk_assessment IS
    'Main Waterlow pressure ulcer risk assessment record: assessment context, patient identification, the five weighted core category inputs, the four special-risk group inputs, and the existing-pressure-damage flag.';
COMMENT ON COLUMN waterlow_pressure_ulcer_risk_assessment.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN waterlow_pressure_ulcer_risk_assessment.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN waterlow_pressure_ulcer_risk_assessment.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN waterlow_pressure_ulcer_risk_assessment.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN waterlow_pressure_ulcer_risk_assessment.patient_id IS
    'Foreign key to the patient being assessed (delete restricted).';
COMMENT ON COLUMN waterlow_pressure_ulcer_risk_assessment.clinician_id IS
    'Foreign key to the assessing clinician (optional; delete restricted).';
COMMENT ON COLUMN waterlow_pressure_ulcer_risk_assessment.nurse_name IS
    'Name of the assessing nurse as recorded on the assessment.';
COMMENT ON COLUMN waterlow_pressure_ulcer_risk_assessment.nurse_role IS
    'Role of the assessing nurse: registered-nurse, healthcare-assistant, tissue-viability, or other.';
COMMENT ON COLUMN waterlow_pressure_ulcer_risk_assessment.assessed_at IS
    'Date and time the assessment was performed.';
COMMENT ON COLUMN waterlow_pressure_ulcer_risk_assessment.care_setting IS
    'Care setting: acute-ward, community, care-home, hospice, or other.';
COMMENT ON COLUMN waterlow_pressure_ulcer_risk_assessment.assessment_reason IS
    'Reason the assessment was performed: admission, routine, or change-in-condition.';
COMMENT ON COLUMN waterlow_pressure_ulcer_risk_assessment.patient_identifier IS
    'Local patient identifier as recorded on the assessment.';
COMMENT ON COLUMN waterlow_pressure_ulcer_risk_assessment.age_band IS
    'Adult age band scoring the age category: 14-49, 50-64, 65-74, 75-80, or 81-plus.';
COMMENT ON COLUMN waterlow_pressure_ulcer_risk_assessment.sex IS
    'Patient sex scoring the sex category: female or male.';
COMMENT ON COLUMN waterlow_pressure_ulcer_risk_assessment.build_weight_for_height IS
    'Core category — build / weight for height (BMI proxy): average, above-average, obese, or below-average.';
COMMENT ON COLUMN waterlow_pressure_ulcer_risk_assessment.skin_type IS
    'Core category — skin type / visual risk area: healthy, tissue-paper, dry, oedematous, clammy-pyrexial, discoloured, or broken.';
COMMENT ON COLUMN waterlow_pressure_ulcer_risk_assessment.continence IS
    'Core category — continence: complete-catheterised, incontinent-urine, incontinent-faeces, or doubly-incontinent.';
COMMENT ON COLUMN waterlow_pressure_ulcer_risk_assessment.mobility IS
    'Core category — mobility: fully-mobile, restless, apathetic, restricted, bedbound, or chairbound.';
COMMENT ON COLUMN waterlow_pressure_ulcer_risk_assessment.tissue_malnutrition IS
    'Special-risk group — tissue malnutrition: none, smoking, anaemia, peripheral-vascular-disease, single-organ-failure, multiple-organ-failure, or terminal-cachexia.';
COMMENT ON COLUMN waterlow_pressure_ulcer_risk_assessment.neurological_deficit IS
    'Special-risk group — neurological deficit: none, mild, moderate, or severe.';
COMMENT ON COLUMN waterlow_pressure_ulcer_risk_assessment.major_surgery_trauma IS
    'Special-risk group — major surgery or trauma: none, orthopaedic-spinal, on-table-over-2h, or on-table-over-6h.';
COMMENT ON COLUMN waterlow_pressure_ulcer_risk_assessment.medication IS
    'Special-risk group — medication: none, or high-dose-steroids-cytotoxics-anti-inflammatory.';
COMMENT ON COLUMN waterlow_pressure_ulcer_risk_assessment.existing_pressure_damage IS
    'Whether existing pressure damage is present: no or yes. Drives an existing-pressure-damage flag.';
COMMENT ON COLUMN waterlow_pressure_ulcer_risk_assessment.clinical_note IS
    'Free-text clinical note recorded with the assessment.';
