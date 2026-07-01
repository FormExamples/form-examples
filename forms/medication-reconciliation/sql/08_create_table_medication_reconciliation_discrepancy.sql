-- Reconciliation discrepancies between the best-possible medication history
-- (BPMH) and the current inpatient list. Each difference is one row and
-- cascades from the parent medication_reconciliation. A discrepancy is
-- classified by type, matched to the BPMH and/or inpatient line it relates
-- to, and marked intentional (a documented decision carrying an intended
-- action and rationale) or unintentional (an unexplained error).

CREATE TABLE medication_reconciliation_discrepancy (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    medication_reconciliation_id UUID NOT NULL REFERENCES medication_reconciliation(id) ON DELETE CASCADE,

    discrepancy_type VARCHAR(15) NOT NULL DEFAULT '' CHECK (discrepancy_type IN ('omission', 'commission', 'duplication', 'dose', 'frequency', 'route', 'formulation', '')),
    bpmh_item_ref TEXT NOT NULL DEFAULT '',
    inpatient_item_ref TEXT NOT NULL DEFAULT '',
    intended_action VARCHAR(15) NOT NULL DEFAULT '' CHECK (intended_action IN ('continue', 'hold', 'stop', 'change', 'start', '')),
    rationale TEXT NOT NULL DEFAULT '',
    intentional BOOLEAN NOT NULL DEFAULT false
);

CREATE INDEX medication_reconciliation_discrepancy_reconciliation_id_idx
    ON medication_reconciliation_discrepancy (medication_reconciliation_id);

CREATE TRIGGER trigger_medication_reconciliation_discrepancy_updated_at
    BEFORE UPDATE ON medication_reconciliation_discrepancy
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE medication_reconciliation_discrepancy IS
    'Reconciliation discrepancies between the BPMH and the inpatient list, classified by type and by intentional / unintentional, cascading from the parent reconciliation.';
COMMENT ON COLUMN medication_reconciliation_discrepancy.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN medication_reconciliation_discrepancy.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN medication_reconciliation_discrepancy.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN medication_reconciliation_discrepancy.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN medication_reconciliation_discrepancy.medication_reconciliation_id IS
    'Foreign key to the parent medication reconciliation.';
COMMENT ON COLUMN medication_reconciliation_discrepancy.discrepancy_type IS
    'Type of difference: omission, commission, duplication, dose, frequency, route, or formulation.';
COMMENT ON COLUMN medication_reconciliation_discrepancy.bpmh_item_ref IS
    'Reference to the matched BPMH line item (free text; empty when not applicable).';
COMMENT ON COLUMN medication_reconciliation_discrepancy.inpatient_item_ref IS
    'Reference to the matched inpatient line item (free text; empty when not applicable).';
COMMENT ON COLUMN medication_reconciliation_discrepancy.intended_action IS
    'Documented action for an intentional discrepancy: continue, hold, stop, change, or start.';
COMMENT ON COLUMN medication_reconciliation_discrepancy.rationale IS
    'Clinical reason for the intended action.';
COMMENT ON COLUMN medication_reconciliation_discrepancy.intentional IS
    'True when the discrepancy is a documented decision; false when unexplained (an error).';
