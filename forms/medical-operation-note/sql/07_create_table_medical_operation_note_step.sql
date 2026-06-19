-- Numbered free-text operative technique steps. Each step is one row,
-- ordered by step_number. Examples: "Patient positioned supine and
-- prepped in a sterile fashion", "Pfannenstiel incision made and rectus
-- sheath opened", "Hemostasis achieved with bipolar diathermy".

CREATE TABLE medical_operation_note_step (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    medical_operation_note_id UUID NOT NULL REFERENCES medical_operation_note(id) ON DELETE CASCADE,

    step_number INTEGER NOT NULL CHECK (step_number > 0),
    title VARCHAR(255) NOT NULL DEFAULT '',
    description TEXT NOT NULL DEFAULT ''
);

CREATE UNIQUE INDEX medical_operation_note_step_note_id_step_number_idx
    ON medical_operation_note_step (medical_operation_note_id, step_number);

CREATE TRIGGER trigger_medical_operation_note_step_updated_at
    BEFORE UPDATE ON medical_operation_note_step
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE medical_operation_note_step IS
    'Numbered free-text operative technique steps for an operation note.';
COMMENT ON COLUMN medical_operation_note_step.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN medical_operation_note_step.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN medical_operation_note_step.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN medical_operation_note_step.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN medical_operation_note_step.medical_operation_note_id IS
    'Foreign key to the parent operation note.';
COMMENT ON COLUMN medical_operation_note_step.step_number IS
    'Step ordinal within the case (1-based).';
COMMENT ON COLUMN medical_operation_note_step.title IS
    'Short step title (e.g. "Incision", "Mobilisation", "Closure").';
COMMENT ON COLUMN medical_operation_note_step.description IS
    'Free-text description of what was done at this step.';
