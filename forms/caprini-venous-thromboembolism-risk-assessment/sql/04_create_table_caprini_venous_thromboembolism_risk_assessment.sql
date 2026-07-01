-- Main Caprini VTE risk-assessment record: assessment context, patient
-- identification, the age band, and the weighted yes/no risk-factor
-- inputs grouped by their fixed point weight (1, 2, 3, and 5), plus the
-- bleeding-risk input. The computed score, fired rules, and flags live
-- in dedicated child tables.

CREATE TABLE caprini_venous_thromboembolism_risk_assessment (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    patient_id UUID NOT NULL REFERENCES patient(id) ON DELETE RESTRICT,
    clinician_id UUID REFERENCES clinician(id) ON DELETE RESTRICT,

    -- Step 1: assessment context
    clinician_name VARCHAR(255) NOT NULL DEFAULT '',
    clinician_role VARCHAR(20) NOT NULL DEFAULT '' CHECK (clinician_role IN ('doctor', 'surgeon', 'nurse', 'pharmacist', 'other', '')),
    assessed_at TIMESTAMPTZ,
    care_setting VARCHAR(30) NOT NULL DEFAULT '' CHECK (care_setting IN ('surgical-ward', 'medical-ward', 'pre-operative-clinic', 'other', '')),
    admission_type VARCHAR(20) NOT NULL DEFAULT '' CHECK (admission_type IN ('surgical', 'medical', '')),

    -- Step 2: patient identification and age band
    patient_identifier VARCHAR(100) NOT NULL DEFAULT '',
    age_band VARCHAR(10) NOT NULL DEFAULT '' CHECK (age_band IN ('under-41', '41-60', '61-74', '75-plus', '')),
    sex VARCHAR(20) NOT NULL DEFAULT '' CHECK (sex IN ('female', 'male', 'intersex', 'unknown', '')),

    -- Step 3: 1-point risk factors (each yes/no; the fixed weight applies when yes)
    minor_surgery VARCHAR(5) NOT NULL DEFAULT '' CHECK (minor_surgery IN ('yes', 'no', '')),
    recent_major_surgery VARCHAR(5) NOT NULL DEFAULT '' CHECK (recent_major_surgery IN ('yes', 'no', '')),
    varicose_veins VARCHAR(5) NOT NULL DEFAULT '' CHECK (varicose_veins IN ('yes', 'no', '')),
    inflammatory_bowel_disease VARCHAR(5) NOT NULL DEFAULT '' CHECK (inflammatory_bowel_disease IN ('yes', 'no', '')),
    swollen_legs VARCHAR(5) NOT NULL DEFAULT '' CHECK (swollen_legs IN ('yes', 'no', '')),
    obesity VARCHAR(5) NOT NULL DEFAULT '' CHECK (obesity IN ('yes', 'no', '')),
    acute_myocardial_infarction VARCHAR(5) NOT NULL DEFAULT '' CHECK (acute_myocardial_infarction IN ('yes', 'no', '')),
    congestive_heart_failure VARCHAR(5) NOT NULL DEFAULT '' CHECK (congestive_heart_failure IN ('yes', 'no', '')),
    sepsis VARCHAR(5) NOT NULL DEFAULT '' CHECK (sepsis IN ('yes', 'no', '')),
    serious_lung_disease VARCHAR(5) NOT NULL DEFAULT '' CHECK (serious_lung_disease IN ('yes', 'no', '')),
    abnormal_pulmonary_function VARCHAR(5) NOT NULL DEFAULT '' CHECK (abnormal_pulmonary_function IN ('yes', 'no', '')),
    medical_patient_bed_rest VARCHAR(5) NOT NULL DEFAULT '' CHECK (medical_patient_bed_rest IN ('yes', 'no', '')),
    oral_contraceptive_or_hrt VARCHAR(5) NOT NULL DEFAULT '' CHECK (oral_contraceptive_or_hrt IN ('yes', 'no', '')),
    pregnancy_or_postpartum VARCHAR(5) NOT NULL DEFAULT '' CHECK (pregnancy_or_postpartum IN ('yes', 'no', '')),
    adverse_pregnancy_history VARCHAR(5) NOT NULL DEFAULT '' CHECK (adverse_pregnancy_history IN ('yes', 'no', '')),

    -- Step 4: 2-point risk factors
    arthroscopic_surgery VARCHAR(5) NOT NULL DEFAULT '' CHECK (arthroscopic_surgery IN ('yes', 'no', '')),
    major_open_surgery VARCHAR(5) NOT NULL DEFAULT '' CHECK (major_open_surgery IN ('yes', 'no', '')),
    laparoscopic_surgery VARCHAR(5) NOT NULL DEFAULT '' CHECK (laparoscopic_surgery IN ('yes', 'no', '')),
    malignancy VARCHAR(5) NOT NULL DEFAULT '' CHECK (malignancy IN ('yes', 'no', '')),
    confined_to_bed VARCHAR(5) NOT NULL DEFAULT '' CHECK (confined_to_bed IN ('yes', 'no', '')),
    immobilising_cast VARCHAR(5) NOT NULL DEFAULT '' CHECK (immobilising_cast IN ('yes', 'no', '')),
    central_venous_access VARCHAR(5) NOT NULL DEFAULT '' CHECK (central_venous_access IN ('yes', 'no', '')),

    -- Step 5: 3-point risk factors
    history_of_vte VARCHAR(5) NOT NULL DEFAULT '' CHECK (history_of_vte IN ('yes', 'no', '')),
    family_history_of_thrombosis VARCHAR(5) NOT NULL DEFAULT '' CHECK (family_history_of_thrombosis IN ('yes', 'no', '')),
    factor_v_leiden VARCHAR(5) NOT NULL DEFAULT '' CHECK (factor_v_leiden IN ('yes', 'no', '')),
    prothrombin_20210a VARCHAR(5) NOT NULL DEFAULT '' CHECK (prothrombin_20210a IN ('yes', 'no', '')),
    lupus_anticoagulant VARCHAR(5) NOT NULL DEFAULT '' CHECK (lupus_anticoagulant IN ('yes', 'no', '')),
    anticardiolipin_antibodies VARCHAR(5) NOT NULL DEFAULT '' CHECK (anticardiolipin_antibodies IN ('yes', 'no', '')),
    elevated_homocysteine VARCHAR(5) NOT NULL DEFAULT '' CHECK (elevated_homocysteine IN ('yes', 'no', '')),
    heparin_induced_thrombocytopenia VARCHAR(5) NOT NULL DEFAULT '' CHECK (heparin_induced_thrombocytopenia IN ('yes', 'no', '')),
    other_thrombophilia VARCHAR(5) NOT NULL DEFAULT '' CHECK (other_thrombophilia IN ('yes', 'no', '')),

    -- Step 6: 5-point risk factors
    stroke VARCHAR(5) NOT NULL DEFAULT '' CHECK (stroke IN ('yes', 'no', '')),
    elective_arthroplasty VARCHAR(5) NOT NULL DEFAULT '' CHECK (elective_arthroplasty IN ('yes', 'no', '')),
    hip_pelvis_leg_fracture VARCHAR(5) NOT NULL DEFAULT '' CHECK (hip_pelvis_leg_fracture IN ('yes', 'no', '')),
    acute_spinal_cord_injury VARCHAR(5) NOT NULL DEFAULT '' CHECK (acute_spinal_cord_injury IN ('yes', 'no', '')),
    multiple_trauma VARCHAR(5) NOT NULL DEFAULT '' CHECK (multiple_trauma IN ('yes', 'no', '')),

    -- Step 7: bleeding risk
    high_bleeding_risk VARCHAR(5) NOT NULL DEFAULT '' CHECK (high_bleeding_risk IN ('yes', 'no', '')),

    -- Step 8: clinician free-text note
    clinical_note TEXT NOT NULL DEFAULT ''
);

