-- Procedures performed under this operation note. Multiple procedures
-- can be performed in a single case; each row records one procedure
-- with its OPCS-4 code, free-text name, and role (primary or secondary).

CREATE TABLE medical_operation_note_procedure (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    medical_operation_note_id UUID NOT NULL REFERENCES medical_operation_note(id) ON DELETE CASCADE,

    role VARCHAR(20) NOT NULL DEFAULT '' CHECK (role IN ('planned-primary', 'planned-secondary', 'performed-primary', 'performed-secondary', 'unplanned', '')),
    opcs4_code VARCHAR(10) NOT NULL DEFAULT '',
    name VARCHAR(255) NOT NULL DEFAULT '',
    description TEXT NOT NULL DEFAULT '',
    laterality VARCHAR(10) NOT NULL DEFAULT '' CHECK (laterality IN ('left', 'right', 'bilateral', 'midline', 'na', '')),
    sequence_index INTEGER NOT NULL DEFAULT 0
);

CREATE TRIGGER trigger_medical_operation_note_procedure_updated_at
    BEFORE UPDATE ON medical_operation_note_procedure
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE medical_operation_note_procedure IS
    'Planned and performed procedures linked to an operation note, with OPCS-4 coding and role (primary, secondary, unplanned).';
COMMENT ON COLUMN medical_operation_note_procedure.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN medical_operation_note_procedure.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN medical_operation_note_procedure.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN medical_operation_note_procedure.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN medical_operation_note_procedure.medical_operation_note_id IS
    'Foreign key to the parent operation note.';
COMMENT ON COLUMN medical_operation_note_procedure.role IS
    'Procedure role: planned-primary, planned-secondary, performed-primary, performed-secondary, or unplanned.';
COMMENT ON COLUMN medical_operation_note_procedure.opcs4_code IS
    'NHS Digital OPCS-4 procedure classification code.';
COMMENT ON COLUMN medical_operation_note_procedure.name IS
    'Short procedure name.';
COMMENT ON COLUMN medical_operation_note_procedure.description IS
    'Free-text procedure description.';
COMMENT ON COLUMN medical_operation_note_procedure.laterality IS
    'Procedure laterality: left, right, bilateral, midline, or na.';
COMMENT ON COLUMN medical_operation_note_procedure.sequence_index IS
    'Sequence order within the case (0-based).';

CREATE INDEX medical_operation_note_procedure_note_id_idx
    ON medical_operation_note_procedure (medical_operation_note_id);
