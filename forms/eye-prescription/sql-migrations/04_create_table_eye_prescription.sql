-- Eye prescription header (one row per issued prescription).

CREATE TABLE eye_prescription (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    patient_id UUID NOT NULL
        REFERENCES patient(id) ON DELETE RESTRICT,
    prescriber_id UUID NOT NULL
        REFERENCES prescriber(id) ON DELETE RESTRICT,

    status VARCHAR(20) NOT NULL DEFAULT 'draft'
        CHECK (status IN (
            'draft',
            'active',
            'cancelled',
            'superseded',
            'expired',
            'entered-in-error'
        )),
    examination_date DATE NOT NULL,
    examination_time TIME,
    issue_date DATE NOT NULL,
    expiry_date DATE NOT NULL,
    reason_for_sight_test VARCHAR(50) NOT NULL DEFAULT ''
        CHECK (reason_for_sight_test IN (
            'routine',
            'symptoms',
            'follow-up',
            'pre-employment',
            'driving-licence',
            'after-pathology',
            'second-opinion',
            'other',
            ''
        )),
    prior_prescription_on_file BOOLEAN NOT NULL DEFAULT FALSE,
    prior_prescription_date DATE,
    notes TEXT NOT NULL DEFAULT ''
);

CREATE TRIGGER trigger_eye_prescription_updated_at
    BEFORE UPDATE ON eye_prescription
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

CREATE INDEX index_eye_prescription_patient_id
    ON eye_prescription(patient_id);
CREATE INDEX index_eye_prescription_prescriber_id
    ON eye_prescription(prescriber_id);
CREATE INDEX index_eye_prescription_issue_date
    ON eye_prescription(issue_date);
CREATE INDEX index_eye_prescription_expiry_date
    ON eye_prescription(expiry_date);

COMMENT ON TABLE eye_prescription IS
    'Spectacle prescription header; one row per issued prescription.';
COMMENT ON COLUMN eye_prescription.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN eye_prescription.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN eye_prescription.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN eye_prescription.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN eye_prescription.patient_id IS
    'Foreign key to the patient table.';
COMMENT ON COLUMN eye_prescription.prescriber_id IS
    'Foreign key to the prescriber table.';
COMMENT ON COLUMN eye_prescription.status IS
    'Prescription lifecycle status: draft, active, cancelled, superseded, expired, entered-in-error.';
COMMENT ON COLUMN eye_prescription.examination_date IS
    'Date the sight test was performed.';
COMMENT ON COLUMN eye_prescription.examination_time IS
    'Time of day the sight test was performed.';
COMMENT ON COLUMN eye_prescription.issue_date IS
    'Date the prescription was issued (usually same day as examination).';
COMMENT ON COLUMN eye_prescription.expiry_date IS
    'Date the prescription expires (default issue + 2 years; 1 year if age < 16 or >= 70).';
COMMENT ON COLUMN eye_prescription.reason_for_sight_test IS
    'Reason for the sight test: routine, symptoms, follow-up, pre-employment, driving-licence, after-pathology, second-opinion, other.';
COMMENT ON COLUMN eye_prescription.prior_prescription_on_file IS
    'Whether a prior prescription is on file for this patient (used to detect significant change).';
COMMENT ON COLUMN eye_prescription.prior_prescription_date IS
    'Date of the prior prescription, if any.';
COMMENT ON COLUMN eye_prescription.notes IS
    'Free-text prescriber notes.';
