-- Audiology / hearing-assessment request (referral) — the source-of-truth record.

CREATE TABLE hearing_test_request (
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
        CHECK (test_type IN ('pure-tone-audiometry', 'tympanometry', 'speech-audiometry', 'otoacoustic-emissions', 'auditory-brainstem-response', 'newborn-hearing-screen', 'hearing-aid-assessment', 'other', '')),
    laterality VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (laterality IN ('left', 'right', 'bilateral', 'not-applicable', '')),
    primary_indication VARCHAR(40) NOT NULL DEFAULT ''
        CHECK (primary_indication IN ('hearing-loss', 'tinnitus', 'vertigo', 'ear-discharge', 'suspected-otosclerosis', 'occupational-noise', 'ototoxic-monitoring', 'developmental-delay-child', 'hearing-aid-review', 'sudden-hearing-loss', 'other', '')),
    clinical_question VARCHAR(1000) NOT NULL DEFAULT '',
    relevant_history VARCHAR(1000) NOT NULL DEFAULT '',

    -- Symptoms / red flags
    symptom_hearing_loss BOOLEAN NOT NULL DEFAULT FALSE,
    symptom_tinnitus BOOLEAN NOT NULL DEFAULT FALSE,
    symptom_vertigo BOOLEAN NOT NULL DEFAULT FALSE,
    symptom_otalgia BOOLEAN NOT NULL DEFAULT FALSE,
    sudden_onset BOOLEAN NOT NULL DEFAULT FALSE,
    ear_discharge BOOLEAN NOT NULL DEFAULT FALSE,
    ototoxic_medication BOOLEAN NOT NULL DEFAULT FALSE,

    -- Requester / triage
    urgency VARCHAR(15) NOT NULL DEFAULT 'routine'
        CHECK (urgency IN ('routine', 'urgent', 'emergency', '')),
    supervising_consultant VARCHAR(255) NOT NULL DEFAULT '',
    requester_contact VARCHAR(255) NOT NULL DEFAULT '',
    notes VARCHAR(1000) NOT NULL DEFAULT ''
);

CREATE INDEX index_hearing_test_request_patient_id
    ON hearing_test_request(patient_id);
CREATE INDEX index_hearing_test_request_clinician_id
    ON hearing_test_request(clinician_id);

CREATE TRIGGER trigger_hearing_test_request_updated_at
    BEFORE UPDATE ON hearing_test_request
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE hearing_test_request IS
    'Audiology / hearing-assessment request (referral). Captures the requested test, laterality, the clinical indication and question, relevant history, symptoms / red flags, and triage urgency.';
COMMENT ON COLUMN hearing_test_request.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN hearing_test_request.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN hearing_test_request.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN hearing_test_request.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN hearing_test_request.patient_id IS
    'Foreign key to the patient.';
COMMENT ON COLUMN hearing_test_request.clinician_id IS
    'Foreign key to the requesting clinician (referrer).';
COMMENT ON COLUMN hearing_test_request.status IS
    'Request lifecycle status: draft, submitted, vetted, scheduled, rejected.';
COMMENT ON COLUMN hearing_test_request.site_name IS
    'Name of the requesting site or clinic.';
COMMENT ON COLUMN hearing_test_request.setting IS
    'Care setting: outpatient, inpatient, community, emergency.';
COMMENT ON COLUMN hearing_test_request.referral_date IS
    'Date the referral was made.';
COMMENT ON COLUMN hearing_test_request.requested_by_date IS
    'Date by which the test is requested to be performed.';
COMMENT ON COLUMN hearing_test_request.test_type IS
    'Requested audiology test type: pure-tone-audiometry, tympanometry, speech-audiometry, otoacoustic-emissions, auditory-brainstem-response, newborn-hearing-screen, hearing-aid-assessment, other.';
COMMENT ON COLUMN hearing_test_request.laterality IS
    'Affected side: left, right, bilateral, not-applicable.';
COMMENT ON COLUMN hearing_test_request.primary_indication IS
    'Primary clinical indication, used for appropriateness scoring.';
COMMENT ON COLUMN hearing_test_request.clinical_question IS
    'Specific clinical question the test should answer (highest-value field).';
COMMENT ON COLUMN hearing_test_request.relevant_history IS
    'Relevant medical, otological, and noise-exposure history.';
COMMENT ON COLUMN hearing_test_request.symptom_hearing_loss IS
    'Whether the patient reports hearing loss.';
COMMENT ON COLUMN hearing_test_request.symptom_tinnitus IS
    'Whether the patient reports tinnitus.';
COMMENT ON COLUMN hearing_test_request.symptom_vertigo IS
    'Whether the patient reports vertigo or imbalance.';
COMMENT ON COLUMN hearing_test_request.symptom_otalgia IS
    'Whether the patient reports otalgia (ear pain).';
COMMENT ON COLUMN hearing_test_request.sudden_onset IS
    'Whether onset was sudden (red flag for sudden sensorineural hearing loss).';
COMMENT ON COLUMN hearing_test_request.ear_discharge IS
    'Whether the patient has ear discharge / otorrhoea (red flag).';
COMMENT ON COLUMN hearing_test_request.ototoxic_medication IS
    'Whether the patient is on ototoxic medication requiring monitoring.';
COMMENT ON COLUMN hearing_test_request.urgency IS
    'Requested triage urgency: routine, urgent, emergency.';
COMMENT ON COLUMN hearing_test_request.supervising_consultant IS
    'Name of the supervising / responsible consultant.';
COMMENT ON COLUMN hearing_test_request.requester_contact IS
    'Contact details (bleep / phone) for the requester.';
COMMENT ON COLUMN hearing_test_request.notes IS
    'Free-text additional notes.';
