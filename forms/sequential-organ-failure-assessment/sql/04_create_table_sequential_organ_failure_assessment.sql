-- Main Sequential Organ Failure Assessment (SOFA) record: assessment
-- context, patient identification and baseline, and the raw
-- physiological and laboratory inputs for the six scored organ systems
-- (respiration, coagulation, liver, cardiovascular, central nervous
-- system, renal). The computed grade, fired rules, and flags live in
-- dedicated child tables.

CREATE TABLE sequential_organ_failure_assessment (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    patient_id UUID NOT NULL REFERENCES patient(id) ON DELETE RESTRICT,
    clinician_id UUID REFERENCES clinician(id) ON DELETE RESTRICT,

    -- Step 1: clinician and context
    assessor_name VARCHAR(255) NOT NULL DEFAULT '',
    assessor_role VARCHAR(40) NOT NULL DEFAULT '' CHECK (assessor_role IN ('intensivist', 'critical-care-physician', 'acute-physician', 'resident', 'nurse', 'outreach-practitioner', 'other', '')),
    assessor_registration_number VARCHAR(50) NOT NULL DEFAULT '',
    assessed_at TIMESTAMPTZ,
    care_location VARCHAR(30) NOT NULL DEFAULT '' CHECK (care_location IN ('icu', 'hdu', 'critical-care-outreach', 'acute-medical-unit', 'emergency-department', 'other', '')),
    hours_since_admission INT,

    -- Step 2: patient identification and baseline
    patient_identifier VARCHAR(100) NOT NULL DEFAULT '',
    age_years INT,
    sex VARCHAR(20) NOT NULL DEFAULT '' CHECK (sex IN ('female', 'male', 'intersex', 'unknown', '')),
    admission_diagnosis TEXT NOT NULL DEFAULT '',
    suspected_infection VARCHAR(10) NOT NULL DEFAULT '' CHECK (suspected_infection IN ('yes', 'no', 'unknown', '')),
    baseline_sofa_total INT,

    -- Step 3: respiration (PaO2/FiO2 ratio, respiratory support)
    pao2 NUMERIC(6,2),
    fio2 NUMERIC(4,2),
    pao2_fio2_ratio NUMERIC(7,2),
    respiratory_support VARCHAR(20) NOT NULL DEFAULT '' CHECK (respiratory_support IN ('ventilated', 'cpap', 'none', '')),

    -- Step 4: coagulation (platelet count, x10^9/L)
    platelets NUMERIC(6,1),

    -- Step 5: liver (bilirubin, umol/L)
    bilirubin NUMERIC(7,1),

    -- Step 6: cardiovascular (MAP, vasopressor agent and dose)
    map NUMERIC(5,1),
    vasopressor VARCHAR(20) NOT NULL DEFAULT '' CHECK (vasopressor IN ('none', 'dopamine', 'dobutamine', 'adrenaline', 'noradrenaline', 'other', '')),
    vasopressor_dose NUMERIC(6,3),

    -- Step 7: central nervous system (Glasgow Coma Scale, sedation)
    glasgow_coma_scale INT,
    sedated BOOLEAN NOT NULL DEFAULT false,

    -- Step 8: renal (creatinine umol/L, 24-hour urine output mL/day)
    creatinine NUMERIC(7,1),
    urine_output INT,

    -- Step 9: clinician free-text note
    clinical_note TEXT NOT NULL DEFAULT ''
);

CREATE INDEX sequential_organ_failure_assessment_patient_id_idx
    ON sequential_organ_failure_assessment (patient_id);
CREATE INDEX sequential_organ_failure_assessment_clinician_id_idx
    ON sequential_organ_failure_assessment (clinician_id);

CREATE TRIGGER trigger_sequential_organ_failure_assessment_updated_at
    BEFORE UPDATE ON sequential_organ_failure_assessment
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE sequential_organ_failure_assessment IS
    'Main Sequential Organ Failure Assessment (SOFA) record: assessment context, patient identification and baseline, and the raw inputs for the six scored organ systems (respiration, coagulation, liver, cardiovascular, central nervous system, renal).';
COMMENT ON COLUMN sequential_organ_failure_assessment.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN sequential_organ_failure_assessment.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN sequential_organ_failure_assessment.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN sequential_organ_failure_assessment.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN sequential_organ_failure_assessment.patient_id IS
    'Foreign key to the patient being assessed (delete restricted).';
COMMENT ON COLUMN sequential_organ_failure_assessment.clinician_id IS
    'Foreign key to the assessing clinician (optional; delete restricted).';
