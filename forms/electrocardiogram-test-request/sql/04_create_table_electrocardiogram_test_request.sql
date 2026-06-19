-- Electrocardiogram (ECG) test request (referral) — the source-of-truth record.

CREATE TABLE electrocardiogram_test_request (
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
    ecg_type VARCHAR(30) NOT NULL DEFAULT ''
        CHECK (ecg_type IN ('resting-12-lead', 'exercise-stress', 'ambulatory-holter-24h', 'ambulatory-48h', 'event-recorder', 'other', '')),
    primary_indication VARCHAR(40) NOT NULL DEFAULT ''
        CHECK (primary_indication IN ('chest-pain', 'palpitations', 'syncope', 'suspected-arrhythmia', 'suspected-mi-acs', 'pre-operative', 'medication-monitoring-qt', 'hypertension', 'heart-failure', 'screening', 'follow-up', 'other', '')),
    clinical_question VARCHAR(1000) NOT NULL DEFAULT '',
    relevant_history VARCHAR(1000) NOT NULL DEFAULT '',

    -- Symptoms / red flags
    symptom_chest_pain BOOLEAN NOT NULL DEFAULT FALSE,
    symptom_palpitations BOOLEAN NOT NULL DEFAULT FALSE,
    symptom_syncope BOOLEAN NOT NULL DEFAULT FALSE,
    symptom_breathlessness BOOLEAN NOT NULL DEFAULT FALSE,
    symptom_dizziness BOOLEAN NOT NULL DEFAULT FALSE,
    currently_symptomatic BOOLEAN NOT NULL DEFAULT FALSE,
    suspected_acs BOOLEAN NOT NULL DEFAULT FALSE,
    known_arrhythmia VARCHAR(25) NOT NULL DEFAULT ''
        CHECK (known_arrhythmia IN ('none', 'atrial-fibrillation', 'svt', 'vt', 'heart-block', 'other', '')),

    -- Medications
    relevant_medications VARCHAR(1000) NOT NULL DEFAULT '',

    -- Requester / triage
    urgency VARCHAR(15) NOT NULL DEFAULT 'routine'
        CHECK (urgency IN ('routine', 'urgent', 'emergency', '')),
    supervising_consultant VARCHAR(255) NOT NULL DEFAULT '',
    requester_contact VARCHAR(255) NOT NULL DEFAULT '',
    notes VARCHAR(1000) NOT NULL DEFAULT ''
);

CREATE INDEX index_electrocardiogram_test_request_patient_id
    ON electrocardiogram_test_request(patient_id);
CREATE INDEX index_electrocardiogram_test_request_clinician_id
    ON electrocardiogram_test_request(clinician_id);

CREATE TRIGGER trigger_electrocardiogram_test_request_updated_at
    BEFORE UPDATE ON electrocardiogram_test_request
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE electrocardiogram_test_request IS
    'Electrocardiogram (ECG) test request (referral). Captures the requested ECG type, the clinical indication and question, relevant history and medications, symptoms / red flags, and triage urgency.';
COMMENT ON COLUMN electrocardiogram_test_request.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN electrocardiogram_test_request.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN electrocardiogram_test_request.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN electrocardiogram_test_request.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN electrocardiogram_test_request.patient_id IS
    'Foreign key to the patient.';
COMMENT ON COLUMN electrocardiogram_test_request.clinician_id IS
    'Foreign key to the requesting clinician (referrer).';
COMMENT ON COLUMN electrocardiogram_test_request.status IS
    'Request lifecycle status: draft, submitted, vetted, scheduled, rejected.';
COMMENT ON COLUMN electrocardiogram_test_request.site_name IS
    'Name of the requesting site or clinic.';
COMMENT ON COLUMN electrocardiogram_test_request.setting IS
    'Care setting: outpatient, inpatient, community, emergency.';
COMMENT ON COLUMN electrocardiogram_test_request.referral_date IS
    'Date the referral was made.';
COMMENT ON COLUMN electrocardiogram_test_request.requested_by_date IS
    'Date by which the ECG is requested to be performed.';
COMMENT ON COLUMN electrocardiogram_test_request.ecg_type IS
    'Requested ECG type: resting-12-lead, exercise-stress, ambulatory-holter-24h, ambulatory-48h, event-recorder, other.';
COMMENT ON COLUMN electrocardiogram_test_request.primary_indication IS
    'Primary clinical indication, used for appropriateness scoring.';
COMMENT ON COLUMN electrocardiogram_test_request.clinical_question IS
    'Specific clinical question the ECG should answer (highest-value field).';
COMMENT ON COLUMN electrocardiogram_test_request.relevant_history IS
    'Relevant cardiac and medical history.';
COMMENT ON COLUMN electrocardiogram_test_request.symptom_chest_pain IS
    'Whether the patient reports chest pain.';
COMMENT ON COLUMN electrocardiogram_test_request.symptom_palpitations IS
    'Whether the patient reports palpitations.';
COMMENT ON COLUMN electrocardiogram_test_request.symptom_syncope IS
    'Whether the patient reports syncope or collapse.';
COMMENT ON COLUMN electrocardiogram_test_request.symptom_breathlessness IS
    'Whether the patient reports breathlessness.';
COMMENT ON COLUMN electrocardiogram_test_request.symptom_dizziness IS
    'Whether the patient reports dizziness or light-headedness.';
COMMENT ON COLUMN electrocardiogram_test_request.currently_symptomatic IS
    'Whether the patient is symptomatic at the time of request (favours capturing the event).';
COMMENT ON COLUMN electrocardiogram_test_request.suspected_acs IS
    'Whether acute coronary syndrome is suspected (red flag).';
COMMENT ON COLUMN electrocardiogram_test_request.known_arrhythmia IS
    'Known arrhythmia: none, atrial-fibrillation, svt, vt, heart-block, other.';
COMMENT ON COLUMN electrocardiogram_test_request.relevant_medications IS
    'Relevant current medications, especially QT-prolonging or rate-controlling agents.';
COMMENT ON COLUMN electrocardiogram_test_request.urgency IS
    'Requested triage urgency: routine, urgent, emergency.';
COMMENT ON COLUMN electrocardiogram_test_request.supervising_consultant IS
    'Name of the supervising / responsible consultant.';
COMMENT ON COLUMN electrocardiogram_test_request.requester_contact IS
    'Contact details (bleep / phone) for the requester.';
COMMENT ON COLUMN electrocardiogram_test_request.notes IS
    'Free-text additional notes.';
