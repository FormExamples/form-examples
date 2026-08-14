-- Join table: which medications a patient takes, with the agreed perioperative
-- hold-and-restart plan recorded per drug rather than as a single free-text
-- note, so the medication optimisation domain can be graded per medicine.

CREATE TABLE patient_medication (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    patient_id UUID NOT NULL REFERENCES patient(id) ON DELETE CASCADE,
    medication_id UUID NOT NULL REFERENCES medication(id) ON DELETE CASCADE,
    dose TEXT NOT NULL DEFAULT '',
    frequency TEXT NOT NULL DEFAULT '',
    route TEXT NOT NULL DEFAULT '' CHECK (route IN ('oral', 'subcutaneous', 'intravenous', 'intramuscular', 'inhaled', 'topical', 'transdermal', 'other', '')),
    indication TEXT NOT NULL DEFAULT '',
    started_on DATE,
    prescribed_by TEXT NOT NULL DEFAULT '',
    adherence TEXT NOT NULL DEFAULT '' CHECK (adherence IN ('full', 'partial', 'none', 'unknown', '')),
    hold_required BOOLEAN NOT NULL DEFAULT FALSE,
    hold_start_before_days INTEGER CHECK (hold_start_before_days IS NULL OR hold_start_before_days BETWEEN 0 AND 60),
    restart_after_days INTEGER CHECK (restart_after_days IS NULL OR restart_after_days BETWEEN 0 AND 60),
    hold_plan_agreed BOOLEAN NOT NULL DEFAULT FALSE,
    hold_plan_agreed_by TEXT NOT NULL DEFAULT '',
    hold_plan_agreed_on DATE,
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
    'Patient medication, i.e. one medicine that one patient takes, with the agreed perioperative hold-and-restart plan.';
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
    'Dose as the patient takes it, such as "5 mg".';
COMMENT ON COLUMN patient_medication.frequency IS
    'Frequency as the patient takes it, such as "once daily".';
COMMENT ON COLUMN patient_medication.route IS
    'Route of administration.';
COMMENT ON COLUMN patient_medication.indication IS
    'Why the patient takes this medicine, because the indication drives the thrombotic or other risk of stopping it.';
COMMENT ON COLUMN patient_medication.started_on IS
    'Date the patient started taking this medicine, where known.';
COMMENT ON COLUMN patient_medication.prescribed_by IS
    'Who prescribes the medicine, because the prescriber owns the decision to hold it.';
COMMENT ON COLUMN patient_medication.adherence IS
    'Reported adherence.';
COMMENT ON COLUMN patient_medication.hold_required IS
    'Whether this medicine requires a perioperative hold for this patient.';
COMMENT ON COLUMN patient_medication.hold_start_before_days IS
    'Agreed number of days before surgery to stop this medicine.';
COMMENT ON COLUMN patient_medication.restart_after_days IS
    'Agreed number of days after surgery to restart this medicine.';
COMMENT ON COLUMN patient_medication.hold_plan_agreed IS
    'Whether a hold-and-restart plan has been agreed with the prescriber. An unagreed plan on a hold-requiring medicine triggers the medication optimisation domain.';
COMMENT ON COLUMN patient_medication.hold_plan_agreed_by IS
    'Who agreed the hold-and-restart plan.';
COMMENT ON COLUMN patient_medication.hold_plan_agreed_on IS
    'Date the hold-and-restart plan was agreed.';
COMMENT ON COLUMN patient_medication.notes IS
    'Free-text notes about this medicine for this patient.';
