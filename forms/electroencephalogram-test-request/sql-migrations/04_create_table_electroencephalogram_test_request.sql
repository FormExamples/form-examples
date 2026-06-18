-- Electroencephalogram (EEG) test request (referral) — the source-of-truth record.

CREATE TABLE electroencephalogram_test_request (
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
    eeg_type VARCHAR(30) NOT NULL DEFAULT ''
        CHECK (eeg_type IN ('routine-awake', 'sleep-deprived', 'ambulatory-24h', 'video-telemetry', 'other', '')),
    primary_indication VARCHAR(40) NOT NULL DEFAULT ''
        CHECK (primary_indication IN ('suspected-epilepsy', 'seizure-classification', 'status-epilepticus', 'encephalopathy', 'first-seizure', 'funny-turns', 'dementia', 'pre-surgical-evaluation', 'medication-review', 'other', '')),
    clinical_question VARCHAR(1000) NOT NULL DEFAULT '',
    relevant_history VARCHAR(1000) NOT NULL DEFAULT '',

    -- Seizure / epilepsy context
    seizure_frequency VARCHAR(255) NOT NULL DEFAULT '',
    first_seizure BOOLEAN NOT NULL DEFAULT FALSE,
    known_epilepsy BOOLEAN NOT NULL DEFAULT FALSE,
    current_antiepileptics VARCHAR(1000) NOT NULL DEFAULT '',
    recent_seizure BOOLEAN NOT NULL DEFAULT FALSE,
    suspected_status_epilepticus BOOLEAN NOT NULL DEFAULT FALSE,

    -- Requester / triage
    urgency VARCHAR(15) NOT NULL DEFAULT 'routine'
        CHECK (urgency IN ('routine', 'urgent', 'emergency', '')),
    supervising_consultant VARCHAR(255) NOT NULL DEFAULT '',
    requester_contact VARCHAR(255) NOT NULL DEFAULT '',
    notes VARCHAR(1000) NOT NULL DEFAULT ''
);

CREATE INDEX index_electroencephalogram_test_request_patient_id
    ON electroencephalogram_test_request(patient_id);
CREATE INDEX index_electroencephalogram_test_request_clinician_id
    ON electroencephalogram_test_request(clinician_id);

CREATE TRIGGER trigger_electroencephalogram_test_request_updated_at
    BEFORE UPDATE ON electroencephalogram_test_request
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE electroencephalogram_test_request IS
    'Electroencephalogram (EEG) test request (referral). Captures the requested EEG type, the clinical indication and question, seizure / epilepsy context, antiepileptic medication, red flags, and triage urgency.';
COMMENT ON COLUMN electroencephalogram_test_request.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN electroencephalogram_test_request.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN electroencephalogram_test_request.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN electroencephalogram_test_request.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN electroencephalogram_test_request.patient_id IS
    'Foreign key to the patient.';
COMMENT ON COLUMN electroencephalogram_test_request.clinician_id IS
    'Foreign key to the requesting clinician (referrer).';
COMMENT ON COLUMN electroencephalogram_test_request.status IS
    'Request lifecycle status: draft, submitted, vetted, scheduled, rejected.';
COMMENT ON COLUMN electroencephalogram_test_request.site_name IS
    'Name of the requesting site or clinic.';
COMMENT ON COLUMN electroencephalogram_test_request.setting IS
    'Care setting: outpatient, inpatient, community, emergency.';
COMMENT ON COLUMN electroencephalogram_test_request.referral_date IS
    'Date the referral was made.';
COMMENT ON COLUMN electroencephalogram_test_request.requested_by_date IS
    'Date by which the EEG is requested to be performed.';
COMMENT ON COLUMN electroencephalogram_test_request.eeg_type IS
    'Requested EEG type: routine-awake, sleep-deprived, ambulatory-24h, video-telemetry, other.';
COMMENT ON COLUMN electroencephalogram_test_request.primary_indication IS
    'Primary clinical indication, used for appropriateness scoring.';
COMMENT ON COLUMN electroencephalogram_test_request.clinical_question IS
    'Specific clinical question the EEG should answer (highest-value field).';
COMMENT ON COLUMN electroencephalogram_test_request.relevant_history IS
    'Relevant medical, neurological, and seizure history.';
COMMENT ON COLUMN electroencephalogram_test_request.seizure_frequency IS
    'Reported seizure frequency (free text, e.g. "2 per week").';
COMMENT ON COLUMN electroencephalogram_test_request.first_seizure IS
    'Whether this is a first unprovoked seizure presentation.';
COMMENT ON COLUMN electroencephalogram_test_request.known_epilepsy IS
    'Whether the patient has an established diagnosis of epilepsy.';
COMMENT ON COLUMN electroencephalogram_test_request.current_antiepileptics IS
    'Current antiepileptic drug therapy (free text).';
COMMENT ON COLUMN electroencephalogram_test_request.recent_seizure IS
    'Whether the patient had a recent seizure relevant to timing of the EEG.';
COMMENT ON COLUMN electroencephalogram_test_request.suspected_status_epilepticus IS
    'Whether status epilepticus is suspected (red flag).';
COMMENT ON COLUMN electroencephalogram_test_request.urgency IS
    'Requested triage urgency: routine, urgent, emergency.';
COMMENT ON COLUMN electroencephalogram_test_request.supervising_consultant IS
    'Name of the supervising / responsible consultant.';
COMMENT ON COLUMN electroencephalogram_test_request.requester_contact IS
    'Contact details (bleep / phone) for the requester.';
COMMENT ON COLUMN electroencephalogram_test_request.notes IS
    'Free-text additional notes.';
