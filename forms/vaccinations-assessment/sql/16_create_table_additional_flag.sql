CREATE TABLE vaccinations_assessment.additional_flag (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    grade_id UUID NOT NULL
        REFERENCES vaccinations_assessment.grade(id) ON DELETE CASCADE,
    flag_id VARCHAR(30) NOT NULL,
    category VARCHAR(50) NOT NULL DEFAULT '',
    message TEXT NOT NULL DEFAULT '',
    priority VARCHAR(10) NOT NULL DEFAULT 'low'
        CHECK (priority IN ('high', 'medium', 'low'))
);

CREATE TRIGGER trigger_additional_flag_updated_at
    BEFORE UPDATE ON vaccinations_assessment.additional_flag
    FOR EACH ROW
    EXECUTE FUNCTION vaccinations_assessment.set_updated_at();

COMMENT ON TABLE vaccinations_assessment.additional_flag IS
    'Additional flags raised during vaccination assessment. Many-to-one child of grade.';
COMMENT ON COLUMN vaccinations_assessment.additional_flag.flag_id IS
    'Identifier of the additional flag (e.g. FLAG-VAX-001).';
COMMENT ON COLUMN vaccinations_assessment.additional_flag.category IS
    'Category grouping for the flag.';
COMMENT ON COLUMN vaccinations_assessment.additional_flag.message IS
    'Human-readable message describing the flag.';
COMMENT ON COLUMN vaccinations_assessment.additional_flag.priority IS
    'Flag priority: high, medium, or low.';

COMMENT ON COLUMN vaccinations_assessment.additional_flag.grade_id IS
    'Foreign key to the grade table.';
COMMENT ON COLUMN vaccinations_assessment.additional_flag.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN vaccinations_assessment.additional_flag.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN vaccinations_assessment.additional_flag.updated_at IS
    'Timestamp when this row was updated.';
COMMENT ON COLUMN vaccinations_assessment.additional_flag.deleted_at IS
    'Timestamp when this row was deleted.';
