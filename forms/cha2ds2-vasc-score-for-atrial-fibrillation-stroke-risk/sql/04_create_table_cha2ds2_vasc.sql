-- Main CHA2DS2-VASc assessment record: assessment context, patient
-- identification, and the weighted criterion inputs (congestive heart
-- failure, hypertension, age, diabetes, prior stroke/TIA/thromboembolism,
-- vascular disease, and sex category). Age and sex drive their own points.
-- The computed grade, fired rules, and flags live in dedicated child tables.

CREATE TABLE cha2ds2_vasc (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    patient_id UUID NOT NULL REFERENCES patient(id) ON DELETE RESTRICT,
    clinician_id UUID REFERENCES clinician(id) ON DELETE RESTRICT,

    -- Step 1: assessment context
    clinician_name VARCHAR(255) NOT NULL DEFAULT '',
    clinician_role VARCHAR(20) NOT NULL DEFAULT '' CHECK (clinician_role IN ('doctor', 'nurse', 'pharmacist', 'other', '')),
    assessed_at TIMESTAMPTZ,
    care_setting VARCHAR(30) NOT NULL DEFAULT '' CHECK (care_setting IN ('primary-care', 'cardiology', 'anticoagulation-clinic', 'emergency-department', 'other', '')),
    atrial_fibrillation_type VARCHAR(20) NOT NULL DEFAULT '' CHECK (atrial_fibrillation_type IN ('paroxysmal', 'persistent', 'permanent', 'flutter', '')),

    -- Step 2: patient identification
    patient_identifier VARCHAR(100) NOT NULL DEFAULT '',
    age_years INT,
    sex VARCHAR(20) NOT NULL DEFAULT '' CHECK (sex IN ('female', 'male', 'other', '')),

    -- Step 3: C — congestive heart failure / left-ventricular dysfunction (1)
    congestive_heart_failure VARCHAR(5) NOT NULL DEFAULT '' CHECK (congestive_heart_failure IN ('yes', 'no', '')),

    -- Step 4: H — hypertension (1)
    hypertension VARCHAR(5) NOT NULL DEFAULT '' CHECK (hypertension IN ('yes', 'no', '')),

    -- Step 5: D — diabetes mellitus (1)
    diabetes VARCHAR(5) NOT NULL DEFAULT '' CHECK (diabetes IN ('yes', 'no', '')),

    -- Step 6: S2 — prior stroke / TIA / thromboembolism (2)
    stroke_tia_thromboembolism VARCHAR(5) NOT NULL DEFAULT '' CHECK (stroke_tia_thromboembolism IN ('yes', 'no', '')),

    -- Step 7: V — vascular disease (1)
    vascular_disease VARCHAR(5) NOT NULL DEFAULT '' CHECK (vascular_disease IN ('yes', 'no', '')),

    -- Step 8: clinician free-text note
    clinical_note TEXT NOT NULL DEFAULT ''
);

CREATE INDEX cha2ds2_vasc_patient_id_idx
    ON cha2ds2_vasc (patient_id);
CREATE INDEX cha2ds2_vasc_clinician_id_idx
    ON cha2ds2_vasc (clinician_id);

CREATE TRIGGER trigger_cha2ds2_vasc_updated_at
    BEFORE UPDATE ON cha2ds2_vasc
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE cha2ds2_vasc IS
    'Main CHA2DS2-VASc assessment record: assessment context, patient identification, and the weighted criterion inputs (congestive heart failure, hypertension, age, diabetes, prior stroke/TIA/thromboembolism, vascular disease, and sex category).';
COMMENT ON COLUMN cha2ds2_vasc.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN cha2ds2_vasc.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN cha2ds2_vasc.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN cha2ds2_vasc.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN cha2ds2_vasc.patient_id IS
    'Foreign key to the patient being assessed (delete restricted).';
COMMENT ON COLUMN cha2ds2_vasc.clinician_id IS
    'Foreign key to the assessing clinician (optional; delete restricted).';
COMMENT ON COLUMN cha2ds2_vasc.clinician_name IS
    'Name of the assessing clinician as recorded on the assessment.';
COMMENT ON COLUMN cha2ds2_vasc.clinician_role IS
    'Role of the assessing clinician: doctor, nurse, pharmacist, or other.';
COMMENT ON COLUMN cha2ds2_vasc.assessed_at IS
    'Date and time the assessment was performed.';
COMMENT ON COLUMN cha2ds2_vasc.care_setting IS
    'Care setting: primary-care, cardiology, anticoagulation-clinic, emergency-department, or other.';
COMMENT ON COLUMN cha2ds2_vasc.atrial_fibrillation_type IS
    'Type of atrial fibrillation: paroxysmal, persistent, permanent, or flutter.';
COMMENT ON COLUMN cha2ds2_vasc.patient_identifier IS
    'Local patient identifier as recorded on the assessment.';
COMMENT ON COLUMN cha2ds2_vasc.age_years IS
    'Patient age in years; drives the age criterion (>= 75 scores 2, 65-74 scores 1). NULL when unanswered.';
COMMENT ON COLUMN cha2ds2_vasc.sex IS
    'Patient sex driving the sex-category point (female scores 1): female, male, or other.';
COMMENT ON COLUMN cha2ds2_vasc.congestive_heart_failure IS
    'Criterion C — congestive heart failure or left-ventricular dysfunction (scores 1 when yes): yes or no.';
COMMENT ON COLUMN cha2ds2_vasc.hypertension IS
    'Criterion H — hypertension, treated or with blood pressure > 140/90 (scores 1 when yes): yes or no.';
COMMENT ON COLUMN cha2ds2_vasc.diabetes IS
    'Criterion D — diabetes mellitus (scores 1 when yes): yes or no.';
COMMENT ON COLUMN cha2ds2_vasc.stroke_tia_thromboembolism IS
    'Criterion S2 — prior stroke, transient ischaemic attack, or thromboembolism (scores 2 when yes): yes or no.';
COMMENT ON COLUMN cha2ds2_vasc.vascular_disease IS
    'Criterion V — vascular disease (prior MI, peripheral arterial disease, or aortic plaque; scores 1 when yes): yes or no.';
COMMENT ON COLUMN cha2ds2_vasc.clinical_note IS
    'Free-text clinical note recorded with the assessment.';
