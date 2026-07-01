-- Computed reconciliation grading result. Stores the overall status
-- (Complete / Discrepancies-outstanding / Incomplete) and the derived counts
-- the engine produced from the information sources, line items, and
-- discrepancies. One row per reconciliation (1:1).

CREATE TABLE medication_reconciliation_grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    medication_reconciliation_id UUID NOT NULL UNIQUE
        REFERENCES medication_reconciliation(id) ON DELETE CASCADE,

    status VARCHAR(25) NOT NULL DEFAULT ''
        CHECK (status IN ('complete', 'discrepancies-outstanding', 'incomplete', '')),
    source_count INTEGER NOT NULL DEFAULT 0
        CHECK (source_count >= 0),
    unintentional_count INTEGER NOT NULL DEFAULT 0
        CHECK (unintentional_count >= 0),
    high_risk_unintentional_count INTEGER NOT NULL DEFAULT 0
        CHECK (high_risk_unintentional_count >= 0),
    graded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trigger_medication_reconciliation_grade_updated_at
    BEFORE UPDATE ON medication_reconciliation_grade
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE medication_reconciliation_grade IS
    'Computed reconciliation grading result: overall status and the derived source / unintentional / high-risk-unintentional counts.';
COMMENT ON COLUMN medication_reconciliation_grade.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN medication_reconciliation_grade.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN medication_reconciliation_grade.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN medication_reconciliation_grade.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN medication_reconciliation_grade.medication_reconciliation_id IS
    'Foreign key to the parent medication reconciliation (unique, 1:1).';
COMMENT ON COLUMN medication_reconciliation_grade.status IS
    'Overall reconciliation status: complete, discrepancies-outstanding, or incomplete.';
COMMENT ON COLUMN medication_reconciliation_grade.source_count IS
    'Number of independent information sources used to build the BPMH.';
COMMENT ON COLUMN medication_reconciliation_grade.unintentional_count IS
    'Number of unintentional (unexplained) discrepancies outstanding.';
COMMENT ON COLUMN medication_reconciliation_grade.high_risk_unintentional_count IS
    'Number of unintentional discrepancies on a high-risk medicine (anticoagulant, insulin, or opioid).';
COMMENT ON COLUMN medication_reconciliation_grade.graded_at IS
    'Timestamp when the engine last computed the grade.';
