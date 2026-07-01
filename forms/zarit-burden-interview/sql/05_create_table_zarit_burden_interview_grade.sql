-- Computed Zarit Burden Interview grading result. Stores the summed total
-- over the active item set, the maximum attainable score, the derived
-- burden band, and the 12-item short-form subtotal.

CREATE TABLE zarit_burden_interview_grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    zarit_burden_interview_id UUID NOT NULL UNIQUE
        REFERENCES zarit_burden_interview(id) ON DELETE CASCADE,

    total_score INT,
    max_score INT,
    burden_band VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (burden_band IN ('little-or-none', 'mild-to-moderate', 'moderate-to-severe', 'severe', 'lower', 'high', '')),
    short_form_score INT,

    graded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trigger_zarit_burden_interview_grade_updated_at
    BEFORE UPDATE ON zarit_burden_interview_grade
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE zarit_burden_interview_grade IS
    'Computed Zarit Burden Interview grading result: total over the active item set, maximum score, derived burden band, and 12-item short-form subtotal.';
COMMENT ON COLUMN zarit_burden_interview_grade.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN zarit_burden_interview_grade.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN zarit_burden_interview_grade.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN zarit_burden_interview_grade.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN zarit_burden_interview_grade.zarit_burden_interview_id IS
    'Foreign key to the parent assessment (unique, 1:1).';
COMMENT ON COLUMN zarit_burden_interview_grade.total_score IS
    'Summed rating over the active item set: 0-88 for zbi22, 0-48 for zbi12.';
COMMENT ON COLUMN zarit_burden_interview_grade.max_score IS
    'Maximum attainable score for the active item set: 88 for zbi22, 48 for zbi12.';
COMMENT ON COLUMN zarit_burden_interview_grade.burden_band IS
    'Derived burden band: little-or-none, mild-to-moderate, moderate-to-severe, or severe (zbi22); lower or high (zbi12).';
COMMENT ON COLUMN zarit_burden_interview_grade.short_form_score IS
    'Summed rating over the 12-item short-form subset (items 1,2,3,6,9,10,11,12,17,20,21,22); 0-48 when complete, or NULL when not computed.';
COMMENT ON COLUMN zarit_burden_interview_grade.graded_at IS
    'Timestamp when the engine last computed the grade.';
