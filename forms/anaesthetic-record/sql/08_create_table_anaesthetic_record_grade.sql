-- Computed completeness grading result for an anaesthetic record. Stores the
-- overall completeness status (Complete / Partial / Incomplete) and the
-- completeness percent derived by the engine from the mandatory-item rules.

CREATE TABLE anaesthetic_record_grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    anaesthetic_record_id UUID NOT NULL UNIQUE
        REFERENCES anaesthetic_record(id) ON DELETE CASCADE,

    status VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (status IN ('complete', 'partial', 'incomplete', '')),
    completeness_percent INTEGER NOT NULL DEFAULT 0
        CHECK (completeness_percent BETWEEN 0 AND 100),
    graded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trigger_anaesthetic_record_grade_updated_at
    BEFORE UPDATE ON anaesthetic_record_grade
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE anaesthetic_record_grade IS
    'Computed completeness grading result for an anaesthetic record: overall status and completeness percent.';
COMMENT ON COLUMN anaesthetic_record_grade.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN anaesthetic_record_grade.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN anaesthetic_record_grade.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN anaesthetic_record_grade.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN anaesthetic_record_grade.anaesthetic_record_id IS
    'Foreign key to the parent anaesthetic record (unique, 1:1).';
COMMENT ON COLUMN anaesthetic_record_grade.status IS
    'Overall completeness status: complete, partial, or incomplete.';
COMMENT ON COLUMN anaesthetic_record_grade.completeness_percent IS
    'Proportion (0-100) of mandatory-item rules satisfied.';
COMMENT ON COLUMN anaesthetic_record_grade.graded_at IS
    'Timestamp when the engine last computed the grade.';
