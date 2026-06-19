-- Sleep study / polysomnography request (referral) — the source-of-truth record.

CREATE TABLE sleep_study_test_request (
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
        CHECK (setting IN ('outpatient', 'inpatient', 'community', 'home', '')),
    referral_date DATE,
    requested_by_date DATE,

    -- Requested examination
    study_type VARCHAR(30) NOT NULL DEFAULT ''
        CHECK (study_type IN ('home-sleep-apnoea-test', 'polysomnography', 'overnight-oximetry', 'multiple-sleep-latency-test', 'actigraphy', 'other', '')),
    primary_indication VARCHAR(30) NOT NULL DEFAULT ''
        CHECK (primary_indication IN ('suspected-osa', 'snoring', 'daytime-sleepiness', 'suspected-narcolepsy', 'insomnia', 'restless-legs', 'copd-overlap', 'pre-bariatric', 'driver-assessment', 'other', '')),
    clinical_question VARCHAR(1000) NOT NULL DEFAULT '',
    relevant_history VARCHAR(1000) NOT NULL DEFAULT '',

    -- Risk scores and measurements
    epworth_score INTEGER
        CHECK (epworth_score IS NULL OR epworth_score BETWEEN 0 AND 24),
    stop_bang_score INTEGER
        CHECK (stop_bang_score IS NULL OR stop_bang_score BETWEEN 0 AND 8),
    body_mass_index NUMERIC(4,1),
    neck_circumference_cm NUMERIC(4,1),

    -- Symptoms / risk factors
    witnessed_apnoeas BOOLEAN NOT NULL DEFAULT FALSE,
    occupational_driver BOOLEAN NOT NULL DEFAULT FALSE,
    cardiovascular_disease BOOLEAN NOT NULL DEFAULT FALSE,

    -- Requester / triage
    urgency VARCHAR(15) NOT NULL DEFAULT 'routine'
        CHECK (urgency IN ('routine', 'urgent', '')),
    supervising_consultant VARCHAR(255) NOT NULL DEFAULT '',
    requester_contact VARCHAR(255) NOT NULL DEFAULT '',
    notes VARCHAR(1000) NOT NULL DEFAULT ''
);

CREATE INDEX index_sleep_study_test_request_patient_id
    ON sleep_study_test_request(patient_id);
CREATE INDEX index_sleep_study_test_request_clinician_id
    ON sleep_study_test_request(clinician_id);

CREATE TRIGGER trigger_sleep_study_test_request_updated_at
    BEFORE UPDATE ON sleep_study_test_request
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE sleep_study_test_request IS
    'Sleep study / polysomnography request (referral), mainly for obstructive sleep apnoea. Captures the requested study, the clinical indication and question, Epworth and STOP-BANG scores, anthropometry, symptoms / risk factors, and triage urgency.';
COMMENT ON COLUMN sleep_study_test_request.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN sleep_study_test_request.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN sleep_study_test_request.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN sleep_study_test_request.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN sleep_study_test_request.patient_id IS
    'Foreign key to the patient.';
COMMENT ON COLUMN sleep_study_test_request.clinician_id IS
    'Foreign key to the requesting clinician (referrer).';
COMMENT ON COLUMN sleep_study_test_request.status IS
    'Request lifecycle status: draft, submitted, vetted, scheduled, rejected.';
COMMENT ON COLUMN sleep_study_test_request.site_name IS
    'Name of the requesting site or clinic.';
COMMENT ON COLUMN sleep_study_test_request.setting IS
    'Care setting: outpatient, inpatient, community, home.';
COMMENT ON COLUMN sleep_study_test_request.referral_date IS
    'Date the referral was made.';
COMMENT ON COLUMN sleep_study_test_request.requested_by_date IS
    'Date by which the study is requested to be performed.';
COMMENT ON COLUMN sleep_study_test_request.study_type IS
    'Requested study type: home-sleep-apnoea-test, polysomnography, overnight-oximetry, multiple-sleep-latency-test, actigraphy, other.';
COMMENT ON COLUMN sleep_study_test_request.primary_indication IS
    'Primary clinical indication, used for appropriateness scoring.';
COMMENT ON COLUMN sleep_study_test_request.clinical_question IS
    'Specific clinical question the study should answer (highest-value field).';
COMMENT ON COLUMN sleep_study_test_request.relevant_history IS
    'Relevant medical, surgical, and sleep history.';
COMMENT ON COLUMN sleep_study_test_request.epworth_score IS
    'Epworth Sleepiness Scale score (0-24); higher indicates greater daytime sleepiness.';
COMMENT ON COLUMN sleep_study_test_request.stop_bang_score IS
    'STOP-BANG questionnaire score (0-8); higher indicates greater OSA risk.';
COMMENT ON COLUMN sleep_study_test_request.body_mass_index IS
    'Body mass index (BMI), a STOP-BANG and OSA-risk factor.';
COMMENT ON COLUMN sleep_study_test_request.neck_circumference_cm IS
    'Neck circumference in cm, a STOP-BANG and OSA-risk factor.';
COMMENT ON COLUMN sleep_study_test_request.witnessed_apnoeas IS
    'Whether witnessed apnoeas have been reported.';
COMMENT ON COLUMN sleep_study_test_request.occupational_driver IS
    'Whether the patient is an occupational / vocational driver (DVLA relevance).';
COMMENT ON COLUMN sleep_study_test_request.cardiovascular_disease IS
    'Whether the patient has established cardiovascular disease.';
COMMENT ON COLUMN sleep_study_test_request.urgency IS
    'Requested triage urgency: routine, urgent.';
COMMENT ON COLUMN sleep_study_test_request.supervising_consultant IS
    'Name of the supervising / responsible consultant.';
COMMENT ON COLUMN sleep_study_test_request.requester_contact IS
    'Contact details (bleep / phone) for the requester.';
COMMENT ON COLUMN sleep_study_test_request.notes IS
    'Free-text additional notes.';
