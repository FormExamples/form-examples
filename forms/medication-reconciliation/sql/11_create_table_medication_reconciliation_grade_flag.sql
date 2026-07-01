-- Safety flags raised independently of the reconciliation status, with a
-- priority, a description, and a suggested action for the pharmacy or
-- prescribing team.

CREATE TABLE medication_reconciliation_grade_flag (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    medication_reconciliation_grade_id UUID NOT NULL
        REFERENCES medication_reconciliation_grade(id) ON DELETE CASCADE,

    flag_id VARCHAR(50) NOT NULL,
    category VARCHAR(40) NOT NULL DEFAULT ''
        CHECK (category IN (
            'high-risk-unintentional-discrepancy',
            'insufficient-sources',
            'allergy-conflict',
            'interaction',
            'therapeutic-duplication',
            'unintentional-discrepancy-outstanding',
            'allergy-status-not-documented',
            'other',
            ''
        )),
    priority VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (priority IN ('low', 'medium', 'high', '')),
    description VARCHAR(500) NOT NULL DEFAULT '',
    suggested_action VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX medication_reconciliation_grade_flag_grade_id_idx
    ON medication_reconciliation_grade_flag (medication_reconciliation_grade_id);

CREATE TRIGGER trigger_medication_reconciliation_grade_flag_updated_at
    BEFORE UPDATE ON medication_reconciliation_grade_flag
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE medication_reconciliation_grade_flag IS
    'Safety flags raised independently of the reconciliation status, with priority, description, and a suggested action for the pharmacy or prescribing team.';
COMMENT ON COLUMN medication_reconciliation_grade_flag.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN medication_reconciliation_grade_flag.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN medication_reconciliation_grade_flag.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN medication_reconciliation_grade_flag.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN medication_reconciliation_grade_flag.medication_reconciliation_grade_id IS
    'Foreign key to the parent grade.';
COMMENT ON COLUMN medication_reconciliation_grade_flag.flag_id IS
    'Stable flag identifier (e.g. F-HIGH-RISK-UNINTENTIONAL-DISCREPANCY-001).';
COMMENT ON COLUMN medication_reconciliation_grade_flag.category IS
    'Flag category: high-risk-unintentional-discrepancy, insufficient-sources, allergy-conflict, interaction, therapeutic-duplication, unintentional-discrepancy-outstanding, allergy-status-not-documented, or other.';
COMMENT ON COLUMN medication_reconciliation_grade_flag.priority IS
    'Priority: low, medium, high.';
COMMENT ON COLUMN medication_reconciliation_grade_flag.description IS
    'Human-readable description of what fired the flag.';
COMMENT ON COLUMN medication_reconciliation_grade_flag.suggested_action IS
    'Suggested action (e.g. "resolve the unintentional anticoagulant discrepancy with the prescriber").';
