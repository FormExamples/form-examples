-- Computed documentation-completeness grading result for an H&P clerking
-- record. The engine classifies the clerking as complete, partial, or
-- incomplete and reports a completeness percentage over the ten required
-- components. A completeness grade reflects the quality of the record, not
-- the correctness of the care.

CREATE TABLE history_and_physical_examination_grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    history_and_physical_examination_id UUID NOT NULL UNIQUE
        REFERENCES history_and_physical_examination(id) ON DELETE CASCADE,

    status VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (status IN ('complete', 'partial', 'incomplete', '')),
    completeness_percent INTEGER,

    graded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trigger_history_and_physical_examination_grade_updated_at
    BEFORE UPDATE ON history_and_physical_examination_grade
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE history_and_physical_examination_grade IS
    'Computed documentation-completeness grading result for an H&P clerking record: status (complete/partial/incomplete) and completeness percentage over the ten required components.';
COMMENT ON COLUMN history_and_physical_examination_grade.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN history_and_physical_examination_grade.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN history_and_physical_examination_grade.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN history_and_physical_examination_grade.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN history_and_physical_examination_grade.history_and_physical_examination_id IS
    'Foreign key to the parent H&P clerking record (unique, 1:1).';
COMMENT ON COLUMN history_and_physical_examination_grade.status IS
    'Completeness status: complete, partial, or incomplete.';
COMMENT ON COLUMN history_and_physical_examination_grade.completeness_percent IS
    'Completeness percentage (0..100): satisfied required components / ten total x 100.';
COMMENT ON COLUMN history_and_physical_examination_grade.graded_at IS
    'Timestamp when the engine last computed the grade.';
