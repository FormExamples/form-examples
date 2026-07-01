-- Drug allergies and adverse reactions recorded for the patient. Each
-- allergy is one row and cascades from the parent medication_reconciliation.
-- Allergy substances are cross-checked against reconciled medicines to raise
-- the allergy-conflict safety flag.

CREATE TABLE medication_reconciliation_allergy (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    medication_reconciliation_id UUID NOT NULL REFERENCES medication_reconciliation(id) ON DELETE CASCADE,

    substance TEXT NOT NULL DEFAULT '',
    reaction_type VARCHAR(15) NOT NULL DEFAULT '' CHECK (reaction_type IN ('allergy', 'intolerance', 'adverse-effect', 'unknown', '')),
    severity VARCHAR(15) NOT NULL DEFAULT '' CHECK (severity IN ('mild', 'moderate', 'severe', 'anaphylaxis', ''))
);

CREATE INDEX medication_reconciliation_allergy_reconciliation_id_idx
    ON medication_reconciliation_allergy (medication_reconciliation_id);

CREATE TRIGGER trigger_medication_reconciliation_allergy_updated_at
    BEFORE UPDATE ON medication_reconciliation_allergy
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE medication_reconciliation_allergy IS
    'Drug allergies and adverse reactions recorded for the patient, cascading from the parent reconciliation.';
COMMENT ON COLUMN medication_reconciliation_allergy.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN medication_reconciliation_allergy.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN medication_reconciliation_allergy.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN medication_reconciliation_allergy.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN medication_reconciliation_allergy.medication_reconciliation_id IS
    'Foreign key to the parent medication reconciliation.';
COMMENT ON COLUMN medication_reconciliation_allergy.substance IS
    'Drug or drug class the patient reacts to.';
COMMENT ON COLUMN medication_reconciliation_allergy.reaction_type IS
    'Reaction type: allergy, intolerance, adverse-effect, or unknown.';
COMMENT ON COLUMN medication_reconciliation_allergy.severity IS
    'Reaction severity: mild, moderate, severe, or anaphylaxis.';
