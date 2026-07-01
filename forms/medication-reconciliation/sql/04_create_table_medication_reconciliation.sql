-- Parent medication-reconciliation header. Records the transition-of-care
-- context (admission / transfer / discharge), the care setting, the
-- reconciling clinician, patient identification, and the patient-level
-- allergy status. The information sources, allergies, medication line items
-- (best-possible medication history and inpatient list), and reconciliation
-- discrepancies are held in child tables that cascade from this parent.

CREATE TABLE medication_reconciliation (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    patient_id UUID NOT NULL REFERENCES patient(id) ON DELETE RESTRICT,
    clinician_id UUID REFERENCES clinician(id) ON DELETE RESTRICT,

    reconciliation_type VARCHAR(15) NOT NULL DEFAULT '' CHECK (reconciliation_type IN ('admission', 'transfer', 'discharge', '')),
    care_setting VARCHAR(25) NOT NULL DEFAULT '' CHECK (care_setting IN ('emergency-department', 'acute-medical-unit', 'surgical-admissions', 'ward', 'critical-care', 'other', '')),
    reconciled_at TIMESTAMPTZ,

    clinician_name TEXT NOT NULL DEFAULT '',
    clinician_role VARCHAR(20) NOT NULL DEFAULT '' CHECK (clinician_role IN ('pharmacist', 'pharmacy-technician', 'prescriber', 'nurse', 'other', '')),

    patient_identifier TEXT NOT NULL DEFAULT '',
    age_band VARCHAR(15) NOT NULL DEFAULT '' CHECK (age_band IN ('adult', 'paediatric', '')),
    sex VARCHAR(20) NOT NULL DEFAULT '' CHECK (sex IN ('female', 'male', 'intersex', 'unknown', '')),
    weight_kg NUMERIC(5,1),

    allergy_status VARCHAR(25) NOT NULL DEFAULT '' CHECK (allergy_status IN ('documented', 'no-known-drug-allergies', 'not-documented', ''))
);

CREATE INDEX medication_reconciliation_patient_id_idx
    ON medication_reconciliation (patient_id);
CREATE INDEX medication_reconciliation_clinician_id_idx
    ON medication_reconciliation (clinician_id);

CREATE TRIGGER trigger_medication_reconciliation_updated_at
    BEFORE UPDATE ON medication_reconciliation
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE medication_reconciliation IS
    'Parent medication-reconciliation header: transition-of-care context, care setting, reconciling clinician, patient identification, and patient-level allergy status.';
COMMENT ON COLUMN medication_reconciliation.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN medication_reconciliation.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN medication_reconciliation.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN medication_reconciliation.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN medication_reconciliation.patient_id IS
    'Foreign key to the patient this reconciliation is for (restricted delete).';
COMMENT ON COLUMN medication_reconciliation.clinician_id IS
    'Foreign key to the reconciling clinician (restricted delete); optional.';
COMMENT ON COLUMN medication_reconciliation.reconciliation_type IS
    'Transition of care at which the reconciliation is performed: admission, transfer, or discharge.';
COMMENT ON COLUMN medication_reconciliation.care_setting IS
    'Care setting: emergency-department, acute-medical-unit, surgical-admissions, ward, critical-care, or other.';
COMMENT ON COLUMN medication_reconciliation.reconciled_at IS
    'Date and time the reconciliation was carried out.';
COMMENT ON COLUMN medication_reconciliation.clinician_name IS
    'Name of the reconciling clinician as entered on the form.';
COMMENT ON COLUMN medication_reconciliation.clinician_role IS
    'Role of the reconciling clinician: pharmacist, pharmacy-technician, prescriber, nurse, or other.';
COMMENT ON COLUMN medication_reconciliation.patient_identifier IS
    'Local patient identifier as entered on the form.';
COMMENT ON COLUMN medication_reconciliation.age_band IS
    'Patient age band for dosing context: adult or paediatric.';
COMMENT ON COLUMN medication_reconciliation.sex IS
    'Patient sex: female, male, intersex, or unknown.';
COMMENT ON COLUMN medication_reconciliation.weight_kg IS
    'Patient weight in kilograms for weight-based dosing (nullable).';
COMMENT ON COLUMN medication_reconciliation.allergy_status IS
    'Patient allergy status: documented, no-known-drug-allergies, or not-documented.';
