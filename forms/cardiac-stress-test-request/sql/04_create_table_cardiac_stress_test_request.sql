-- Cardiac stress / exercise test request (referral) — the source-of-truth record.

CREATE TABLE cardiac_stress_test_request (
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
        CHECK (test_type IN ('exercise-treadmill-ecg', 'stress-echo', 'dobutamine-stress-echo', 'myocardial-perfusion-spect', 'stress-cardiac-mri', 'other', '')),
    primary_indication VARCHAR(40) NOT NULL DEFAULT ''
        CHECK (primary_indication IN ('suspected-angina', 'known-cad-assessment', 'risk-stratification-post-mi', 'pre-operative-cardiac', 'exercise-tolerance', 'arrhythmia-evaluation', 'valve-disease', 'other', '')),
    clinical_question VARCHAR(1000) NOT NULL DEFAULT '',
    relevant_history VARCHAR(1000) NOT NULL DEFAULT '',

    -- Symptoms
    symptom_chest_pain BOOLEAN NOT NULL DEFAULT FALSE,
    symptom_breathlessness BOOLEAN NOT NULL DEFAULT FALSE,
    symptom_palpitations BOOLEAN NOT NULL DEFAULT FALSE,
    able_to_exercise BOOLEAN NOT NULL DEFAULT FALSE,
    resting_ecg_findings VARCHAR(1000) NOT NULL DEFAULT '',

    -- Cardiac risk / safety factors
    known_coronary_artery_disease BOOLEAN NOT NULL DEFAULT FALSE,
    recent_acute_coronary_syndrome BOOLEAN NOT NULL DEFAULT FALSE,
    aortic_stenosis VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (aortic_stenosis IN ('none', 'mild', 'moderate', 'severe', 'unknown', '')),
    uncontrolled_hypertension BOOLEAN NOT NULL DEFAULT FALSE,
    beta_blocker BOOLEAN NOT NULL DEFAULT FALSE,

    -- Requester / triage
    urgency VARCHAR(15) NOT NULL DEFAULT 'routine'
        CHECK (urgency IN ('routine', 'urgent', 'emergency', '')),
    supervising_consultant VARCHAR(255) NOT NULL DEFAULT '',
    requester_contact VARCHAR(255) NOT NULL DEFAULT '',
    notes VARCHAR(1000) NOT NULL DEFAULT ''
);

CREATE INDEX index_cardiac_stress_test_request_patient_id
    ON cardiac_stress_test_request(patient_id);
CREATE INDEX index_cardiac_stress_test_request_clinician_id
    ON cardiac_stress_test_request(clinician_id);

CREATE TRIGGER trigger_cardiac_stress_test_request_updated_at
    BEFORE UPDATE ON cardiac_stress_test_request
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE cardiac_stress_test_request IS
    'Cardiac stress / exercise test request (referral). Captures the requested test type, the clinical indication and question, relevant history, presenting symptoms, ability to exercise, and the cardiac risk / safety factors (known CAD, recent ACS, aortic stenosis, uncontrolled hypertension, beta-blocker), plus triage urgency.';
COMMENT ON COLUMN cardiac_stress_test_request.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN cardiac_stress_test_request.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN cardiac_stress_test_request.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN cardiac_stress_test_request.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN cardiac_stress_test_request.patient_id IS
    'Foreign key to the patient.';
COMMENT ON COLUMN cardiac_stress_test_request.clinician_id IS
    'Foreign key to the requesting clinician (referrer).';
COMMENT ON COLUMN cardiac_stress_test_request.status IS
    'Request lifecycle status: draft, submitted, vetted, scheduled, rejected.';
COMMENT ON COLUMN cardiac_stress_test_request.site_name IS
    'Name of the requesting site or clinic.';
COMMENT ON COLUMN cardiac_stress_test_request.setting IS
    'Care setting: outpatient, inpatient, community, emergency.';
COMMENT ON COLUMN cardiac_stress_test_request.referral_date IS
    'Date the referral was made.';
COMMENT ON COLUMN cardiac_stress_test_request.requested_by_date IS
    'Date by which the test is requested to be performed.';
COMMENT ON COLUMN cardiac_stress_test_request.test_type IS
    'Requested stress-test modality: exercise-treadmill-ecg, stress-echo, dobutamine-stress-echo, myocardial-perfusion-spect, stress-cardiac-mri, other.';
COMMENT ON COLUMN cardiac_stress_test_request.primary_indication IS
    'Primary clinical indication, used for appropriateness scoring.';
COMMENT ON COLUMN cardiac_stress_test_request.clinical_question IS
    'Specific clinical question the test should answer (highest-value field).';
COMMENT ON COLUMN cardiac_stress_test_request.relevant_history IS
    'Relevant cardiac, medical, and surgical history.';
COMMENT ON COLUMN cardiac_stress_test_request.symptom_chest_pain IS
    'Whether the patient reports chest pain.';
COMMENT ON COLUMN cardiac_stress_test_request.symptom_breathlessness IS
    'Whether the patient reports breathlessness (dyspnoea).';
COMMENT ON COLUMN cardiac_stress_test_request.symptom_palpitations IS
    'Whether the patient reports palpitations.';
COMMENT ON COLUMN cardiac_stress_test_request.able_to_exercise IS
    'Whether the patient is able to exercise (determines exercise vs pharmacological stress).';
COMMENT ON COLUMN cardiac_stress_test_request.resting_ecg_findings IS
    'Relevant resting ECG findings (e.g. LBBB, paced, ST changes) affecting test selection.';
COMMENT ON COLUMN cardiac_stress_test_request.known_coronary_artery_disease IS
    'Whether the patient has known coronary artery disease.';
COMMENT ON COLUMN cardiac_stress_test_request.recent_acute_coronary_syndrome IS
    'Whether the patient has had a recent acute coronary syndrome (safety contraindication if very recent).';
COMMENT ON COLUMN cardiac_stress_test_request.aortic_stenosis IS
    'Aortic stenosis severity: none, mild, moderate, severe, unknown (severe symptomatic AS contraindicates exercise testing).';
COMMENT ON COLUMN cardiac_stress_test_request.uncontrolled_hypertension IS
    'Whether the patient has uncontrolled hypertension (relative contraindication).';
COMMENT ON COLUMN cardiac_stress_test_request.beta_blocker IS
    'Whether the patient is taking a beta-blocker (may blunt heart-rate response on exercise testing).';
COMMENT ON COLUMN cardiac_stress_test_request.urgency IS
    'Requested triage urgency: routine, urgent, emergency.';
COMMENT ON COLUMN cardiac_stress_test_request.supervising_consultant IS
    'Name of the supervising / responsible consultant.';
COMMENT ON COLUMN cardiac_stress_test_request.requester_contact IS
    'Contact details (bleep / phone) for the requester.';
COMMENT ON COLUMN cardiac_stress_test_request.notes IS
    'Free-text additional notes.';
