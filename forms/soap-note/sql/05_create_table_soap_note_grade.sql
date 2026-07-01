-- Computed documentation-completeness grading result for a SOAP note.
-- The engine classifies the note as complete, partial, or incomplete and
-- reports a completeness percentage. A completeness grade reflects the
-- quality of the record, not the correctness of the care.

CREATE TABLE soap_note_grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    soap_note_id UUID NOT NULL UNIQUE
        REFERENCES soap_note(id) ON DELETE CASCADE,

    status VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (status IN ('complete', 'partial', 'incomplete', '')),
    completeness_percent INTEGER,

    subjective_present VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (subjective_present IN ('yes', 'no', '')),
    objective_present VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (objective_present IN ('yes', 'no', '')),
    assessment_present VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (assessment_present IN ('yes', 'no', '')),
    plan_present VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (plan_present IN ('yes', 'no', '')),

    graded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trigger_soap_note_grade_updated_at
    BEFORE UPDATE ON soap_note_grade
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE soap_note_grade IS
    'Computed documentation-completeness grading result for a SOAP note: status (complete/partial/incomplete), completeness percentage, and per-section presence flags.';
COMMENT ON COLUMN soap_note_grade.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN soap_note_grade.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN soap_note_grade.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN soap_note_grade.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN soap_note_grade.soap_note_id IS
    'Foreign key to the parent SOAP note (unique, 1:1).';
COMMENT ON COLUMN soap_note_grade.status IS
    'Completeness status: complete, partial, or incomplete.';
COMMENT ON COLUMN soap_note_grade.completeness_percent IS
    'Completeness percentage (0..100): present required components / total required components x 100.';
COMMENT ON COLUMN soap_note_grade.subjective_present IS
    'Whether the Subjective section is present (yes/no).';
COMMENT ON COLUMN soap_note_grade.objective_present IS
    'Whether the Objective section is present (yes/no).';
COMMENT ON COLUMN soap_note_grade.assessment_present IS
    'Whether the Assessment section is present (yes/no).';
COMMENT ON COLUMN soap_note_grade.plan_present IS
    'Whether the Plan section is present (yes/no).';
COMMENT ON COLUMN soap_note_grade.graded_at IS
    'Timestamp when the engine last computed the grade.';
