-- Computed 4AT grading result. Stores each item's sub-score, the summed
-- total (0-12), and the derived interpretation band.

CREATE TABLE four_a_test_for_delirium_grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    four_a_test_for_delirium_id UUID NOT NULL UNIQUE
        REFERENCES four_a_test_for_delirium(id) ON DELETE CASCADE,

    item1_score INT,
    item2_score INT,
    item3_score INT,
    item4_score INT,
    total_score INT CHECK (total_score IS NULL OR (total_score >= 0 AND total_score <= 12)),
    interpretation VARCHAR(40) NOT NULL DEFAULT ''
        CHECK (interpretation IN ('delirium-unlikely', 'possible-cognitive-impairment', 'possible-delirium', '')),

    graded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trigger_four_a_test_for_delirium_grade_updated_at
    BEFORE UPDATE ON four_a_test_for_delirium_grade
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE four_a_test_for_delirium_grade IS
    'Computed 4AT grading result: per-item sub-scores, summed total (0-12), and derived interpretation band.';
COMMENT ON COLUMN four_a_test_for_delirium_grade.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN four_a_test_for_delirium_grade.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN four_a_test_for_delirium_grade.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN four_a_test_for_delirium_grade.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN four_a_test_for_delirium_grade.four_a_test_for_delirium_id IS
    'Foreign key to the parent assessment (unique, 1:1).';
COMMENT ON COLUMN four_a_test_for_delirium_grade.item1_score IS
    'Sub-score for item 1, alertness (0 or 4).';
COMMENT ON COLUMN four_a_test_for_delirium_grade.item2_score IS
    'Sub-score for item 2, AMT4 (0, 1, or 2).';
COMMENT ON COLUMN four_a_test_for_delirium_grade.item3_score IS
    'Sub-score for item 3, attention via months backwards (0, 1, or 2).';
COMMENT ON COLUMN four_a_test_for_delirium_grade.item4_score IS
    'Sub-score for item 4, acute change or fluctuating course (0 or 4).';
COMMENT ON COLUMN four_a_test_for_delirium_grade.total_score IS
    'Summed 4AT score across the four items (0-12 when complete).';
COMMENT ON COLUMN four_a_test_for_delirium_grade.interpretation IS
    'Derived interpretation band: delirium-unlikely (0), possible-cognitive-impairment (1-3), or possible-delirium (>= 4).';
COMMENT ON COLUMN four_a_test_for_delirium_grade.graded_at IS
    'Timestamp when the engine last computed the grade.';
