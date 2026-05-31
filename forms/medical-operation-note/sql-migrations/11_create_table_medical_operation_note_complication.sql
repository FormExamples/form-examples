-- Intra-operative complications encountered during the procedure,
-- classified by Clavien-Dindo and described in free text.

CREATE TABLE medical_operation_note_complication (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    medical_operation_note_id UUID NOT NULL REFERENCES medical_operation_note(id) ON DELETE CASCADE,

    category VARCHAR(40) NOT NULL DEFAULT '' CHECK (category IN ('haemorrhage', 'visceral-injury', 'vascular-injury', 'nerve-injury', 'cardiac-arrhythmia', 'cardiac-arrest', 'respiratory-arrest', 'anaesthetic', 'positioning-pressure', 'infection-suspected', 'equipment-failure', 'medication-error', 'other', '')),
    description TEXT NOT NULL DEFAULT '',
    clavien_dindo_grade VARCHAR(5) NOT NULL DEFAULT '' CHECK (clavien_dindo_grade IN ('0', 'I', 'II', 'IIIa', 'IIIb', 'IVa', 'IVb', 'V', '')),
    onset_at TIMESTAMPTZ,
    action_taken TEXT NOT NULL DEFAULT '',
    resolved_in_theatre VARCHAR(5) NOT NULL DEFAULT '' CHECK (resolved_in_theatre IN ('yes', 'no', '')),
    reported_to_governance VARCHAR(5) NOT NULL DEFAULT '' CHECK (reported_to_governance IN ('yes', 'no', ''))
);

CREATE TRIGGER trigger_medical_operation_note_complication_updated_at
    BEFORE UPDATE ON medical_operation_note_complication
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE medical_operation_note_complication IS
    'Intra-operative complications classified by Clavien-Dindo with description, action taken, and governance reporting status.';
COMMENT ON COLUMN medical_operation_note_complication.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN medical_operation_note_complication.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN medical_operation_note_complication.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN medical_operation_note_complication.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN medical_operation_note_complication.medical_operation_note_id IS
    'Foreign key to the parent operation note.';
COMMENT ON COLUMN medical_operation_note_complication.category IS
    'Complication category: haemorrhage, visceral-injury, vascular-injury, nerve-injury, cardiac-arrhythmia, cardiac-arrest, respiratory-arrest, anaesthetic, positioning-pressure, infection-suspected, equipment-failure, medication-error, or other.';
COMMENT ON COLUMN medical_operation_note_complication.description IS
    'Free-text description of the complication.';
COMMENT ON COLUMN medical_operation_note_complication.clavien_dindo_grade IS
    'Clavien-Dindo classification grade: 0, I, II, IIIa, IIIb, IVa, IVb, or V.';
COMMENT ON COLUMN medical_operation_note_complication.onset_at IS
    'Timestamp the complication was identified.';
COMMENT ON COLUMN medical_operation_note_complication.action_taken IS
    'Action taken to manage the complication.';
COMMENT ON COLUMN medical_operation_note_complication.resolved_in_theatre IS
    'Whether the complication was resolved before the patient left theatre.';
COMMENT ON COLUMN medical_operation_note_complication.reported_to_governance IS
    'Whether the complication has been entered into the clinical governance / Datix system.';

CREATE INDEX medical_operation_note_complication_note_id_idx
    ON medical_operation_note_complication (medical_operation_note_id);
