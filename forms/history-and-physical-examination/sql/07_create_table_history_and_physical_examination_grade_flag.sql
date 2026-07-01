-- Safety flags that fire independently of the completeness status, with a
-- priority and a suggested action for the clerking clinician or governance
-- team. Two categories are blocking (they force an incomplete status):
-- allergies-not-documented and no-impression-or-plan.

CREATE TABLE history_and_physical_examination_grade_flag (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    history_and_physical_examination_grade_id UUID NOT NULL
        REFERENCES history_and_physical_examination_grade(id) ON DELETE CASCADE,

    flag_id VARCHAR(50) NOT NULL,
    category VARCHAR(50) NOT NULL DEFAULT ''
        CHECK (category IN (
            'allergies-not-documented',
            'no-impression-or-plan',
            'red-flag-no-plan',
            'abnormal-vitals',
            'incomplete-systems-exam',
            'incomplete-history',
            'other',
            ''
        )),
    priority VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (priority IN ('low', 'medium', 'high', '')),
    description VARCHAR(500) NOT NULL DEFAULT '',
    suggested_action VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX history_and_physical_examination_grade_flag_grade_id_idx
    ON history_and_physical_examination_grade_flag (history_and_physical_examination_grade_id);

CREATE TRIGGER trigger_history_and_physical_examination_grade_flag_updated_at
    BEFORE UPDATE ON history_and_physical_examination_grade_flag
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE history_and_physical_examination_grade_flag IS
    'Safety flags that fire independently of the completeness status, with priority and a suggested action. The allergies-not-documented and no-impression-or-plan categories are blocking (they force an incomplete status).';
COMMENT ON COLUMN history_and_physical_examination_grade_flag.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN history_and_physical_examination_grade_flag.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN history_and_physical_examination_grade_flag.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN history_and_physical_examination_grade_flag.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN history_and_physical_examination_grade_flag.history_and_physical_examination_grade_id IS
    'Foreign key to the parent grade.';
COMMENT ON COLUMN history_and_physical_examination_grade_flag.flag_id IS
    'Stable flag identifier (e.g. F-ALLERGIES-NOT-DOCUMENTED-001).';
COMMENT ON COLUMN history_and_physical_examination_grade_flag.category IS
    'Flag category: allergies-not-documented, no-impression-or-plan, red-flag-no-plan, abnormal-vitals, incomplete-systems-exam, incomplete-history, or other.';
COMMENT ON COLUMN history_and_physical_examination_grade_flag.priority IS
    'Priority: low, medium, high.';
COMMENT ON COLUMN history_and_physical_examination_grade_flag.description IS
    'Human-readable description of what fired the flag.';
COMMENT ON COLUMN history_and_physical_examination_grade_flag.suggested_action IS
    'Suggested clinical or governance action (e.g. "document allergy status", "record an impression and management plan").';