CREATE INDEX caprini_venous_thromboembolism_risk_assessment_patient_id_idx
    ON caprini_venous_thromboembolism_risk_assessment (patient_id);
CREATE INDEX caprini_venous_thromboembolism_risk_assessment_clinician_id_idx
    ON caprini_venous_thromboembolism_risk_assessment (clinician_id);

CREATE TRIGGER trigger_caprini_venous_thromboembolism_risk_assessment_updated_at
    BEFORE UPDATE ON caprini_venous_thromboembolism_risk_assessment
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE caprini_venous_thromboembolism_risk_assessment IS
    'Main Caprini VTE risk-assessment record: assessment context, patient identification, age band, weighted yes/no risk-factor inputs (1-, 2-, 3-, and 5-point groups), and the bleeding-risk input.';
COMMENT ON COLUMN caprini_venous_thromboembolism_risk_assessment.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN caprini_venous_thromboembolism_risk_assessment.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN caprini_venous_thromboembolism_risk_assessment.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN caprini_venous_thromboembolism_risk_assessment.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN caprini_venous_thromboembolism_risk_assessment.patient_id IS
    'Foreign key to the patient being assessed (delete restricted).';
COMMENT ON COLUMN caprini_venous_thromboembolism_risk_assessment.clinician_id IS
    'Foreign key to the assessing clinician (optional; delete restricted).';
