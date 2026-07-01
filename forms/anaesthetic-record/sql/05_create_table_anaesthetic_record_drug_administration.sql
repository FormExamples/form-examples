-- Drug administrations recorded during the anaesthetic. Each administered
-- drug is one row and cascades from the parent anaesthetic_record. Carries
-- the drug name, dose and unit, route, therapeutic category, and the time of
-- administration. The drug names are matched against documented_allergies on
-- the parent record to raise the allergy-conflict safety flag.

CREATE TABLE anaesthetic_record_drug_administration (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    anaesthetic_record_id UUID NOT NULL REFERENCES anaesthetic_record(id) ON DELETE CASCADE,

    drug_name VARCHAR(255) NOT NULL DEFAULT '',
    dose NUMERIC(10,3) CHECK (dose IS NULL OR dose >= 0),
    dose_unit VARCHAR(10) NOT NULL DEFAULT '' CHECK (dose_unit IN ('mg', 'mcg', 'g', 'ml', 'units', 'mmol', 'puff', 'other', '')),
    route VARCHAR(20) NOT NULL DEFAULT '' CHECK (route IN ('iv', 'im', 'subcutaneous', 'inhalational', 'oral', 'topical', 'neuraxial', 'infusion', 'other', '')),
    category VARCHAR(30) NOT NULL DEFAULT '' CHECK (category IN ('induction', 'neuromuscular-blocker', 'maintenance', 'reversal', 'analgesia', 'antiemetic', 'antibiotic', 'vasoactive', 'local-anaesthetic', 'other', '')),
    administered_at TIMESTAMPTZ
);

CREATE INDEX anaesthetic_record_drug_administration_record_id_idx
    ON anaesthetic_record_drug_administration (anaesthetic_record_id);

CREATE TRIGGER trigger_anaesthetic_record_drug_administration_updated_at
    BEFORE UPDATE ON anaesthetic_record_drug_administration
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE anaesthetic_record_drug_administration IS
    'Drug administrations recorded during the anaesthetic: drug, dose, unit, route, category, and time.';
COMMENT ON COLUMN anaesthetic_record_drug_administration.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN anaesthetic_record_drug_administration.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN anaesthetic_record_drug_administration.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN anaesthetic_record_drug_administration.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN anaesthetic_record_drug_administration.anaesthetic_record_id IS
    'Foreign key to the parent anaesthetic record.';
COMMENT ON COLUMN anaesthetic_record_drug_administration.drug_name IS
    'Name of the administered drug.';
COMMENT ON COLUMN anaesthetic_record_drug_administration.dose IS
    'Dose administered, in the accompanying dose unit.';
COMMENT ON COLUMN anaesthetic_record_drug_administration.dose_unit IS
    'Dose unit: mg, mcg, g, ml, units, mmol, puff, or other.';
COMMENT ON COLUMN anaesthetic_record_drug_administration.route IS
    'Route of administration: iv, im, subcutaneous, inhalational, oral, topical, neuraxial, infusion, or other.';
COMMENT ON COLUMN anaesthetic_record_drug_administration.category IS
    'Therapeutic category: induction, neuromuscular-blocker, maintenance, reversal, analgesia, antiemetic, antibiotic, vasoactive, local-anaesthetic, or other.';
COMMENT ON COLUMN anaesthetic_record_drug_administration.administered_at IS
    'Timestamp when the drug was administered.';
