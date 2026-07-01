-- Safety flags that fire independently of the overall outcome, each with a
-- priority and a suggested action for the sample-taker or screening service.

CREATE TABLE newborn_blood_spot_screening_grade_flag (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    newborn_blood_spot_screening_grade_id UUID NOT NULL
        REFERENCES newborn_blood_spot_screening_grade(id) ON DELETE CASCADE,

    flag_id VARCHAR(50) NOT NULL,
    category VARCHAR(30) NOT NULL DEFAULT ''
        CHECK (category IN (
            'urgent-referral',
            'inadequate-sample',
            'out-of-window-sample',
            'avoidable-repeat',
            'carrier',
            'declined',
            'incomplete',
            'other',
            ''
        )),
    priority VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (priority IN ('low', 'medium', 'high', '')),
    description VARCHAR(500) NOT NULL DEFAULT '',
    suggested_action VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX newborn_blood_spot_screening_grade_flag_grade_id_idx
    ON newborn_blood_spot_screening_grade_flag (newborn_blood_spot_screening_grade_id);

CREATE TRIGGER trigger_newborn_blood_spot_screening_grade_flag_updated_at
    BEFORE UPDATE ON newborn_blood_spot_screening_grade_flag
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE newborn_blood_spot_screening_grade_flag IS
    'Safety flags that fire independently of the overall outcome, with priority and a suggested action for the sample-taker or screening service.';
COMMENT ON COLUMN newborn_blood_spot_screening_grade_flag.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN newborn_blood_spot_screening_grade_flag.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN newborn_blood_spot_screening_grade_flag.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN newborn_blood_spot_screening_grade_flag.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN newborn_blood_spot_screening_grade_flag.newborn_blood_spot_screening_grade_id IS
    'Foreign key to the parent grade.';
COMMENT ON COLUMN newborn_blood_spot_screening_grade_flag.flag_id IS
    'Stable flag identifier (e.g. F-URGENT-REFERRAL-001).';
COMMENT ON COLUMN newborn_blood_spot_screening_grade_flag.category IS
    'Flag category: urgent-referral, inadequate-sample, out-of-window-sample, avoidable-repeat, carrier, declined, incomplete, or other (invalid result class maps to other).';
COMMENT ON COLUMN newborn_blood_spot_screening_grade_flag.priority IS
    'Priority: low, medium, high.';
COMMENT ON COLUMN newborn_blood_spot_screening_grade_flag.description IS
    'Human-readable description of what fired the flag.';
COMMENT ON COLUMN newborn_blood_spot_screening_grade_flag.suggested_action IS
    'Suggested clinical or service action (e.g. "refer urgently to the named specialist service", "repeat the sample").';
