-- Join table: which medications and supplements a patient is taking, with the
-- dose, frequency, and adherence recorded at the dietetic assessment.

CREATE TABLE patient_medication (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    patient_id UUID NOT NULL REFERENCES patient(id) ON DELETE CASCADE,
    medication_id UUID NOT NULL REFERENCES medication(id) ON DELETE CASCADE,
    dose TEXT NOT NULL DEFAULT '',
    frequency TEXT NOT NULL DEFAULT '',
    route TEXT NOT NULL DEFAULT '' CHECK (route IN ('oral', 'enteral-tube', 'intravenous', 'subcutaneous', 'intramuscular', 'topical', 'other', '')),
    started_on DATE,
    prescribed_by TEXT NOT NULL DEFAULT '',
    adherence TEXT NOT NULL DEFAULT '' CHECK (adherence IN ('full', 'partial', 'none', 'unknown', '')),
    notes TEXT NOT NULL DEFAULT ''
);

CREATE TRIGGER trigger_patient_medication_updated_at
    BEFORE UPDATE ON patient_medication
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

CREATE INDEX patient_medication_patient_id_index
    ON patient_medication (patient_id);

CREATE INDEX patient_medication_medication_id_index
    ON patient_medication (medication_id);

CREATE UNIQUE INDEX patient_medication_patient_id_medication_id_index
    ON patient_medication (patient_id, medication_id);

COMMENT ON TABLE patient_medication IS
    'Patient medication, i.e. one medication or supplement that one patient is taking.';
COMMENT ON COLUMN patient_medication.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN patient_medication.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN patient_medication.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN patient_medication.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN patient_medication.patient_id IS
    'Foreign key to the patient table.';
COMMENT ON COLUMN patient_medication.medication_id IS
    'Foreign key to the medication table.';
COMMENT ON COLUMN patient_medication.dose IS
    'Dose as the patient takes it, such as "20 mg" or "one 125 ml bottle".';
COMMENT ON COLUMN patient_medication.frequency IS
    'Frequency as the patient takes it, such as "twice daily" or "as needed".';
COMMENT ON COLUMN patient_medication.route IS
    'Route of administration, such as oral or enteral tube.';
COMMENT ON COLUMN patient_medication.started_on IS
    'Date the patient started taking this product, where known.';
COMMENT ON COLUMN patient_medication.prescribed_by IS
    'Who prescribed or recommended the product, or "self" for a self-selected supplement.';
COMMENT ON COLUMN patient_medication.adherence IS
    'Reported adherence, such as for reviewing whether a prescribed oral nutritional supplement is actually being taken.';
COMMENT ON COLUMN patient_medication.notes IS
    'Free-text notes about this product for this patient.';
