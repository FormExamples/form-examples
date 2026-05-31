-- Tissue, fluid, and swab specimens sent from the operating theatre for
-- histopathology, microbiology, cytology, frozen section, or biobank
-- storage. Each row identifies one specimen with its container,
-- fixative, destination, and urgency.

CREATE TABLE medical_operation_note_specimen (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    medical_operation_note_id UUID NOT NULL REFERENCES medical_operation_note(id) ON DELETE CASCADE,

    label VARCHAR(255) NOT NULL DEFAULT '',
    specimen_type VARCHAR(30) NOT NULL DEFAULT '' CHECK (specimen_type IN ('tissue', 'fluid', 'pus', 'swab', 'bone', 'stone', 'foreign-body', 'biopsy', 'resection', 'other', '')),
    anatomical_site VARCHAR(255) NOT NULL DEFAULT '',
    container VARCHAR(60) NOT NULL DEFAULT '' CHECK (container IN ('histology-pot', 'csf-bottle', 'sterile-pot', 'culture-bottle', 'cytology-fluid', 'frozen-section-bag', 'biobank-tube', 'other', '')),
    fixative VARCHAR(40) NOT NULL DEFAULT '' CHECK (fixative IN ('formalin', 'saline', 'rpmi', 'cytology-fixative', 'none-fresh', 'liquid-nitrogen', 'other', '')),
    destination VARCHAR(40) NOT NULL DEFAULT '' CHECK (destination IN ('histopathology', 'microbiology', 'cytology', 'frozen-section', 'biobank', 'research', 'other', '')),
    urgency VARCHAR(20) NOT NULL DEFAULT '' CHECK (urgency IN ('routine', 'urgent', 'frozen-section', 'mdt', '')),
    label_verified VARCHAR(5) NOT NULL DEFAULT '' CHECK (label_verified IN ('yes', 'no', '')),
    chain_of_custody_documented VARCHAR(5) NOT NULL DEFAULT '' CHECK (chain_of_custody_documented IN ('yes', 'no', '')),
    notes TEXT NOT NULL DEFAULT ''
);

CREATE TRIGGER trigger_medical_operation_note_specimen_updated_at
    BEFORE UPDATE ON medical_operation_note_specimen
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE medical_operation_note_specimen IS
    'Specimens sent from theatre with container, fixative, destination, urgency, and labelling/chain-of-custody status.';
COMMENT ON COLUMN medical_operation_note_specimen.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN medical_operation_note_specimen.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN medical_operation_note_specimen.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN medical_operation_note_specimen.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN medical_operation_note_specimen.medical_operation_note_id IS
    'Foreign key to the parent operation note.';
COMMENT ON COLUMN medical_operation_note_specimen.label IS
    'Specimen label as written on the container.';
COMMENT ON COLUMN medical_operation_note_specimen.specimen_type IS
    'Specimen type: tissue, fluid, pus, swab, bone, stone, foreign-body, biopsy, resection, or other.';
COMMENT ON COLUMN medical_operation_note_specimen.anatomical_site IS
    'Anatomical site of origin.';
COMMENT ON COLUMN medical_operation_note_specimen.container IS
    'Container: histology-pot, csf-bottle, sterile-pot, culture-bottle, cytology-fluid, frozen-section-bag, biobank-tube, or other.';
COMMENT ON COLUMN medical_operation_note_specimen.fixative IS
    'Fixative: formalin, saline, rpmi, cytology-fixative, none-fresh, liquid-nitrogen, or other.';
COMMENT ON COLUMN medical_operation_note_specimen.destination IS
    'Destination laboratory: histopathology, microbiology, cytology, frozen-section, biobank, research, or other.';
COMMENT ON COLUMN medical_operation_note_specimen.urgency IS
    'Specimen urgency: routine, urgent, frozen-section, or mdt.';
COMMENT ON COLUMN medical_operation_note_specimen.label_verified IS
    'Whether the label was read back and verified at the trolley before leaving theatre.';
COMMENT ON COLUMN medical_operation_note_specimen.chain_of_custody_documented IS
    'Whether the chain-of-custody paperwork was completed.';
COMMENT ON COLUMN medical_operation_note_specimen.notes IS
    'Free-text notes about the specimen or its handling.';

CREATE INDEX medical_operation_note_specimen_note_id_idx
    ON medical_operation_note_specimen (medical_operation_note_id);
