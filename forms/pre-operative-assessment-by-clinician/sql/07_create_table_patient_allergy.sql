CREATE TABLE pre_operative_assessment_by_clinician.patient_allergy (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    patient_id UUID NOT NULL REFERENCES pre_operative_assessment_by_clinician.patient(id) ON DELETE CASCADE,
    allergy_id UUID NOT NULL REFERENCES pre_operative_assessment_by_clinician.allergy(id) ON DELETE CASCADE
);

CREATE TRIGGER trigger_patient_allergy_updated_at
    BEFORE UPDATE ON pre_operative_assessment_by_clinician.patient_allergy
    FOR EACH ROW
    EXECUTE FUNCTION pre_operative_assessment_by_clinician.set_updated_at();

CREATE INDEX patient_allergy_patient_id_index
    ON pre_operative_assessment_by_clinician.patient_allergy (patient_id);

CREATE INDEX patient_allergy_allergy_id_index
    ON pre_operative_assessment_by_clinician.patient_allergy (allergy_id);
    
CREATE UNIQUE INDEX patient_allergy_patient_id_allergy_id_index
    ON pre_operative_assessment_by_clinician.patient_allergy (patient_id, allergy_id);

COMMENT ON TABLE pre_operative_assessment_by_clinician.patient_allergy IS
    'Patient allergy.';
COMMENT ON COLUMN pre_operative_assessment_by_clinician.patient_allergy.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN pre_operative_assessment_by_clinician.patient_allergy.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN pre_operative_assessment_by_clinician.patient_allergy.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN pre_operative_assessment_by_clinician.patient_allergy.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN pre_operative_assessment_by_clinician.patient_allergy.patient_id IS
    'Foreign key to the patient table.';
COMMENT ON COLUMN pre_operative_assessment_by_clinician.patient_allergy.allergy_id IS
    'Foreign key to the allergy table.';