COMMENT ON COLUMN caprini_venous_thromboembolism_risk_assessment.clinician_name IS
    'Name of the assessing clinician as recorded on the assessment.';
COMMENT ON COLUMN caprini_venous_thromboembolism_risk_assessment.clinician_role IS
    'Role of the assessing clinician: doctor, surgeon, nurse, pharmacist, or other.';
COMMENT ON COLUMN caprini_venous_thromboembolism_risk_assessment.assessed_at IS
    'Date and time the assessment was performed.';
COMMENT ON COLUMN caprini_venous_thromboembolism_risk_assessment.care_setting IS
    'Care setting: surgical-ward, medical-ward, pre-operative-clinic, or other.';
COMMENT ON COLUMN caprini_venous_thromboembolism_risk_assessment.admission_type IS
    'Admission type: surgical or medical.';
COMMENT ON COLUMN caprini_venous_thromboembolism_risk_assessment.patient_identifier IS
    'Local patient identifier as recorded on the assessment.';
COMMENT ON COLUMN caprini_venous_thromboembolism_risk_assessment.age_band IS
    'Age band contributing weight: under-41 (0), 41-60 (1), 61-74 (2), or 75-plus (3).';
COMMENT ON COLUMN caprini_venous_thromboembolism_risk_assessment.sex IS
    'Patient sex recorded for the assessment: female, male, intersex, or unknown.';
COMMENT ON COLUMN caprini_venous_thromboembolism_risk_assessment.minor_surgery IS
    '1-point factor — minor surgery planned or performed.';
COMMENT ON COLUMN caprini_venous_thromboembolism_risk_assessment.recent_major_surgery IS
    '1-point factor — major surgery within the past month.';
COMMENT ON COLUMN caprini_venous_thromboembolism_risk_assessment.varicose_veins IS
    '1-point factor — varicose veins.';
COMMENT ON COLUMN caprini_venous_thromboembolism_risk_assessment.inflammatory_bowel_disease IS
    '1-point factor — inflammatory bowel disease.';
COMMENT ON COLUMN caprini_venous_thromboembolism_risk_assessment.swollen_legs IS
    '1-point factor — swollen legs (current).';
COMMENT ON COLUMN caprini_venous_thromboembolism_risk_assessment.obesity IS
    '1-point factor — obesity (BMI >= 30).';
COMMENT ON COLUMN caprini_venous_thromboembolism_risk_assessment.acute_myocardial_infarction IS
    '1-point factor — acute myocardial infarction.';
COMMENT ON COLUMN caprini_venous_thromboembolism_risk_assessment.congestive_heart_failure IS
    '1-point factor — congestive heart failure (within the past month).';
COMMENT ON COLUMN caprini_venous_thromboembolism_risk_assessment.sepsis IS
    '1-point factor — sepsis (within the past month).';
COMMENT ON COLUMN caprini_venous_thromboembolism_risk_assessment.serious_lung_disease IS
    '1-point factor — serious lung disease including pneumonia (within the past month).';
COMMENT ON COLUMN caprini_venous_thromboembolism_risk_assessment.abnormal_pulmonary_function IS
    '1-point factor — abnormal pulmonary function (e.g. COPD).';
COMMENT ON COLUMN caprini_venous_thromboembolism_risk_assessment.medical_patient_bed_rest IS
    '1-point factor — medical patient currently on bed rest.';
COMMENT ON COLUMN caprini_venous_thromboembolism_risk_assessment.oral_contraceptive_or_hrt IS
    '1-point factor — oral contraceptive or hormone replacement therapy.';
