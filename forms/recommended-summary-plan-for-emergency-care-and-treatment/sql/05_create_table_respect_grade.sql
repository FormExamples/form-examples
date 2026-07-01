-- Computed documentation-completeness result for a ReSPECT plan. The engine
-- classifies the plan as complete (every mandatory rule satisfied) or
-- incomplete, and reports a completeness percentage counting populated
-- mandatory fields. A completeness grade reflects the quality of the record,
-- not any clinical score or the correctness of the care.

CREATE TABLE respect_grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    respect_id UUID NOT NULL UNIQUE
        REFERENCES respect(id) ON DELETE CASCADE,

    status VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (status IN ('complete', 'incomplete', '')),
    completeness_percent INTEGER,

    graded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trigger_respect_grade_updated_at
    BEFORE UPDATE ON respect_grade
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE respect_grade IS
    'Computed documentation-completeness result for a ReSPECT plan: status (complete when all eight mandatory rules are satisfied, otherwise incomplete) and completeness percentage.';
COMMENT ON COLUMN respect_grade.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN respect_grade.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN respect_grade.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN respect_grade.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN respect_grade.respect_id IS
    'Foreign key to the parent ReSPECT plan (unique, 1:1).';
COMMENT ON COLUMN respect_grade.status IS
    'Completeness status: complete (all mandatory rules satisfied) or incomplete.';
COMMENT ON COLUMN respect_grade.completeness_percent IS
    'Completeness percentage (0..100): populated mandatory fields / total mandatory fields x 100, reported for both statuses.';
COMMENT ON COLUMN respect_grade.graded_at IS
    'Timestamp when the engine last computed the grade.';
