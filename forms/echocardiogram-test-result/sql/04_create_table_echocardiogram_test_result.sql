-- Echocardiogram (echo) result (report) — the source-of-truth record.

CREATE TABLE echocardiogram_test_result (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    patient_id UUID NOT NULL REFERENCES patient(id) ON DELETE CASCADE,
    clinician_id UUID NOT NULL REFERENCES clinician(id) ON DELETE CASCADE,

    -- Report identification
    originating_request_reference VARCHAR(255) NOT NULL DEFAULT '',
    echo_type VARCHAR(25) NOT NULL DEFAULT ''
        CHECK (echo_type IN ('transthoracic-tte', 'transoesophageal-toe', 'stress-echo', 'contrast-echo', 'other', '')),
    performed_date DATE,
    reported_date DATE,
    report_status VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (report_status IN ('preliminary', 'final', 'amended', 'cancelled', '')),
    study_quality VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (study_quality IN ('good', 'adequate', 'limited', 'poor', '')),

    -- Clinical context
    clinical_history VARCHAR(1000) NOT NULL DEFAULT '',

    -- Left-ventricular function and dimensions
    lv_ejection_fraction_percent NUMERIC(4,1)
        CHECK (lv_ejection_fraction_percent IS NULL OR lv_ejection_fraction_percent BETWEEN 0 AND 100),
    lv_function VARCHAR(25) NOT NULL DEFAULT ''
        CHECK (lv_function IN ('normal', 'mildly-impaired', 'moderately-impaired', 'severely-impaired', '')),
    lv_internal_diameter_diastole_mm NUMERIC(5,1)
        CHECK (lv_internal_diameter_diastole_mm IS NULL OR lv_internal_diameter_diastole_mm BETWEEN 0 AND 200),

    -- Valves
    aortic_stenosis VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (aortic_stenosis IN ('none', 'mild', 'moderate', 'severe', '')),
    aortic_regurgitation VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (aortic_regurgitation IN ('none', 'mild', 'moderate', 'severe', '')),
    mitral_stenosis VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (mitral_stenosis IN ('none', 'mild', 'moderate', 'severe', '')),
    mitral_regurgitation VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (mitral_regurgitation IN ('none', 'mild', 'moderate', 'severe', '')),

    -- Pulmonary pressures
    pulmonary_artery_systolic_pressure_mmhg NUMERIC(5,1)
        CHECK (pulmonary_artery_systolic_pressure_mmhg IS NULL OR pulmonary_artery_systolic_pressure_mmhg BETWEEN 0 AND 200),

    -- Structured findings
    lv_hypertrophy BOOLEAN NOT NULL DEFAULT FALSE,
    regional_wall_motion_abnormality BOOLEAN NOT NULL DEFAULT FALSE,
    pericardial_effusion BOOLEAN NOT NULL DEFAULT FALSE,
    vegetation BOOLEAN NOT NULL DEFAULT FALSE,
    intracardiac_thrombus BOOLEAN NOT NULL DEFAULT FALSE,
    normal_study BOOLEAN NOT NULL DEFAULT FALSE,

    -- Findings and impression
    findings_narrative VARCHAR(2000) NOT NULL DEFAULT '',
    comparison_with_previous VARCHAR(1000) NOT NULL DEFAULT '',
    impression VARCHAR(2000) NOT NULL DEFAULT '',
    reporting_category VARCHAR(100) NOT NULL DEFAULT '',
    recommended_follow_up VARCHAR(1000) NOT NULL DEFAULT '',

    -- Critical-result communication
    critical_result_communicated BOOLEAN NOT NULL DEFAULT FALSE,
    reported_to VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX index_echocardiogram_test_result_patient_id
    ON echocardiogram_test_result(patient_id);
CREATE INDEX index_echocardiogram_test_result_clinician_id
    ON echocardiogram_test_result(clinician_id);

CREATE TRIGGER trigger_echocardiogram_test_result_updated_at
    BEFORE UPDATE ON echocardiogram_test_result
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE echocardiogram_test_result IS
    'Echocardiogram (echo) result (report). Captures the performed study type and quality, clinical history, left-ventricular function (ejection fraction, qualitative function, LV internal diameter), valvular stenosis and regurgitation grades, estimated pulmonary artery systolic pressure, structured findings, the narrative findings, comparison with previous studies, the impression, a structured reporting category, and recommended follow-up plus critical-result communication. This is the source-of-truth record that the four-axis interpretation grade is computed from.';
COMMENT ON COLUMN echocardiogram_test_result.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN echocardiogram_test_result.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN echocardiogram_test_result.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN echocardiogram_test_result.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN echocardiogram_test_result.patient_id IS
    'Foreign key to the patient.';
COMMENT ON COLUMN echocardiogram_test_result.clinician_id IS
    'Foreign key to the reporting clinician (cardiologist / cardiac physiologist / sonographer).';
COMMENT ON COLUMN echocardiogram_test_result.originating_request_reference IS
    'Free-text reference linking this report back to the originating echocardiogram request (referral).';
COMMENT ON COLUMN echocardiogram_test_result.echo_type IS
    'Performed echo modality: transthoracic-tte, transoesophageal-toe, stress-echo, contrast-echo, other.';
COMMENT ON COLUMN echocardiogram_test_result.performed_date IS
    'Date the echocardiogram study was performed.';
COMMENT ON COLUMN echocardiogram_test_result.reported_date IS
    'Date the report was authored / signed.';
COMMENT ON COLUMN echocardiogram_test_result.report_status IS
    'Report lifecycle status: preliminary, final, amended, cancelled.';
COMMENT ON COLUMN echocardiogram_test_result.study_quality IS
    'Acoustic-window / image quality of the study: good, adequate, limited, poor.';
COMMENT ON COLUMN echocardiogram_test_result.clinical_history IS
    'Clinical history and the question the study was performed to answer.';
COMMENT ON COLUMN echocardiogram_test_result.lv_ejection_fraction_percent IS
    'Left-ventricular ejection fraction (LVEF) as a percentage (0-100).';
COMMENT ON COLUMN echocardiogram_test_result.lv_function IS
    'Qualitative left-ventricular systolic function: normal, mildly-impaired, moderately-impaired, severely-impaired.';
COMMENT ON COLUMN echocardiogram_test_result.lv_internal_diameter_diastole_mm IS
    'Left-ventricular internal diameter at end-diastole (LVIDd) in millimetres.';
COMMENT ON COLUMN echocardiogram_test_result.aortic_stenosis IS
    'Aortic stenosis severity: none, mild, moderate, severe.';
COMMENT ON COLUMN echocardiogram_test_result.aortic_regurgitation IS
    'Aortic regurgitation severity: none, mild, moderate, severe.';
COMMENT ON COLUMN echocardiogram_test_result.mitral_stenosis IS
    'Mitral stenosis severity: none, mild, moderate, severe.';
COMMENT ON COLUMN echocardiogram_test_result.mitral_regurgitation IS
    'Mitral regurgitation severity: none, mild, moderate, severe.';
COMMENT ON COLUMN echocardiogram_test_result.pulmonary_artery_systolic_pressure_mmhg IS
    'Estimated pulmonary artery systolic pressure (PASP) in mmHg.';
COMMENT ON COLUMN echocardiogram_test_result.lv_hypertrophy IS
    'Whether left-ventricular hypertrophy is present.';
COMMENT ON COLUMN echocardiogram_test_result.regional_wall_motion_abnormality IS
    'Whether a regional wall-motion abnormality (RWMA) is present.';
COMMENT ON COLUMN echocardiogram_test_result.pericardial_effusion IS
    'Whether a pericardial effusion is present.';
COMMENT ON COLUMN echocardiogram_test_result.vegetation IS
    'Whether a valvular vegetation (suspected endocarditis) is present.';
COMMENT ON COLUMN echocardiogram_test_result.intracardiac_thrombus IS
    'Whether an intracardiac thrombus is present.';
COMMENT ON COLUMN echocardiogram_test_result.normal_study IS
    'Whether the study is reported as entirely normal.';
COMMENT ON COLUMN echocardiogram_test_result.findings_narrative IS
    'Narrative description of the echocardiographic findings (the body of the report).';
COMMENT ON COLUMN echocardiogram_test_result.comparison_with_previous IS
    'Comparison with relevant previous echocardiogram studies.';
COMMENT ON COLUMN echocardiogram_test_result.impression IS
    'Summary impression / conclusion answering the clinical question.';
COMMENT ON COLUMN echocardiogram_test_result.reporting_category IS
    'Free-text structured-reporting category or summary label (e.g. a severity / surveillance category).';
COMMENT ON COLUMN echocardiogram_test_result.recommended_follow_up IS
    'Recommended follow-up imaging, referral, or management.';
COMMENT ON COLUMN echocardiogram_test_result.critical_result_communicated IS
    'Whether a critical or unexpected significant result was communicated directly to the referrer.';
COMMENT ON COLUMN echocardiogram_test_result.reported_to IS
    'Who the critical / urgent result was communicated to, with date and time if applicable.';
