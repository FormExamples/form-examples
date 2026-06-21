-- Eye vision test result (report) — the source-of-truth record.

CREATE TABLE eye_vision_test_result (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    patient_id UUID NOT NULL REFERENCES patient(id) ON DELETE CASCADE,
    clinician_id UUID NOT NULL REFERENCES clinician(id) ON DELETE CASCADE,

    -- Report identification
    originating_request_reference VARCHAR(255) NOT NULL DEFAULT '',
    report_status VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (report_status IN ('preliminary', 'final', 'amended', 'cancelled', '')),
    test_type VARCHAR(35) NOT NULL DEFAULT ''
        CHECK (test_type IN ('visual-acuity', 'visual-fields', 'refraction', 'fundus-examination', 'optical-coherence-tomography', 'fluorescein-angiography', 'tonometry', 'slit-lamp', 'orthoptic-assessment', 'other', '')),
    performed_date DATE,
    reported_date DATE,

    -- Clinical context
    clinical_history VARCHAR(1000) NOT NULL DEFAULT '',

    -- Measurements
    visual_acuity_right VARCHAR(20) NOT NULL DEFAULT '',
    visual_acuity_left VARCHAR(20) NOT NULL DEFAULT '',
    intraocular_pressure_right_mmhg NUMERIC(4,1)
        CHECK (intraocular_pressure_right_mmhg IS NULL OR intraocular_pressure_right_mmhg BETWEEN 0 AND 100),
    intraocular_pressure_left_mmhg NUMERIC(4,1)
        CHECK (intraocular_pressure_left_mmhg IS NULL OR intraocular_pressure_left_mmhg BETWEEN 0 AND 100),
    visual_field_result VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (visual_field_result IN ('full', 'defect-right', 'defect-left', 'bilateral-defect', '')),

    -- Structured findings
    reduced_visual_acuity BOOLEAN NOT NULL DEFAULT FALSE,
    visual_field_defect BOOLEAN NOT NULL DEFAULT FALSE,
    raised_intraocular_pressure BOOLEAN NOT NULL DEFAULT FALSE,
    diabetic_retinopathy BOOLEAN NOT NULL DEFAULT FALSE,
    optic_disc_abnormality BOOLEAN NOT NULL DEFAULT FALSE,
    macular_abnormality BOOLEAN NOT NULL DEFAULT FALSE,
    normal_examination BOOLEAN NOT NULL DEFAULT FALSE,
    retinopathy_grade VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (retinopathy_grade IN ('none', 'background', 'pre-proliferative', 'proliferative', 'maculopathy', 'not-applicable', '')),

    -- Findings and impression
    findings_narrative VARCHAR(2000) NOT NULL DEFAULT '',
    impression VARCHAR(2000) NOT NULL DEFAULT '',
    reporting_category VARCHAR(100) NOT NULL DEFAULT '',
    recommended_follow_up VARCHAR(1000) NOT NULL DEFAULT '',

    -- Critical-result communication
    critical_result_communicated BOOLEAN NOT NULL DEFAULT FALSE,
    reported_to VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX index_eye_vision_test_result_patient_id
    ON eye_vision_test_result(patient_id);
CREATE INDEX index_eye_vision_test_result_clinician_id
    ON eye_vision_test_result(clinician_id);

CREATE TRIGGER trigger_eye_vision_test_result_updated_at
    BEFORE UPDATE ON eye_vision_test_result
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE eye_vision_test_result IS
    'Eye vision test result (report) for an ophthalmic / optometric examination. Captures the performed test type, clinical history, the visual-acuity / intraocular-pressure / visual-field measurements, the narrative and structured findings (including diabetic retinopathy grading), the impression, recommended follow-up, and critical-result communication. This is the source-of-truth record that the four-axis interpretation grade is computed from.';
COMMENT ON COLUMN eye_vision_test_result.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN eye_vision_test_result.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN eye_vision_test_result.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN eye_vision_test_result.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN eye_vision_test_result.patient_id IS
    'Foreign key to the patient.';
COMMENT ON COLUMN eye_vision_test_result.clinician_id IS
    'Foreign key to the reporting clinician (ophthalmologist / optometrist / orthoptist).';
COMMENT ON COLUMN eye_vision_test_result.originating_request_reference IS
    'Free-text reference linking this report back to the originating eye vision test request (referral).';
COMMENT ON COLUMN eye_vision_test_result.report_status IS
    'Report lifecycle status: preliminary, final, amended, cancelled.';
COMMENT ON COLUMN eye_vision_test_result.test_type IS
    'Performed eye examination type: visual-acuity, visual-fields, refraction, fundus-examination, optical-coherence-tomography, fluorescein-angiography, tonometry, slit-lamp, orthoptic-assessment, other.';
COMMENT ON COLUMN eye_vision_test_result.performed_date IS
    'Date the eye examination was performed.';
COMMENT ON COLUMN eye_vision_test_result.reported_date IS
    'Date the report was authored / signed.';
COMMENT ON COLUMN eye_vision_test_result.clinical_history IS
    'Clinical history and the question the examination was performed to answer.';
COMMENT ON COLUMN eye_vision_test_result.visual_acuity_right IS
    'Best-corrected visual acuity for the right eye, as text (e.g. 6/6, 6/9, CF, HM).';
COMMENT ON COLUMN eye_vision_test_result.visual_acuity_left IS
    'Best-corrected visual acuity for the left eye, as text (e.g. 6/6, 6/9, CF, HM).';
COMMENT ON COLUMN eye_vision_test_result.intraocular_pressure_right_mmhg IS
    'Intraocular pressure of the right eye in mmHg.';
COMMENT ON COLUMN eye_vision_test_result.intraocular_pressure_left_mmhg IS
    'Intraocular pressure of the left eye in mmHg.';
COMMENT ON COLUMN eye_vision_test_result.visual_field_result IS
    'Visual-field result: full, defect-right, defect-left, bilateral-defect.';
COMMENT ON COLUMN eye_vision_test_result.reduced_visual_acuity IS
    'Whether reduced visual acuity is present in one or both eyes.';
COMMENT ON COLUMN eye_vision_test_result.visual_field_defect IS
    'Whether a visual-field defect is present.';
COMMENT ON COLUMN eye_vision_test_result.raised_intraocular_pressure IS
    'Whether intraocular pressure is raised (e.g. ocular hypertension / suspected glaucoma).';
COMMENT ON COLUMN eye_vision_test_result.diabetic_retinopathy IS
    'Whether diabetic retinopathy is present.';
COMMENT ON COLUMN eye_vision_test_result.optic_disc_abnormality IS
    'Whether an optic-disc abnormality (e.g. cupping, swelling, pallor) is present.';
COMMENT ON COLUMN eye_vision_test_result.macular_abnormality IS
    'Whether a macular abnormality (e.g. maculopathy, oedema, degeneration) is present.';
COMMENT ON COLUMN eye_vision_test_result.normal_examination IS
    'Whether the examination is entirely normal.';
COMMENT ON COLUMN eye_vision_test_result.retinopathy_grade IS
    'Diabetic-retinopathy grade: none, background, pre-proliferative, proliferative, maculopathy, not-applicable.';
COMMENT ON COLUMN eye_vision_test_result.findings_narrative IS
    'Narrative description of the examination findings (the body of the report).';
COMMENT ON COLUMN eye_vision_test_result.impression IS
    'Summary impression / conclusion answering the clinical question.';
COMMENT ON COLUMN eye_vision_test_result.reporting_category IS
    'Free-text structured-reporting category label (e.g. a diabetic eye screening grade such as R0/R1/R2/R3/M1).';
COMMENT ON COLUMN eye_vision_test_result.recommended_follow_up IS
    'Recommended follow-up examination, referral, or management.';
COMMENT ON COLUMN eye_vision_test_result.critical_result_communicated IS
    'Whether a critical or unexpected significant result was communicated directly to the referrer.';
COMMENT ON COLUMN eye_vision_test_result.reported_to IS
    'Who the critical / urgent result was communicated to, with date and time if applicable.';
