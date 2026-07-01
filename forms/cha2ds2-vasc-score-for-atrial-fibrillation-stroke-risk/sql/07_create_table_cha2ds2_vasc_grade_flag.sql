-- Red-flag issues that fire independently of the total score, with
-- priority and a suggested action for the clinical team.

CREATE TABLE cha2ds2_vasc_grade_flag (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    cha2ds2_vasc_grade_id UUID NOT NULL
        REFERENCES cha2ds2_vasc_grade(id) ON DELETE CASCADE,

    flag_id VARCHAR(50) NOT NULL,
    category VARCHAR(50) NOT NULL DEFAULT ''
        CHECK (category IN (
            'anticoagulation-recommended',
            'high-risk-untreated',
            'bleeding-risk-cross-ref',
            'prior-stroke-tia',
            'advanced-age',
            'female-sex-modifier',
            'incomplete-assessment',
            'other',
            ''
        )),
    priority VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (priority IN ('low', 'medium', 'high', '')),
    description VARCHAR(500) NOT NULL DEFAULT '',
    suggested_action VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX cha2ds2_vasc_grade_flag_grade_id_idx
    ON cha2ds2_vasc_grade_flag (cha2ds2_vasc_grade_id);

CREATE TRIGGER trigger_cha2ds2_vasc_grade_flag_updated_at
    BEFORE UPDATE ON cha2ds2_vasc_grade_flag
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE cha2ds2_vasc_grade_flag IS
    'Red-flag issues that fire independently of the total score, with priority and a suggested action for the clinical team.';
COMMENT ON COLUMN cha2ds2_vasc_grade_flag.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN cha2ds2_vasc_grade_flag.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN cha2ds2_vasc_grade_flag.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN cha2ds2_vasc_grade_flag.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN cha2ds2_vasc_grade_flag.cha2ds2_vasc_grade_id IS
    'Foreign key to the parent grade.';
COMMENT ON COLUMN cha2ds2_vasc_grade_flag.flag_id IS
    'Stable flag identifier (e.g. F-HIGH-RISK-UNTREATED-001).';
COMMENT ON COLUMN cha2ds2_vasc_grade_flag.category IS
    'Flag category (see CHECK constraint for enumeration).';
COMMENT ON COLUMN cha2ds2_vasc_grade_flag.priority IS
    'Priority: low, medium, high.';
COMMENT ON COLUMN cha2ds2_vasc_grade_flag.description IS
    'Human-readable description of what fired the flag.';
COMMENT ON COLUMN cha2ds2_vasc_grade_flag.suggested_action IS
    'Suggested clinical action (e.g. "complete a HAS-BLED assessment before starting anticoagulation").';
