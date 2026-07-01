-- Computed EPDS grading result. Stores the summed total (0-30), the
-- derived interpretation band, item 10's self-harm score, and the
-- mandatory self-harm flag. Fired rules and red-flag issues live in
-- dedicated child tables.

CREATE TABLE edinburgh_postnatal_depression_scale_grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    edinburgh_postnatal_depression_scale_id UUID NOT NULL UNIQUE
        REFERENCES edinburgh_postnatal_depression_scale(id) ON DELETE CASCADE,

    total_score INT,
    interpretation VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (interpretation IN ('lower', 'possible', 'likely', '')),
    item_10_score INT,
    self_harm_flag VARCHAR(3) NOT NULL DEFAULT ''
        CHECK (self_harm_flag IN ('yes', 'no', '')),

    graded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trigger_edinburgh_postnatal_depression_scale_grade_updated_at
    BEFORE UPDATE ON edinburgh_postnatal_depression_scale_grade
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE edinburgh_postnatal_depression_scale_grade IS
    'Computed EPDS grading result: summed total (0-30), interpretation band (lower/possible/likely), item 10 self-harm score, and mandatory self-harm flag.';
COMMENT ON COLUMN edinburgh_postnatal_depression_scale_grade.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN edinburgh_postnatal_depression_scale_grade.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN edinburgh_postnatal_depression_scale_grade.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN edinburgh_postnatal_depression_scale_grade.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN edinburgh_postnatal_depression_scale_grade.edinburgh_postnatal_depression_scale_id IS
    'Foreign key to the parent assessment (unique, 1:1).';
COMMENT ON COLUMN edinburgh_postnatal_depression_scale_grade.total_score IS
    'Summed EPDS score across the ten items (0-30 when complete; missing items contribute 0).';
COMMENT ON COLUMN edinburgh_postnatal_depression_scale_grade.interpretation IS
    'Derived interpretation band: lower (< 10), possible (>= 10), or likely (>= 13) depression.';
COMMENT ON COLUMN edinburgh_postnatal_depression_scale_grade.item_10_score IS
    'Item 10 (thoughts of self-harm) score 0-3, retained for the safety flag audit.';
COMMENT ON COLUMN edinburgh_postnatal_depression_scale_grade.self_harm_flag IS
    'Mandatory self-harm flag: yes when item 10 > 0 (regardless of total), otherwise no.';
COMMENT ON COLUMN edinburgh_postnatal_depression_scale_grade.graded_at IS
    'Timestamp when the engine last computed the grade.';
