CREATE TABLE systematic_coronary_risk_evaluation_2_diabetes.grading_additional_flag (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    grade_id UUID NOT NULL
        REFERENCES systematic_coronary_risk_evaluation_2_diabetes.grade(id) ON DELETE CASCADE,
    flag_id VARCHAR(30) NOT NULL,
    category VARCHAR(100) NOT NULL DEFAULT '',
    message TEXT NOT NULL DEFAULT '',
    priority VARCHAR(10) NOT NULL DEFAULT 'medium'
        CHECK (priority IN ('high', 'medium', 'low'))
);

CREATE TRIGGER trigger_grading_additional_flag_updated_at
    BEFORE UPDATE ON systematic_coronary_risk_evaluation_2_diabetes.grading_additional_flag
    FOR EACH ROW
    EXECUTE FUNCTION systematic_coronary_risk_evaluation_2_diabetes.set_updated_at();

COMMENT ON TABLE systematic_coronary_risk_evaluation_2_diabetes.grading_additional_flag IS
    'Additional safety-critical flags detected during SCORE2-Diabetes assessment grading.';
COMMENT ON COLUMN systematic_coronary_risk_evaluation_2_diabetes.grading_additional_flag.flag_id IS
    'Identifier of the flag (e.g. FLAG-BP-001, FLAG-HBA1C-001).';
COMMENT ON COLUMN systematic_coronary_risk_evaluation_2_diabetes.grading_additional_flag.category IS
    'Category of the flag (e.g. Blood Pressure, Glycaemic Control, Medications).';
COMMENT ON COLUMN systematic_coronary_risk_evaluation_2_diabetes.grading_additional_flag.priority IS
    'Priority level: high, medium, or low.';

COMMENT ON COLUMN systematic_coronary_risk_evaluation_2_diabetes.grading_additional_flag.grade_id IS
    'Foreign key to the grade table.';
COMMENT ON COLUMN systematic_coronary_risk_evaluation_2_diabetes.grading_additional_flag.message IS
    'Message.';
COMMENT ON COLUMN systematic_coronary_risk_evaluation_2_diabetes.grading_additional_flag.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN systematic_coronary_risk_evaluation_2_diabetes.grading_additional_flag.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN systematic_coronary_risk_evaluation_2_diabetes.grading_additional_flag.updated_at IS
    'Timestamp when this row was updated.';
COMMENT ON COLUMN systematic_coronary_risk_evaluation_2_diabetes.grading_additional_flag.deleted_at IS
    'Timestamp when this row was deleted.';
