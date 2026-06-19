-- Drains, packs, urinary catheters, NG tubes, and other devices left
-- in situ at the end of the procedure, with site, output target, and
-- planned removal.

CREATE TABLE medical_operation_note_drain (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    medical_operation_note_id UUID NOT NULL REFERENCES medical_operation_note(id) ON DELETE CASCADE,

    device_type VARCHAR(40) NOT NULL DEFAULT '' CHECK (device_type IN ('closed-suction', 'open-corrugated', 'jackson-pratt', 'penrose', 'redivac', 'chest-drain', 'pack', 'urinary-catheter', 'suprapubic-catheter', 'ng-tube', 'rectal-tube', 'biliary-drain', 'pigtail', 'other', '')),
    name VARCHAR(255) NOT NULL DEFAULT '',
    site VARCHAR(255) NOT NULL DEFAULT '',
    size_or_gauge VARCHAR(60) NOT NULL DEFAULT '',
    output_target VARCHAR(255) NOT NULL DEFAULT '',
    removal_plan VARCHAR(255) NOT NULL DEFAULT '',
    removal_by_date DATE,
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
    notes TEXT NOT NULL DEFAULT ''
);

CREATE TRIGGER trigger_medical_operation_note_drain_updated_at
    BEFORE UPDATE ON medical_operation_note_drain
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE medical_operation_note_drain IS
    'Drains, packs, urinary catheters, NG tubes, and other devices left in situ at the end of the procedure.';
COMMENT ON COLUMN medical_operation_note_drain.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN medical_operation_note_drain.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN medical_operation_note_drain.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN medical_operation_note_drain.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN medical_operation_note_drain.medical_operation_note_id IS
    'Foreign key to the parent operation note.';
COMMENT ON COLUMN medical_operation_note_drain.device_type IS
    'Device type: closed-suction, open-corrugated, jackson-pratt, penrose, redivac, chest-drain, pack, urinary-catheter, suprapubic-catheter, ng-tube, rectal-tube, biliary-drain, pigtail, or other.';
COMMENT ON COLUMN medical_operation_note_drain.name IS
    'Device product name or short description.';
COMMENT ON COLUMN medical_operation_note_drain.site IS
    'Anatomical site or insertion location.';
COMMENT ON COLUMN medical_operation_note_drain.size_or_gauge IS
    'Device size, French gauge, or dimensions.';
COMMENT ON COLUMN medical_operation_note_drain.output_target IS
    'Expected output character (serous, sanguineous, biliary, faecal, urine) and volume range.';
COMMENT ON COLUMN medical_operation_note_drain.removal_plan IS
    'Planned criteria for removal (e.g. "remove when < 30 mL/24h").';
COMMENT ON COLUMN medical_operation_note_drain.removal_by_date IS
    'Date by which the device should be removed (e.g. pack removal-by deadline).';
COMMENT ON COLUMN medical_operation_note_drain.quantity IS
    'Quantity of devices placed (positive integer).';
COMMENT ON COLUMN medical_operation_note_drain.notes IS
    'Free-text notes about the device.';

CREATE INDEX medical_operation_note_drain_note_id_idx
    ON medical_operation_note_drain (medical_operation_note_id);