COMMENT ON COLUMN sequential_organ_failure_assessment.assessor_name IS
    'Name of the assessing clinician as recorded on the assessment.';
COMMENT ON COLUMN sequential_organ_failure_assessment.assessor_role IS
    'Role of the assessing clinician: intensivist, critical-care-physician, acute-physician, resident, nurse, outreach-practitioner, or other.';
COMMENT ON COLUMN sequential_organ_failure_assessment.assessor_registration_number IS
    'Professional registration number of the assessing clinician.';
COMMENT ON COLUMN sequential_organ_failure_assessment.assessed_at IS
    'Date and time the assessment was performed.';
COMMENT ON COLUMN sequential_organ_failure_assessment.care_location IS
    'Care location: icu, hdu, critical-care-outreach, acute-medical-unit, emergency-department, or other.';
COMMENT ON COLUMN sequential_organ_failure_assessment.hours_since_admission IS
    'Hours elapsed since ICU/critical-care admission (for serial scoring).';
COMMENT ON COLUMN sequential_organ_failure_assessment.patient_identifier IS
    'Local patient identifier as recorded on the assessment.';
COMMENT ON COLUMN sequential_organ_failure_assessment.age_years IS
    'Patient age in years at the time of assessment.';
COMMENT ON COLUMN sequential_organ_failure_assessment.sex IS
    'Patient sex recorded for the assessment: female, male, intersex, or unknown.';
COMMENT ON COLUMN sequential_organ_failure_assessment.admission_diagnosis IS
    'Free-text admission or working diagnosis.';
COMMENT ON COLUMN sequential_organ_failure_assessment.suspected_infection IS
    'Whether infection is suspected (drives the Sepsis-3 flag): yes, no, or unknown.';
COMMENT ON COLUMN sequential_organ_failure_assessment.baseline_sofa_total IS
    'Prior (baseline) total SOFA score used to compute delta-SOFA; assumed 0 when no pre-existing organ dysfunction is known.';
COMMENT ON COLUMN sequential_organ_failure_assessment.pao2 IS
    'Respiration input — arterial partial pressure of oxygen (PaO2); SI units (kPa) preferred, mmHg accepted.';
COMMENT ON COLUMN sequential_organ_failure_assessment.fio2 IS
    'Respiration input — fraction of inspired oxygen (FiO2) as a decimal fraction (0.21-1.0).';
COMMENT ON COLUMN sequential_organ_failure_assessment.pao2_fio2_ratio IS
    'Respiration input — directly entered PaO2/FiO2 ratio, used when PaO2 and FiO2 are not entered separately.';
COMMENT ON COLUMN sequential_organ_failure_assessment.respiratory_support IS
    'Respiration input — respiratory support: ventilated, cpap, or none; sub-scores of 3-4 require support.';
COMMENT ON COLUMN sequential_organ_failure_assessment.platelets IS
    'Coagulation input — platelet count in x10^9/L (equivalently x10^3/uL).';
COMMENT ON COLUMN sequential_organ_failure_assessment.bilirubin IS
    'Liver input — total bilirubin; SI units (umol/L) preferred, mg/dL accepted.';
COMMENT ON COLUMN sequential_organ_failure_assessment.map IS
    'Cardiovascular input — mean arterial pressure (MAP) in mmHg.';
COMMENT ON COLUMN sequential_organ_failure_assessment.vasopressor IS
    'Cardiovascular input — vasopressor/inotrope agent: none, dopamine, dobutamine, adrenaline, noradrenaline, or other.';
COMMENT ON COLUMN sequential_organ_failure_assessment.vasopressor_dose IS
    'Cardiovascular input — vasopressor dose in ug/kg/min (administered for at least one hour).';
COMMENT ON COLUMN sequential_organ_failure_assessment.glasgow_coma_scale IS
    'Central nervous system input — Glasgow Coma Scale (GCS) total, 3-15.';
COMMENT ON COLUMN sequential_organ_failure_assessment.sedated IS
    'Central nervous system input — whether the patient is sedated; use pre-sedation GCS or best estimate.';
COMMENT ON COLUMN sequential_organ_failure_assessment.creatinine IS
    'Renal input — serum creatinine; SI units (umol/L) preferred, mg/dL accepted.';
COMMENT ON COLUMN sequential_organ_failure_assessment.urine_output IS
    'Renal input — 24-hour urine output in mL/day.';
COMMENT ON COLUMN sequential_organ_failure_assessment.clinical_note IS
    'Free-text clinical note recorded with the assessment.';
