-- Information sources used to build the best-possible medication history
-- (BPMH). Each source is one row and cascades from the parent
-- medication_reconciliation. Two or more independent, verified sources are
-- required for a complete reconciliation.

CREATE TABLE medication_reconciliation_information_source (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    medication_reconciliation_id UUID NOT NULL REFERENCES medication_reconciliation(id) ON DELETE CASCADE,

    source_type VARCHAR(30) NOT NULL DEFAULT '' CHECK (source_type IN ('patient-interview', 'carer-interview', 'gp-record', 'repeat-prescription', 'community-pharmacy', 'dispensing-history', 'previous-discharge-summary', 'own-drugs-bag', 'care-home-mar', '')),
    verified BOOLEAN NOT NULL DEFAULT false
);

CREATE INDEX medication_reconciliation_information_source_reconciliation_id_idx
    ON medication_reconciliation_information_source (medication_reconciliation_id);

CREATE TRIGGER trigger_medication_reconciliation_information_source_updated_at
    BEFORE UPDATE ON medication_reconciliation_information_source
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE medication_reconciliation_information_source IS
    'Information sources used to build the best-possible medication history (BPMH), cascading from the parent reconciliation.';
COMMENT ON COLUMN medication_reconciliation_information_source.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN medication_reconciliation_information_source.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN medication_reconciliation_information_source.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN medication_reconciliation_information_source.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN medication_reconciliation_information_source.medication_reconciliation_id IS
    'Foreign key to the parent medication reconciliation.';
COMMENT ON COLUMN medication_reconciliation_information_source.source_type IS
    'Type of source: patient-interview, carer-interview, gp-record, repeat-prescription, community-pharmacy, dispensing-history, previous-discharge-summary, own-drugs-bag, or care-home-mar.';
COMMENT ON COLUMN medication_reconciliation_information_source.verified IS
    'Whether the source was directly checked by the reconciling clinician.';
