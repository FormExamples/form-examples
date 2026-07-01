-- Red-flag issues that fire independently of the band, with priority
-- and a suggested action for the clinical team. The item-10 self-harm
-- flag is mandatory and urgent regardless of the total score.

CREATE TABLE edinburgh_postnatal_depression_scale_grade_flag (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    edinburgh_postnatal_depression_scale_grade_id UUID NOT NULL
        REFERENCES edinburgh_postnatal_depression_scale_grade(id) ON DELETE CASCADE,

    flag_id VARCHAR(50) NOT NULL,
    category VARCHAR(50) NOT NULL DEFAULT ''
        CHECK (category IN (
            'self-harm-urgent',
            'likely-depression',
            'possible-depression',
            'elevated-anxiety',
            'incomplete',
            'other',
            ''
        )),
    priority VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (priority IN ('low', 'medium', 'high', 'urgent', '')),
    description VARCHAR(500) NOT NULL DEFAULT '',
    suggested_action VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX edinburgh_postnatal_depression_scale_grade_flag_grade_id_idx
    ON edinburgh_postnatal_depression_scale_grade_flag (edinburgh_postnatal_depression_scale_grade_id);

CREATE TRIGGER trigger_edinburgh_postnatal_depression_scale_grade_flag_updated_at
    BEFORE UPDATE ON edinburgh_postnatal_depression_scale_grade_flag
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE edinburgh_postnatal_depression_scale_grade_flag IS
    'Red-flag issues that fire independently of the band, with priority and a suggested action for the clinical team.';
COMMENT ON COLUMN edinburgh_postnatal_depression_scale_grade_flag.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN edinburgh_postnatal_depression_scale_grade_flag.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN edinburgh_postnatal_depression_scale_grade_flag.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN edinburgh_postnatal_depression_scale_grade_flag.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN edinburgh_postnatal_depression_scale_grade_flag.edinburgh_postnatal_depression_scale_grade_id IS
    'Foreign key to the parent grade.';
COMMENT ON COLUMN edinburgh_postnatal_depression_scale_grade_flag.flag_id IS
    'Stable flag identifier (e.g. F-SELF-HARM-URGENT-001).';
COMMENT ON COLUMN edinburgh_postnatal_depression_scale_grade_flag.category IS
    'Flag category (see CHECK constraint for enumeration).';
COMMENT ON COLUMN edinburgh_postnatal_depression_scale_grade_flag.priority IS
    'Priority: low, medium, high, or urgent (self-harm overrides all bands).';
COMMENT ON COLUMN edinburgh_postnatal_depression_scale_grade_flag.description IS
    'Human-readable description of what fired the flag.';
COMMENT ON COLUMN edinburgh_postnatal_depression_scale_grade_flag.suggested_action IS
    'Suggested clinical action (e.g. "perform an immediate self-harm risk assessment").';
