CREATE TABLE pre_anaesthesia_assessment.patient_medication (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    patient_id UUID NOT NULL REFERENCES pre_anaesthesia_assessment.patient(id) ON DELETE CASCADE,
    medication_id UUID NOT NULL REFERENCES pre_anaesthesia_assessment.medication(id) ON DELETE CASCADE
);

CREATE TRIGGER trigger_patient_medication_updated_at
    BEFORE UPDATE ON pre_anaesthesia_assessment.patient_medication
    FOR EACH ROW
    EXECUTE FUNCTION pre_anaesthesia_assessment.set_updated_at();

CREATE INDEX patient_medication_patient_id_index
    ON pre_anaesthesia_assessment.patient_medication (patient_id);

CREATE INDEX patient_medication_medication_id_index
    ON pre_anaesthesia_assessment.patient_medication (medication_id);
    
CREATE UNIQUE INDEX patient_medication_patient_id_medication_id_index
    ON pre_anaesthesia_assessment.patient_medication (patient_id, medication_id);

COMMENT ON TABLE pre_anaesthesia_assessment.patient_medication IS
    'Patient medication.';
COMMENT ON COLUMN pre_anaesthesia_assessment.patient_medication.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN pre_anaesthesia_assessment.patient_medication.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN pre_anaesthesia_assessment.patient_medication.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN pre_anaesthesia_assessment.patient_medication.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN pre_anaesthesia_assessment.patient_medication.patient_id IS
    'Foreign key to the patient table.';
COMMENT ON COLUMN pre_anaesthesia_assessment.patient_medication.medication_id IS
    'Foreign key to the medication table.';
