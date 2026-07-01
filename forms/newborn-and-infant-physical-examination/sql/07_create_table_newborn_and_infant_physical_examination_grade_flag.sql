-- Referral flags that fire independently of the outcome roll-up, with a
-- priority and a suggested action pointing to the appropriate onward
-- referral pathway for the practitioner or screening team.

CREATE TABLE newborn_and_infant_physical_examination_grade_flag (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    newborn_and_infant_physical_examination_grade_id UUID NOT NULL
        REFERENCES newborn_and_infant_physical_examination_grade(id) ON DELETE CASCADE,

    flag_id VARCHAR(50) NOT NULL,
    category VARCHAR(50) NOT NULL DEFAULT ''
        CHECK (category IN (
            'urgent-ophthalmology',
            'cardiac-referral',
            'hip-ultrasound',
            'undescended-testes-review',
            'component-not-examined',
            'other',
            ''
        )),
    priority VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (priority IN ('low', 'medium', 'high', '')),
    description VARCHAR(500) NOT NULL DEFAULT '',
    suggested_action VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX newborn_and_infant_physical_examination_grade_flag_grade_id_idx
    ON newborn_and_infant_physical_examination_grade_flag (newborn_and_infant_physical_examination_grade_id);

CREATE TRIGGER trigger_newborn_and_infant_physical_examination_grade_flag_updated_at
    BEFORE UPDATE ON newborn_and_infant_physical_examination_grade_flag
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE newborn_and_infant_physical_examination_grade_flag IS
    'Referral flags that fire independently of the outcome roll-up, with priority and a suggested action pointing to the appropriate onward referral pathway for the practitioner or screening team.';
COMMENT ON COLUMN newborn_and_infant_physical_examination_grade_flag.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN newborn_and_infant_physical_examination_grade_flag.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN newborn_and_infant_physical_examination_grade_flag.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN newborn_and_infant_physical_examination_grade_flag.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN newborn_and_infant_physical_examination_grade_flag.newborn_and_infant_physical_examination_grade_id IS
    'Foreign key to the parent grade.';
COMMENT ON COLUMN newborn_and_infant_physical_examination_grade_flag.flag_id IS
    'Stable flag identifier (e.g. F-ABSENT-RED-REFLEX-001).';
COMMENT ON COLUMN newborn_and_infant_physical_examination_grade_flag.category IS
    'Flag category: urgent-ophthalmology, cardiac-referral, hip-ultrasound, undescended-testes-review, component-not-examined, or other.';
COMMENT ON COLUMN newborn_and_infant_physical_examination_grade_flag.priority IS
    'Priority: low, medium, high.';
COMMENT ON COLUMN newborn_and_infant_physical_examination_grade_flag.description IS
    'Human-readable description of what fired the flag.';
COMMENT ON COLUMN newborn_and_infant_physical_examination_grade_flag.suggested_action IS
    'Suggested onward-referral action (e.g. "refer to ophthalmology within 2 weeks", "arrange hip ultrasound by 6 weeks").';
