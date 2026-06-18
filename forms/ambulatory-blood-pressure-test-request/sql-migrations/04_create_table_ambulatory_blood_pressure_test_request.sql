-- Ambulatory blood pressure (ABPM) test request (referral) — the source-of-truth record.

CREATE TABLE ambulatory_blood_pressure_test_request (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    patient_id UUID NOT NULL REFERENCES patient(id) ON DELETE CASCADE,
    clinician_id UUID NOT NULL REFERENCES clinician(id) ON DELETE CASCADE,

    status VARCHAR(20) NOT NULL DEFAULT 'draft'
        CHECK (status IN ('draft', 'submitted', 'vetted', 'scheduled', 'rejected', '')),
    site_name VARCHAR(255) NOT NULL DEFAULT '',
    setting VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (setting IN ('outpatient', 'inpatient', 'community', 'emergency', '')),
    referral_date DATE,
    requested_by_date DATE,

    -- Requested examination
    test_type VARCHAR(40) NOT NULL DEFAULT ''
        CHECK (test_type IN ('24-hour-abpm', 'home-blood-pressure-monitoring', 'other', '')),
    primary_indication VARCHAR(40) NOT NULL DEFAULT ''
        CHECK (primary_indication IN ('diagnose-hypertension', 'white-coat-hypertension', 'masked-hypertension', 'resistant-hypertension', 'treatment-monitoring', 'hypotension-symptoms', 'pregnancy-hypertension', 'other', '')),
    clinical_question VARCHAR(1000) NOT NULL DEFAULT '',
    relevant_history VARCHAR(1000) NOT NULL DEFAULT '',

    -- Clinic blood pressure
    clinic_bp_systolic INTEGER
        CHECK (clinic_bp_systolic IS NULL OR clinic_bp_systolic BETWEEN 50 AND 300),
    clinic_bp_diastolic INTEGER
        CHECK (clinic_bp_diastolic IS NULL OR clinic_bp_diastolic BETWEEN 20 AND 200),

    -- Medication
    on_antihypertensives BOOLEAN NOT NULL DEFAULT FALSE,
    current_medications VARCHAR(1000) NOT NULL DEFAULT '',

    -- Symptoms / accuracy factors
    symptom_dizziness BOOLEAN NOT NULL DEFAULT FALSE,
    symptom_headache BOOLEAN NOT NULL DEFAULT FALSE,
    atrial_fibrillation BOOLEAN NOT NULL DEFAULT FALSE,
    pregnant BOOLEAN NOT NULL DEFAULT FALSE,

    -- Requester / triage
    urgency VARCHAR(15) NOT NULL DEFAULT 'routine'
        CHECK (urgency IN ('routine', 'urgent', 'emergency', '')),
    supervising_consultant VARCHAR(255) NOT NULL DEFAULT '',
    requester_contact VARCHAR(255) NOT NULL DEFAULT '',
    notes VARCHAR(1000) NOT NULL DEFAULT ''
);

CREATE INDEX index_ambulatory_blood_pressure_test_request_patient_id
    ON ambulatory_blood_pressure_test_request(patient_id);
CREATE INDEX index_ambulatory_blood_pressure_test_request_clinician_id
    ON ambulatory_blood_pressure_test_request(clinician_id);

CREATE TRIGGER trigger_ambulatory_blood_pressure_test_request_updated_at
    BEFORE UPDATE ON ambulatory_blood_pressure_test_request
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE ambulatory_blood_pressure_test_request IS
    'Ambulatory blood pressure monitoring (ABPM) test request (referral). Captures the requested test, the clinical indication and question, clinic blood pressure, medication, symptoms and accuracy factors, and triage urgency.';
COMMENT ON COLUMN ambulatory_blood_pressure_test_request.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN ambulatory_blood_pressure_test_request.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN ambulatory_blood_pressure_test_request.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN ambulatory_blood_pressure_test_request.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN ambulatory_blood_pressure_test_request.patient_id IS
    'Foreign key to the patient.';
COMMENT ON COLUMN ambulatory_blood_pressure_test_request.clinician_id IS
    'Foreign key to the requesting clinician (referrer).';
COMMENT ON COLUMN ambulatory_blood_pressure_test_request.status IS
    'Request lifecycle status: draft, submitted, vetted, scheduled, rejected.';
COMMENT ON COLUMN ambulatory_blood_pressure_test_request.site_name IS
    'Name of the requesting site or clinic.';
COMMENT ON COLUMN ambulatory_blood_pressure_test_request.setting IS
    'Care setting: outpatient, inpatient, community, emergency.';
COMMENT ON COLUMN ambulatory_blood_pressure_test_request.referral_date IS
    'Date the referral was made.';
COMMENT ON COLUMN ambulatory_blood_pressure_test_request.requested_by_date IS
    'Date by which the test is requested to be performed.';
COMMENT ON COLUMN ambulatory_blood_pressure_test_request.test_type IS
    'Requested test type: 24-hour-abpm, home-blood-pressure-monitoring, other.';
COMMENT ON COLUMN ambulatory_blood_pressure_test_request.primary_indication IS
    'Primary clinical indication, used for appropriateness scoring.';
COMMENT ON COLUMN ambulatory_blood_pressure_test_request.clinical_question IS
    'Specific clinical question the test should answer (highest-value field).';
COMMENT ON COLUMN ambulatory_blood_pressure_test_request.relevant_history IS
    'Relevant medical, cardiovascular, and medication history.';
COMMENT ON COLUMN ambulatory_blood_pressure_test_request.clinic_bp_systolic IS
    'Most recent clinic systolic blood pressure in mmHg, used for appropriateness and triage.';
COMMENT ON COLUMN ambulatory_blood_pressure_test_request.clinic_bp_diastolic IS
    'Most recent clinic diastolic blood pressure in mmHg, used for appropriateness and triage.';
COMMENT ON COLUMN ambulatory_blood_pressure_test_request.on_antihypertensives IS
    'Whether the patient is currently taking antihypertensive medication.';
COMMENT ON COLUMN ambulatory_blood_pressure_test_request.current_medications IS
    'Free-text list of the patient''s current medications.';
COMMENT ON COLUMN ambulatory_blood_pressure_test_request.symptom_dizziness IS
    'Whether the patient reports dizziness (possible hypotension symptom).';
COMMENT ON COLUMN ambulatory_blood_pressure_test_request.symptom_headache IS
    'Whether the patient reports headache.';
COMMENT ON COLUMN ambulatory_blood_pressure_test_request.atrial_fibrillation IS
    'Whether the patient has atrial fibrillation, which reduces oscillometric measurement accuracy.';
COMMENT ON COLUMN ambulatory_blood_pressure_test_request.pregnant IS
    'Whether the patient is pregnant, affecting thresholds and device validation.';
COMMENT ON COLUMN ambulatory_blood_pressure_test_request.urgency IS
    'Requested triage urgency: routine, urgent, emergency.';
COMMENT ON COLUMN ambulatory_blood_pressure_test_request.supervising_consultant IS
    'Name of the supervising / responsible consultant.';
COMMENT ON COLUMN ambulatory_blood_pressure_test_request.requester_contact IS
    'Contact details (bleep / phone) for the requester.';
COMMENT ON COLUMN ambulatory_blood_pressure_test_request.notes IS
    'Free-text additional notes.';
