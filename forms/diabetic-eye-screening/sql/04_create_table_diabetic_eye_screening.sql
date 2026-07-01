-- Main diabetic-eye-screening record: one retinal screening episode under the
-- UK NHS Diabetic Eye Screening Programme (DESP). Captures grading context,
-- patient identification, and a right-eye and left-eye grading block (the
-- retinopathy (R) grade, maculopathy (M) grade, photocoagulation (P) marker,
-- ungradable (U) marker, and visual acuity). The computed worst-eye
-- classification and recall / referral outcome, the audit trail of fired rules,
-- and the flagged issues live in dedicated child tables.

CREATE TABLE diabetic_eye_screening (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    patient_id UUID NOT NULL REFERENCES patient(id) ON DELETE RESTRICT,
    clinician_id UUID REFERENCES clinician(id) ON DELETE RESTRICT,

    -- Grading context
    grader_name TEXT NOT NULL DEFAULT '',
    grader_role VARCHAR(20) NOT NULL DEFAULT '' CHECK (grader_role IN ('screener', 'primary-grader', 'secondary-grader', 'ophthalmologist', 'other', '')),
    graded_at DATE,
    image_captured_at DATE,
    imaging_media VARCHAR(15) NOT NULL DEFAULT '' CHECK (imaging_media IN ('digital-fundus', 'mydriatic', 'non-mydriatic', 'oct', 'other', '')),

    -- Patient identification
    patient_identifier VARCHAR(100) NOT NULL DEFAULT '',
    age_band VARCHAR(15) NOT NULL DEFAULT '' CHECK (age_band IN ('under-12', '12-17', '18-64', '65-plus', '')),
    diabetes_type VARCHAR(10) NOT NULL DEFAULT '' CHECK (diabetes_type IN ('type-1', 'type-2', 'other', 'unknown', '')),
    years_since_diagnosis NUMERIC(4,1),
    previous_screen_date DATE,
    previous_screen_result VARCHAR(15) NOT NULL DEFAULT '' CHECK (previous_screen_result IN ('r0m0', 'background', 'referable', 'none', 'unknown', '')),

    -- Right-eye grading
    right_retinopathy_grade VARCHAR(5) NOT NULL DEFAULT '' CHECK (right_retinopathy_grade IN ('R0', 'R1', 'R2', 'R3A', 'R3S', '')),
    right_maculopathy_grade VARCHAR(5) NOT NULL DEFAULT '' CHECK (right_maculopathy_grade IN ('M0', 'M1', '')),
    right_photocoagulation VARCHAR(5) NOT NULL DEFAULT '' CHECK (right_photocoagulation IN ('yes', 'no', '')),
    right_ungradable VARCHAR(5) NOT NULL DEFAULT '' CHECK (right_ungradable IN ('yes', 'no', '')),
    right_visual_acuity TEXT NOT NULL DEFAULT '',

    -- Left-eye grading
    left_retinopathy_grade VARCHAR(5) NOT NULL DEFAULT '' CHECK (left_retinopathy_grade IN ('R0', 'R1', 'R2', 'R3A', 'R3S', '')),
    left_maculopathy_grade VARCHAR(5) NOT NULL DEFAULT '' CHECK (left_maculopathy_grade IN ('M0', 'M1', '')),
    left_photocoagulation VARCHAR(5) NOT NULL DEFAULT '' CHECK (left_photocoagulation IN ('yes', 'no', '')),
    left_ungradable VARCHAR(5) NOT NULL DEFAULT '' CHECK (left_ungradable IN ('yes', 'no', '')),
    left_visual_acuity TEXT NOT NULL DEFAULT '',

    -- Free-text clinical context
    clinical_context TEXT NOT NULL DEFAULT ''
);

CREATE INDEX diabetic_eye_screening_patient_id_idx
    ON diabetic_eye_screening (patient_id);
CREATE INDEX diabetic_eye_screening_clinician_id_idx
    ON diabetic_eye_screening (clinician_id);

CREATE TRIGGER trigger_diabetic_eye_screening_updated_at
    BEFORE UPDATE ON diabetic_eye_screening
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE diabetic_eye_screening IS
    'Main diabetic-eye-screening record for one DESP retinal screening episode: grading context, patient identification, and the right-eye and left-eye grading blocks (R grade, M grade, P marker, U marker, visual acuity). The worst-eye classification and recall / referral outcome, fired rules, and flags live in child tables.';
