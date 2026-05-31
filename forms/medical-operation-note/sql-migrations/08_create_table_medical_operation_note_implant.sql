-- Implants, prostheses, sutures, and other materials left in or
-- applied to the patient. Each row identifies the item and its
-- regulatory traceability data (lot, serial, batch, expiry, manufacturer,
-- registry submission status).

CREATE TABLE medical_operation_note_implant (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    medical_operation_note_id UUID NOT NULL REFERENCES medical_operation_note(id) ON DELETE CASCADE,

    category VARCHAR(30) NOT NULL DEFAULT '' CHECK (category IN ('suture', 'staple', 'clip', 'mesh', 'screw', 'plate', 'rod', 'pin', 'wire', 'prosthetic-joint', 'cardiac-device', 'vascular-graft', 'stent', 'lens', 'cochlear-implant', 'breast-implant', 'pacemaker', 'icd', 'other', '')),
    name VARCHAR(255) NOT NULL DEFAULT '',
    size_or_gauge VARCHAR(60) NOT NULL DEFAULT '',
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
    manufacturer VARCHAR(255) NOT NULL DEFAULT '',
    lot_number VARCHAR(60) NOT NULL DEFAULT '',
    serial_number VARCHAR(60) NOT NULL DEFAULT '',
    batch_number VARCHAR(60) NOT NULL DEFAULT '',
    expiry_date DATE,
    udi_di VARCHAR(120) NOT NULL DEFAULT '',
    implant_site VARCHAR(255) NOT NULL DEFAULT '',
    registry_required VARCHAR(5) NOT NULL DEFAULT '' CHECK (registry_required IN ('yes', 'no', '')),
    registry_submitted VARCHAR(5) NOT NULL DEFAULT '' CHECK (registry_submitted IN ('yes', 'no', '')),
    notes TEXT NOT NULL DEFAULT ''
);

CREATE TRIGGER trigger_medical_operation_note_implant_updated_at
    BEFORE UPDATE ON medical_operation_note_implant
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE medical_operation_note_implant IS
    'Implants, prostheses, sutures, and other materials applied to or left in the patient during a procedure, with regulatory traceability.';
COMMENT ON COLUMN medical_operation_note_implant.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN medical_operation_note_implant.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN medical_operation_note_implant.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN medical_operation_note_implant.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN medical_operation_note_implant.medical_operation_note_id IS
    'Foreign key to the parent operation note.';
COMMENT ON COLUMN medical_operation_note_implant.category IS
    'Implant or material category: suture, staple, clip, mesh, screw, plate, rod, pin, wire, prosthetic-joint, cardiac-device, vascular-graft, stent, lens, cochlear-implant, breast-implant, pacemaker, icd, or other.';
COMMENT ON COLUMN medical_operation_note_implant.name IS
    'Item product name.';
COMMENT ON COLUMN medical_operation_note_implant.size_or_gauge IS
    'Item size, gauge, or dimensions.';
COMMENT ON COLUMN medical_operation_note_implant.quantity IS
    'Quantity used (positive integer).';
COMMENT ON COLUMN medical_operation_note_implant.manufacturer IS
    'Item manufacturer.';
COMMENT ON COLUMN medical_operation_note_implant.lot_number IS
    'Manufacturer lot number for traceability.';
COMMENT ON COLUMN medical_operation_note_implant.serial_number IS
    'Manufacturer serial number for unique-instance traceability.';
COMMENT ON COLUMN medical_operation_note_implant.batch_number IS
    'Manufacturer batch number.';
COMMENT ON COLUMN medical_operation_note_implant.expiry_date IS
    'Item expiry date.';
COMMENT ON COLUMN medical_operation_note_implant.udi_di IS
    'Unique Device Identifier (UDI-DI) for regulated medical devices.';
COMMENT ON COLUMN medical_operation_note_implant.implant_site IS
    'Anatomical site where the implant was placed.';
COMMENT ON COLUMN medical_operation_note_implant.registry_required IS
    'Whether submission to a national implant registry (e.g. NJR, BCIS) is required.';
COMMENT ON COLUMN medical_operation_note_implant.registry_submitted IS
    'Whether registry submission has been completed.';
COMMENT ON COLUMN medical_operation_note_implant.notes IS
    'Free-text notes about the implant or its placement.';

CREATE INDEX medical_operation_note_implant_note_id_idx
    ON medical_operation_note_implant (medical_operation_note_id);
