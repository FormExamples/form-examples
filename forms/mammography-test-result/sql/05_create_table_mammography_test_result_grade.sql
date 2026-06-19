-- Computed interpretation grade for a mammography result (four-axis engine).

CREATE TABLE mammography_test_result_grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    mammography_test_result_id UUID NOT NULL UNIQUE
        REFERENCES mammography_test_result(id) ON DELETE CASCADE,

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

CREATE TRIGGER trigger_mammography_test_result_grade_updated_at
    BEFORE UPDATE ON mammography_test_result_grade
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE mammography_test_result_grade IS
    'Computed four-axis interpretation grade: result classification, abnormality severity / structured-reporting category, report completeness, and follow-up urgency. The BI-RADS final assessment category is the structured-reporting score carried in reporting_category and drives Axis A and Axis D: BI-RADS 1-2 = normal / routine; 3 = abnormal / recommended short-interval follow-up; 4-5 = abnormal or critical / urgent biopsy referral; 0 = inconclusive / further imaging; 6 = known malignancy. BI-RADS 4/5 auto-escalates the follow-up urgency and raises abnormal-requiring-action / urgent-referral flags regardless of the other axes.';
COMMENT ON COLUMN mammography_test_result_grade.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN mammography_test_result_grade.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN mammography_test_result_grade.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN mammography_test_result_grade.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN mammography_test_result_grade.mammography_test_result_id IS
    'Foreign key to the parent result (unique, 1:1).';
COMMENT ON COLUMN mammography_test_result_grade.result_classification IS
    'Axis A overall classification: normal, abnormal, critical, inconclusive. Mapped from the BI-RADS category (1-2 normal; 3/4a/4b abnormal; 4c/5 critical; 0 inconclusive; 6 abnormal known malignancy).';
COMMENT ON COLUMN mammography_test_result_grade.abnormality_severity IS
    'Axis B abnormality severity: none, minor, moderate, major.';
COMMENT ON COLUMN mammography_test_result_grade.reporting_category IS
    'Axis B structured-reporting score / category label carrying the BI-RADS final assessment category (e.g. "BI-RADS 4b").';
COMMENT ON COLUMN mammography_test_result_grade.report_completeness_percent IS
    'Axis C report completeness as a percentage of mandatory report sections (0-100).';
COMMENT ON COLUMN mammography_test_result_grade.follow_up_urgency IS
    'Axis D follow-up urgency: routine, recommended, urgent, critical-alert.';
COMMENT ON COLUMN mammography_test_result_grade.target_timeframe IS
    'Target timeframe for the recommended follow-up implied by the urgency (e.g. "routine screening interval", "6-month short-interval", "two-week-wait biopsy").';
COMMENT ON COLUMN mammography_test_result_grade.recommended_action IS
    'Axis D concise recommended action derived from the urgency and BI-RADS category.';
COMMENT ON COLUMN mammography_test_result_grade.recommendation IS
    'Overall recommendation: no-action, routine-follow-up, further-imaging, specialist-referral, urgent-review.';
COMMENT ON COLUMN mammography_test_result_grade.clinician_notes IS
    'Free-text interpretation / sign-off notes.';
COMMENT ON COLUMN mammography_test_result_grade.signed_at IS
    'Timestamp of the reporting clinician electronic signature.';
COMMENT ON COLUMN mammography_test_result_grade.graded_at IS
    'Timestamp when the engine last computed the result.';
