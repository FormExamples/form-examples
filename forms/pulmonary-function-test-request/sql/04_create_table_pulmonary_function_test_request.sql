-- Pulmonary function test (lung-function / spirometry) request — the source-of-truth record.

CREATE TABLE pulmonary_function_test_request (
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
        CHECK (test_type IN ('spirometry', 'spirometry-with-reversibility', 'full-lung-function', 'gas-transfer-dlco', 'peak-flow', 'feno', 'other', '')),
    primary_indication VARCHAR(40) NOT NULL DEFAULT ''
        CHECK (primary_indication IN ('suspected-asthma', 'suspected-copd', 'breathlessness', 'chronic-cough', 'pre-operative', 'occupational-lung-disease', 'monitoring', 'restrictive-disease', 'other', '')),
    clinical_question VARCHAR(1000) NOT NULL DEFAULT '',
    relevant_history VARCHAR(1000) NOT NULL DEFAULT '',

    -- Symptoms
    symptom_breathlessness BOOLEAN NOT NULL DEFAULT FALSE,
    symptom_cough BOOLEAN NOT NULL DEFAULT FALSE,
    symptom_wheeze BOOLEAN NOT NULL DEFAULT FALSE,

    -- Background
    smoking_status VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (smoking_status IN ('never', 'ex', 'current', '')),
    current_inhalers VARCHAR(1000) NOT NULL DEFAULT '',

    -- Safety / contraindication screen
    recent_respiratory_infection BOOLEAN NOT NULL DEFAULT FALSE,
    recent_mi_or_eye_abdominal_surgery BOOLEAN NOT NULL DEFAULT FALSE,
    suspected_active_tuberculosis BOOLEAN NOT NULL DEFAULT FALSE,

    -- Requester / triage
    urgency VARCHAR(15) NOT NULL DEFAULT 'routine'
        CHECK (urgency IN ('routine', 'urgent', '')),
    supervising_consultant VARCHAR(255) NOT NULL DEFAULT '',
    requester_contact VARCHAR(255) NOT NULL DEFAULT '',
    notes VARCHAR(1000) NOT NULL DEFAULT ''
);

CREATE INDEX index_pulmonary_function_test_request_patient_id
    ON pulmonary_function_test_request(patient_id);
CREATE INDEX index_pulmonary_function_test_request_clinician_id
    ON pulmonary_function_test_request(clinician_id);

CREATE TRIGGER trigger_pulmonary_function_test_request_updated_at
    BEFORE UPDATE ON pulmonary_function_test_request
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE pulmonary_function_test_request IS
    'Pulmonary function test (lung-function / spirometry) request (referral). Captures the requested test, the clinical indication and question, symptoms, smoking and inhaler background, a safety / contraindication screen, and triage urgency.';
COMMENT ON COLUMN pulmonary_function_test_request.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN pulmonary_function_test_request.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN pulmonary_function_test_request.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN pulmonary_function_test_request.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN pulmonary_function_test_request.patient_id IS
    'Foreign key to the patient.';
COMMENT ON COLUMN pulmonary_function_test_request.clinician_id IS
    'Foreign key to the requesting clinician (referrer).';
COMMENT ON COLUMN pulmonary_function_test_request.status IS
    'Request lifecycle status: draft, submitted, vetted, scheduled, rejected.';
COMMENT ON COLUMN pulmonary_function_test_request.site_name IS
    'Name of the requesting site or clinic.';
COMMENT ON COLUMN pulmonary_function_test_request.setting IS
    'Care setting: outpatient, inpatient, community, emergency.';
COMMENT ON COLUMN pulmonary_function_test_request.referral_date IS
    'Date the referral was made.';
COMMENT ON COLUMN pulmonary_function_test_request.requested_by_date IS
    'Date by which the test is requested to be performed.';
COMMENT ON COLUMN pulmonary_function_test_request.test_type IS
    'Requested test type: spirometry, spirometry-with-reversibility, full-lung-function, gas-transfer-dlco, peak-flow, feno, other.';
COMMENT ON COLUMN pulmonary_function_test_request.primary_indication IS
    'Primary clinical indication, used for appropriateness scoring.';
COMMENT ON COLUMN pulmonary_function_test_request.clinical_question IS
    'Specific clinical question the test should answer (highest-value field).';
COMMENT ON COLUMN pulmonary_function_test_request.relevant_history IS
    'Relevant medical, respiratory, and occupational history.';
COMMENT ON COLUMN pulmonary_function_test_request.symptom_breathlessness IS
    'Whether the patient reports breathlessness.';
COMMENT ON COLUMN pulmonary_function_test_request.symptom_cough IS
    'Whether the patient reports cough.';
COMMENT ON COLUMN pulmonary_function_test_request.symptom_wheeze IS
    'Whether the patient reports wheeze.';
COMMENT ON COLUMN pulmonary_function_test_request.smoking_status IS
    'Smoking status: never, ex, current.';
COMMENT ON COLUMN pulmonary_function_test_request.current_inhalers IS
    'Current inhaler / respiratory medication, relevant to withhold instructions before reversibility testing.';
COMMENT ON COLUMN pulmonary_function_test_request.recent_respiratory_infection IS
    'Whether the patient had a recent respiratory infection (infection-control and result-validity flag).';
COMMENT ON COLUMN pulmonary_function_test_request.recent_mi_or_eye_abdominal_surgery IS
    'Whether the patient had a recent myocardial infarction or recent eye / thoracic / abdominal surgery (forced-expiration contraindication screen).';
COMMENT ON COLUMN pulmonary_function_test_request.suspected_active_tuberculosis IS
    'Whether active tuberculosis is suspected (infection-control contraindication for shared equipment).';
COMMENT ON COLUMN pulmonary_function_test_request.urgency IS
    'Requested triage urgency: routine, urgent.';
COMMENT ON COLUMN pulmonary_function_test_request.supervising_consultant IS
    'Name of the supervising / responsible consultant.';
COMMENT ON COLUMN pulmonary_function_test_request.requester_contact IS
    'Contact details (bleep / phone) for the requester.';
COMMENT ON COLUMN pulmonary_function_test_request.notes IS
    'Free-text additional notes.';
