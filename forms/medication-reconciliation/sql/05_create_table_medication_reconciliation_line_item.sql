-- Medication line items on either list. Each medicine is one row and cascades
-- from the parent medication_reconciliation. The list_source discriminator
-- distinguishes a best-possible-medication-history (BPMH) line from a current
-- inpatient-list line. A row carries the drug name, form, dose, route,
-- frequency, indication, high-risk class, adherence, originating information
-- source, and (for inpatient rows) the prescribing status.

CREATE TABLE medication_reconciliation_line_item (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    medication_reconciliation_id UUID NOT NULL REFERENCES medication_reconciliation(id) ON DELETE CASCADE,

    list_source VARCHAR(10) NOT NULL DEFAULT '' CHECK (list_source IN ('bpmh', 'inpatient', '')),
    drug_name TEXT NOT NULL DEFAULT '',
    form TEXT NOT NULL DEFAULT '',
    dose TEXT NOT NULL DEFAULT '',
    route VARCHAR(15) NOT NULL DEFAULT '' CHECK (route IN ('oral', 'iv', 'im', 'subcutaneous', 'topical', 'inhaled', 'other', '')),
    frequency TEXT NOT NULL DEFAULT '',
    indication TEXT NOT NULL DEFAULT '',
    high_risk_class VARCHAR(15) NOT NULL DEFAULT '' CHECK (high_risk_class IN ('none', 'anticoagulant', 'insulin', 'opioid', 'other', '')),
    adherence VARCHAR(15) NOT NULL DEFAULT '' CHECK (adherence IN ('taking', 'not-taking', 'intermittent', 'unknown', '')),
    source_type VARCHAR(30) NOT NULL DEFAULT '' CHECK (source_type IN ('patient-interview', 'carer-interview', 'gp-record', 'repeat-prescription', 'community-pharmacy', 'dispensing-history', 'previous-discharge-summary', 'own-drugs-bag', 'care-home-mar', '')),
    status VARCHAR(15) NOT NULL DEFAULT '' CHECK (status IN ('active', 'held', 'stopped', 'suspended', ''))
);

CREATE INDEX medication_reconciliation_line_item_reconciliation_id_idx
    ON medication_reconciliation_line_item (medication_reconciliation_id);

CREATE TRIGGER trigger_medication_reconciliation_line_item_updated_at
    BEFORE UPDATE ON medication_reconciliation_line_item
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE medication_reconciliation_line_item IS
    'Medication line items on either list (BPMH or inpatient), discriminated by list_source, cascading from the parent reconciliation.';
COMMENT ON COLUMN medication_reconciliation_line_item.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN medication_reconciliation_line_item.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN medication_reconciliation_line_item.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN medication_reconciliation_line_item.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN medication_reconciliation_line_item.medication_reconciliation_id IS
    'Foreign key to the parent medication reconciliation.';
COMMENT ON COLUMN medication_reconciliation_line_item.list_source IS
    'Which list this line belongs to: bpmh (best-possible medication history) or inpatient.';
COMMENT ON COLUMN medication_reconciliation_line_item.drug_name IS
    'Generic (preferred) or brand name of the medicine.';
COMMENT ON COLUMN medication_reconciliation_line_item.form IS
    'Pharmaceutical form, e.g. tablet, capsule, injection, patch.';
COMMENT ON COLUMN medication_reconciliation_line_item.dose IS
    'Dose as free text to preserve units, e.g. "5 mg".';
COMMENT ON COLUMN medication_reconciliation_line_item.route IS
    'Route of administration: oral, iv, im, subcutaneous, topical, inhaled, or other.';
COMMENT ON COLUMN medication_reconciliation_line_item.frequency IS
    'Dosing frequency as free text, e.g. "once daily", "BD", "PRN".';
COMMENT ON COLUMN medication_reconciliation_line_item.indication IS
    'Reason the medicine is prescribed.';
COMMENT ON COLUMN medication_reconciliation_line_item.high_risk_class IS
    'High-risk medicine class: none, anticoagulant, insulin, opioid, or other.';
COMMENT ON COLUMN medication_reconciliation_line_item.adherence IS
    'Patient adherence: taking, not-taking, intermittent, or unknown.';
COMMENT ON COLUMN medication_reconciliation_line_item.source_type IS
    'Information source this line came from: patient-interview, carer-interview, gp-record, repeat-prescription, community-pharmacy, dispensing-history, previous-discharge-summary, own-drugs-bag, or care-home-mar.';
COMMENT ON COLUMN medication_reconciliation_line_item.status IS
    'Prescribing status for inpatient rows: active, held, stopped, or suspended.';
