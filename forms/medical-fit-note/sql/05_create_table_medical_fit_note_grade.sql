-- Computed validation result for a fit note.

CREATE TABLE medical_fit_note_grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    medical_fit_note_id UUID NOT NULL UNIQUE REFERENCES medical_fit_note(id) ON DELETE CASCADE,
    outcome VARCHAR(30) NOT NULL DEFAULT '' CHECK (outcome IN ('not-fit-for-work', 'may-be-fit-for-work', '')),
    approval_status VARCHAR(20) NOT NULL DEFAULT '' CHECK (approval_status IN ('approved', 'needs-completion', 'blocked', '')),
    duration_days INTEGER,
    adjustment_count INTEGER CHECK (adjustment_count IS NULL OR adjustment_count BETWEEN 0 AND 4),
    graded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trigger_medical_fit_note_grade_updated_at
    BEFORE UPDATE ON medical_fit_note_grade
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE medical_fit_note_grade IS
    'Medical fit note grade.';
COMMENT ON COLUMN medical_fit_note_grade.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN medical_fit_note_grade.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN medical_fit_note_grade.updated_at IS
    'Timestamp when this row was updated.';
COMMENT ON COLUMN medical_fit_note_grade.deleted_at IS
    'Soft-delete timestamp; NULL when the row is live.';
COMMENT ON COLUMN medical_fit_note_grade.medical_fit_note_id IS
    'Foreign key to the medical_fit_note table.';
COMMENT ON COLUMN medical_fit_note_grade.outcome IS
    'Outcome. One of: not-fit-for-work, may-be-fit-for-work.';
COMMENT ON COLUMN medical_fit_note_grade.approval_status IS
    'Approval status. One of: approved, needs-completion, blocked.';
COMMENT ON COLUMN medical_fit_note_grade.duration_days IS
    'Duration days.';
COMMENT ON COLUMN medical_fit_note_grade.adjustment_count IS
    'Adjustment count.';
COMMENT ON COLUMN medical_fit_note_grade.graded_at IS
    'Graded at.';
