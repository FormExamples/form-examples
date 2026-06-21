-- Computed interpretation grade for an ABPM result (four-axis engine).

CREATE TABLE ambulatory_blood_pressure_test_result_grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    ambulatory_blood_pressure_test_result_id UUID NOT NULL UNIQUE
        REFERENCES ambulatory_blood_pressure_test_result(id) ON DELETE CASCADE,

    -- Axis A: result classification
    result_classification VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (result_classification IN ('normal', 'abnormal', 'critical', 'inconclusive', '')),

    -- Axis B: severity and structured reporting
    abnormality_severity VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (abnormality_severity IN ('none', 'minor', 'moderate', 'major', '')),
    reporting_category VARCHAR(50) NOT NULL DEFAULT '',

    -- Axis C: report completeness
    report_completeness_percent INTEGER
        CHECK (report_completeness_percent IS NULL OR report_completeness_percent BETWEEN 0 AND 100),

    -- Axis D: follow-up urgency
    follow_up_urgency VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (follow_up_urgency IN ('routine', 'recommended', 'urgent', 'critical-alert', '')),
    target_timeframe VARCHAR(50) NOT NULL DEFAULT '',
    recommended_action VARCHAR(500) NOT NULL DEFAULT '',

    recommendation VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (recommendation IN ('no-action', 'routine-follow-up', 'further-imaging', 'specialist-referral', 'urgent-review', '')),
    clinician_notes TEXT NOT NULL DEFAULT '',
    signed_at TIMESTAMPTZ,
    graded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trigger_ambulatory_blood_pressure_test_result_grade_updated_at
    BEFORE UPDATE ON ambulatory_blood_pressure_test_result_grade
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE ambulatory_blood_pressure_test_result_grade IS
    'Computed four-axis interpretation grade: result classification, abnormality severity / structured-reporting category, report completeness, and follow-up urgency. A severe-hypertension result (ABPM average >= 150/95, equivalent to clinic >= 180/120) auto-escalates the follow-up urgency to critical-alert regardless of the other axes.';
COMMENT ON COLUMN ambulatory_blood_pressure_test_result_grade.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN ambulatory_blood_pressure_test_result_grade.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN ambulatory_blood_pressure_test_result_grade.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN ambulatory_blood_pressure_test_result_grade.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN ambulatory_blood_pressure_test_result_grade.ambulatory_blood_pressure_test_result_id IS
    'Foreign key to the parent result (unique, 1:1).';
COMMENT ON COLUMN ambulatory_blood_pressure_test_result_grade.result_classification IS
    'Axis A overall classification: normal, abnormal, critical, inconclusive.';
COMMENT ON COLUMN ambulatory_blood_pressure_test_result_grade.abnormality_severity IS
    'Axis B abnormality severity: none, minor, moderate, major.';
COMMENT ON COLUMN ambulatory_blood_pressure_test_result_grade.reporting_category IS
    'Axis B structured-reporting category label (e.g. the hypertension stage: normotensive, stage 1, stage 2, severe).';
COMMENT ON COLUMN ambulatory_blood_pressure_test_result_grade.report_completeness_percent IS
    'Axis C report completeness as a percentage of mandatory report sections (0-100).';
COMMENT ON COLUMN ambulatory_blood_pressure_test_result_grade.follow_up_urgency IS
    'Axis D follow-up urgency: routine, recommended, urgent, critical-alert.';
COMMENT ON COLUMN ambulatory_blood_pressure_test_result_grade.target_timeframe IS
    'Target timeframe for the recommended follow-up implied by the urgency.';
COMMENT ON COLUMN ambulatory_blood_pressure_test_result_grade.recommended_action IS
    'Axis D concise recommended action derived from the urgency.';
COMMENT ON COLUMN ambulatory_blood_pressure_test_result_grade.recommendation IS
    'Overall recommendation: no-action, routine-follow-up, further-imaging, specialist-referral, urgent-review.';
COMMENT ON COLUMN ambulatory_blood_pressure_test_result_grade.clinician_notes IS
    'Free-text interpretation / sign-off notes.';
COMMENT ON COLUMN ambulatory_blood_pressure_test_result_grade.signed_at IS
    'Timestamp of the reporting clinician electronic signature.';
COMMENT ON COLUMN ambulatory_blood_pressure_test_result_grade.graded_at IS
    'Timestamp when the engine last computed the result.';
