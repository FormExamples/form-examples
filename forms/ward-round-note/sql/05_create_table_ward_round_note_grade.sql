-- Computed documentation-completeness grading result for a ward-round
-- note. The engine classifies the entry as complete, partial, or
-- incomplete over the eight required components and reports a completeness
-- percentage. A completeness grade reflects the quality of the record,
-- not the correctness of the care.

CREATE TABLE ward_round_note_grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    ward_round_note_id UUID NOT NULL UNIQUE
        REFERENCES ward_round_note(id) ON DELETE CASCADE,

    status VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (status IN ('complete', 'partial', 'incomplete', '')),
    completeness_percent INTEGER,

    header_documented VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (header_documented IN ('yes', 'no', '')),
    problems_documented VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (problems_documented IN ('yes', 'no', '')),
    examination_documented VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (examination_documented IN ('yes', 'no', '')),
    investigations_documented VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (investigations_documented IN ('yes', 'no', '')),
    vte_documented VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (vte_documented IN ('yes', 'no', '')),
    medication_documented VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (medication_documented IN ('yes', 'no', '')),
    plan_documented VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (plan_documented IN ('yes', 'no', '')),
    escalation_documented VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (escalation_documented IN ('yes', 'no', '')),

    graded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trigger_ward_round_note_grade_updated_at
    BEFORE UPDATE ON ward_round_note_grade
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE ward_round_note_grade IS
    'Computed documentation-completeness grading result for a ward-round note: status (complete/partial/incomplete), completeness percentage over the eight required components, and per-component presence flags.';
COMMENT ON COLUMN ward_round_note_grade.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN ward_round_note_grade.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN ward_round_note_grade.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN ward_round_note_grade.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN ward_round_note_grade.ward_round_note_id IS
    'Foreign key to the parent ward-round note (unique, 1:1).';
COMMENT ON COLUMN ward_round_note_grade.status IS
    'Completeness status: complete, partial, or incomplete.';
COMMENT ON COLUMN ward_round_note_grade.completeness_percent IS
    'Completeness percentage (0..100): documented required components / 8 x 100.';
COMMENT ON COLUMN ward_round_note_grade.header_documented IS
    'Whether the header component is documented (yes/no).';
COMMENT ON COLUMN ward_round_note_grade.problems_documented IS
    'Whether the problems component is documented (yes/no).';
COMMENT ON COLUMN ward_round_note_grade.examination_documented IS
    'Whether the examination component is documented (yes/no).';
COMMENT ON COLUMN ward_round_note_grade.investigations_documented IS
    'Whether the investigations component is documented (yes/no).';
COMMENT ON COLUMN ward_round_note_grade.vte_documented IS
    'Whether the VTE component is documented (yes/no).';
COMMENT ON COLUMN ward_round_note_grade.medication_documented IS
    'Whether the medication component is documented (yes/no).';
COMMENT ON COLUMN ward_round_note_grade.plan_documented IS
    'Whether the plan component is documented (yes/no).';
COMMENT ON COLUMN ward_round_note_grade.escalation_documented IS
    'Whether the escalation component is documented (yes/no).';
COMMENT ON COLUMN ward_round_note_grade.graded_at IS
    'Timestamp when the engine last computed the grade.';
