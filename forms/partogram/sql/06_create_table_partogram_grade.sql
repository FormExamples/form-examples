-- Computed labour-progress grading result for a partogram. Stores the overall
-- progress classification (Normal / Alert-line crossed / Action-line crossed)
-- and the latest cervical dilatation the engine plotted against the alert and
-- action reference lines. One row per partogram (1:1).

CREATE TABLE partogram_grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    partogram_id UUID NOT NULL UNIQUE
        REFERENCES partogram(id) ON DELETE CASCADE,

    progress_status VARCHAR(25) NOT NULL DEFAULT ''
        CHECK (progress_status IN ('normal', 'alert-line-crossed', 'action-line-crossed', '')),
    latest_dilatation_cm NUMERIC(3,1)
        CHECK (latest_dilatation_cm IS NULL OR latest_dilatation_cm BETWEEN 0 AND 10),
    graded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trigger_partogram_grade_updated_at
    BEFORE UPDATE ON partogram_grade
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE partogram_grade IS
    'Computed labour-progress grading result for a partogram: overall progress classification and the latest cervical dilatation plotted against the alert and action lines.';
COMMENT ON COLUMN partogram_grade.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN partogram_grade.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN partogram_grade.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN partogram_grade.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN partogram_grade.partogram_id IS
    'Foreign key to the parent partogram labour record (unique, 1:1).';
COMMENT ON COLUMN partogram_grade.progress_status IS
    'Overall labour-progress classification: normal, alert-line-crossed, or action-line-crossed.';
COMMENT ON COLUMN partogram_grade.latest_dilatation_cm IS
    'Latest observed cervical dilatation in centimetres (0-10) that the engine plotted against the reference lines.';
COMMENT ON COLUMN partogram_grade.graded_at IS
    'Timestamp when the engine last computed the grade.';