COMMENT ON COLUMN diabetic_eye_screening.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN diabetic_eye_screening.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN diabetic_eye_screening.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN diabetic_eye_screening.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN diabetic_eye_screening.patient_id IS
    'Foreign key to the patient this screening documents (restrict delete).';
COMMENT ON COLUMN diabetic_eye_screening.clinician_id IS
    'Foreign key to the screener / grader clinician (restrict delete); optional.';
COMMENT ON COLUMN diabetic_eye_screening.grader_name IS
    'Name of the screener / grader who assigned the grade.';
COMMENT ON COLUMN diabetic_eye_screening.grader_role IS
    'Grader role: screener, primary-grader, secondary-grader, ophthalmologist, or other.';
COMMENT ON COLUMN diabetic_eye_screening.graded_at IS
    'Date the grade was assigned; drives the patient-overdue comparison.';
COMMENT ON COLUMN diabetic_eye_screening.image_captured_at IS
    'Date the retinal images were captured.';
COMMENT ON COLUMN diabetic_eye_screening.imaging_media IS
    'Imaging modality: digital-fundus, mydriatic, non-mydriatic, oct, or other.';
COMMENT ON COLUMN diabetic_eye_screening.patient_identifier IS
    'Local or NHS patient identifier as recorded on the record.';
COMMENT ON COLUMN diabetic_eye_screening.age_band IS
    'Screening-eligible age band (>= 12); under-12 is outside programme eligibility.';
COMMENT ON COLUMN diabetic_eye_screening.diabetes_type IS
    'Diabetes type: type-1, type-2, other, or unknown.';
COMMENT ON COLUMN diabetic_eye_screening.years_since_diagnosis IS
    'Years since diabetes diagnosis.';
COMMENT ON COLUMN diabetic_eye_screening.previous_screen_date IS
    'Date of the most recent previous screen; drives overdue and low-risk eligibility.';
COMMENT ON COLUMN diabetic_eye_screening.previous_screen_result IS
    'Result of the previous screen: r0m0, background, referable, none, or unknown; r0m0 is required for low-risk 24-month recall.';
COMMENT ON COLUMN diabetic_eye_screening.right_retinopathy_grade IS
    'Right-eye retinopathy (R) grade: R0, R1, R2, R3A, or R3S.';
COMMENT ON COLUMN diabetic_eye_screening.right_maculopathy_grade IS
    'Right-eye maculopathy (M) grade: M0 or M1.';
COMMENT ON COLUMN diabetic_eye_screening.right_photocoagulation IS
    'Right-eye photocoagulation (P) marker: yes or no; contextual, does not change the pathway.';
COMMENT ON COLUMN diabetic_eye_screening.right_ungradable IS
    'Right-eye ungradable (U) marker: yes or no; yes routes to slit-lamp unless referable disease routes to HES.';
COMMENT ON COLUMN diabetic_eye_screening.right_visual_acuity IS
    'Right-eye visual acuity as recorded (e.g. logMAR or Snellen); optional.';
COMMENT ON COLUMN diabetic_eye_screening.left_retinopathy_grade IS
    'Left-eye retinopathy (R) grade: R0, R1, R2, R3A, or R3S.';
COMMENT ON COLUMN diabetic_eye_screening.left_maculopathy_grade IS
    'Left-eye maculopathy (M) grade: M0 or M1.';
COMMENT ON COLUMN diabetic_eye_screening.left_photocoagulation IS
    'Left-eye photocoagulation (P) marker: yes or no; contextual, does not change the pathway.';
COMMENT ON COLUMN diabetic_eye_screening.left_ungradable IS
    'Left-eye ungradable (U) marker: yes or no; yes routes to slit-lamp unless referable disease routes to HES.';
COMMENT ON COLUMN diabetic_eye_screening.left_visual_acuity IS
    'Left-eye visual acuity as recorded (e.g. logMAR or Snellen); optional.';
COMMENT ON COLUMN diabetic_eye_screening.clinical_context IS
    'Optional free-text clinical context shown in the summary.';
