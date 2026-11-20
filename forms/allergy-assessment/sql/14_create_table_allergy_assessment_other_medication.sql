CREATE TABLE allergy_assessment.assessment_other_medication (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    current_management_id UUID NOT NULL
        REFERENCES allergy_assessment.assessment_current_management(id) ON DELETE CASCADE,
    medication_name VARCHAR(255) NOT NULL DEFAULT '',
    dose VARCHAR(255) NOT NULL DEFAULT '',
    frequency VARCHAR(255) NOT NULL DEFAULT '',
    sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TRIGGER trigger_assessment_other_medication_updated_at
    BEFORE UPDATE ON allergy_assessment.assessment_other_medication
    FOR EACH ROW
    EXECUTE FUNCTION allergy_assessment.set_updated_at();

COMMENT ON TABLE allergy_assessment.assessment_other_medication IS
    'Other medications the patient is taking, with name, dose, and frequency.';

COMMENT ON COLUMN allergy_assessment.assessment_current_management.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN allergy_assessment.assessment_current_management.assessment_id IS
    'Foreign key to the assessment table.';
COMMENT ON COLUMN allergy_assessment.assessment_current_management.antihistamines IS
    'Antihistamines. One of: yes, no.';
COMMENT ON COLUMN allergy_assessment.assessment_current_management.antihistamine_details IS
    'Antihistamine details.';
COMMENT ON COLUMN allergy_assessment.assessment_current_management.nasal_steroids IS
    'Nasal steroids. One of: yes, no.';
COMMENT ON COLUMN allergy_assessment.assessment_current_management.adrenaline_auto_injector IS
    'Adrenaline auto injector. One of: yes, no.';
COMMENT ON COLUMN allergy_assessment.assessment_current_management.immunotherapy IS
    'Immunotherapy. One of: yes, no.';
COMMENT ON COLUMN allergy_assessment.assessment_current_management.immunotherapy_details IS
    'Immunotherapy details.';
COMMENT ON COLUMN allergy_assessment.assessment_current_management.biologics IS
    'Biologics. One of: yes, no.';
COMMENT ON COLUMN allergy_assessment.assessment_current_management.biologic_details IS
    'Biologic details.';
COMMENT ON COLUMN allergy_assessment.assessment_current_management.allergen_avoidance_strategies IS
    'Allergen avoidance strategies.';
COMMENT ON COLUMN allergy_assessment.assessment_current_management.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN allergy_assessment.assessment_current_management.updated_at IS
    'Timestamp when this row was updated.';
COMMENT ON COLUMN allergy_assessment.assessment_other_medication.current_management_id IS
    'Foreign key to the assessment_current_management table.';
COMMENT ON COLUMN allergy_assessment.assessment_other_medication.medication_name IS
    'Medication name.';
COMMENT ON COLUMN allergy_assessment.assessment_other_medication.dose IS
    'Dose.';
COMMENT ON COLUMN allergy_assessment.assessment_other_medication.frequency IS
    'Frequency.';
COMMENT ON COLUMN allergy_assessment.assessment_other_medication.sort_order IS
    'Sort order.';
COMMENT ON COLUMN allergy_assessment.assessment_other_medication.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN allergy_assessment.assessment_other_medication.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN allergy_assessment.assessment_other_medication.updated_at IS
    'Timestamp when this row was updated.';
COMMENT ON COLUMN allergy_assessment.assessment_other_medication.deleted_at IS
    'Timestamp when this row was deleted.';
