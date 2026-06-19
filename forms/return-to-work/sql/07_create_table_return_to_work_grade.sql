-- Computed grading result for a Return to Work record.
-- One-to-one with the parent return_to_work record.

CREATE TABLE return_to_work_grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    return_to_work_id UUID NOT NULL UNIQUE
        REFERENCES return_to_work(id) ON DELETE CASCADE,

    fitness_statement VARCHAR(20) NOT NULL DEFAULT 'not-fit'
        CHECK (fitness_statement IN ('fit', 'may-be-fit', 'not-fit')),
    restriction_priority VARCHAR(20) NOT NULL DEFAULT 'routine'
        CHECK (restriction_priority IN ('routine', 'standard', 'restricted', 'high-risk')),
    rule_count INTEGER NOT NULL DEFAULT 0 CHECK (rule_count >= 0),
    flag_count INTEGER NOT NULL DEFAULT 0 CHECK (flag_count >= 0),
    graded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trigger_return_to_work_grade_updated_at
    BEFORE UPDATE ON return_to_work_grade
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE return_to_work_grade IS
    'Computed Return to Work grading result: the engine-derived fitness statement plus the composite restriction-priority grade. One-to-one child of return_to_work.';
COMMENT ON COLUMN return_to_work_grade.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN return_to_work_grade.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN return_to_work_grade.updated_at IS
    'Timestamp when this row was updated.';
COMMENT ON COLUMN return_to_work_grade.deleted_at IS
    'Timestamp when this row was deleted.';
COMMENT ON COLUMN return_to_work_grade.return_to_work_id IS
    'Foreign key to the return_to_work record.';
COMMENT ON COLUMN return_to_work_grade.fitness_statement IS
    'Engine-computed fitness statement: fit, may-be-fit, or not-fit.';
COMMENT ON COLUMN return_to_work_grade.restriction_priority IS
    'Composite restriction-priority grade: routine, standard, restricted, or high-risk.';
COMMENT ON COLUMN return_to_work_grade.rule_count IS
    'Total number of grading rules that fired.';
COMMENT ON COLUMN return_to_work_grade.flag_count IS
    'Total number of additional safety flags raised.';
COMMENT ON COLUMN return_to_work_grade.graded_at IS
    'Timestamp when the grading was computed.';