COMMENT ON COLUMN caprini_venous_thromboembolism_risk_assessment.pregnancy_or_postpartum IS
    '1-point factor — pregnancy or postpartum (within the past month).';
COMMENT ON COLUMN caprini_venous_thromboembolism_risk_assessment.adverse_pregnancy_history IS
    '1-point factor — history of unexplained or recurrent spontaneous abortion.';
COMMENT ON COLUMN caprini_venous_thromboembolism_risk_assessment.arthroscopic_surgery IS
    '2-point factor — arthroscopic surgery.';
COMMENT ON COLUMN caprini_venous_thromboembolism_risk_assessment.major_open_surgery IS
    '2-point factor — major open surgery (> 45 minutes).';
COMMENT ON COLUMN caprini_venous_thromboembolism_risk_assessment.laparoscopic_surgery IS
    '2-point factor — laparoscopic surgery (> 45 minutes).';
COMMENT ON COLUMN caprini_venous_thromboembolism_risk_assessment.malignancy IS
    '2-point factor — malignancy (present or previous).';
COMMENT ON COLUMN caprini_venous_thromboembolism_risk_assessment.confined_to_bed IS
    '2-point factor — confined to bed (> 72 hours).';
COMMENT ON COLUMN caprini_venous_thromboembolism_risk_assessment.immobilising_cast IS
    '2-point factor — immobilising plaster cast.';
COMMENT ON COLUMN caprini_venous_thromboembolism_risk_assessment.central_venous_access IS
    '2-point factor — central venous access.';
COMMENT ON COLUMN caprini_venous_thromboembolism_risk_assessment.history_of_vte IS
    '3-point factor — personal history of venous thromboembolism.';
COMMENT ON COLUMN caprini_venous_thromboembolism_risk_assessment.family_history_of_thrombosis IS
    '3-point factor — family history of thrombosis.';
COMMENT ON COLUMN caprini_venous_thromboembolism_risk_assessment.factor_v_leiden IS
    '3-point factor — Factor V Leiden mutation.';
COMMENT ON COLUMN caprini_venous_thromboembolism_risk_assessment.prothrombin_20210a IS
    '3-point factor — prothrombin 20210A mutation.';
COMMENT ON COLUMN caprini_venous_thromboembolism_risk_assessment.lupus_anticoagulant IS
    '3-point factor — lupus anticoagulant positive.';
COMMENT ON COLUMN caprini_venous_thromboembolism_risk_assessment.anticardiolipin_antibodies IS
    '3-point factor — elevated anticardiolipin antibodies.';
COMMENT ON COLUMN caprini_venous_thromboembolism_risk_assessment.elevated_homocysteine IS
    '3-point factor — elevated serum homocysteine.';
COMMENT ON COLUMN caprini_venous_thromboembolism_risk_assessment.heparin_induced_thrombocytopenia IS
    '3-point factor — heparin-induced thrombocytopenia (HIT).';
COMMENT ON COLUMN caprini_venous_thromboembolism_risk_assessment.other_thrombophilia IS
    '3-point factor — other congenital or acquired thrombophilia.';
COMMENT ON COLUMN caprini_venous_thromboembolism_risk_assessment.stroke IS
    '5-point factor — stroke (within the past month).';
COMMENT ON COLUMN caprini_venous_thromboembolism_risk_assessment.elective_arthroplasty IS
    '5-point factor — elective major lower-extremity arthroplasty.';
COMMENT ON COLUMN caprini_venous_thromboembolism_risk_assessment.hip_pelvis_leg_fracture IS
    '5-point factor — hip, pelvis, or leg fracture.';
COMMENT ON COLUMN caprini_venous_thromboembolism_risk_assessment.acute_spinal_cord_injury IS
    '5-point factor — acute spinal cord injury with paralysis (within the past month).';
COMMENT ON COLUMN caprini_venous_thromboembolism_risk_assessment.multiple_trauma IS
    '5-point factor — multiple trauma (within the past month).';
COMMENT ON COLUMN caprini_venous_thromboembolism_risk_assessment.high_bleeding_risk IS
    'Bleeding-risk input — an active or high risk of bleeding that contraindicates pharmacological prophylaxis.';
COMMENT ON COLUMN caprini_venous_thromboembolism_risk_assessment.clinical_note IS
    'Free-text clinical note recorded with the assessment.';
