-- Ambulatory ECG (Holter) monitoring request (referral) — the source-of-truth record.

CREATE TABLE holter_monitor_test_request (
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
    monitor_type VARCHAR(30) NOT NULL DEFAULT ''
        CHECK (monitor_type IN ('24-hour', '48-hour', '7-day', '14-day', 'event-recorder', 'implantable-loop-recorder', 'other', '')),
    primary_indication VARCHAR(40) NOT NULL DEFAULT ''
        CHECK (primary_indication IN ('palpitations', 'suspected-arrhythmia', 'syncope', 'atrial-fibrillation-detection', 'post-stroke-af-screen', 'rate-control-assessment', 'qt-monitoring', 'pacemaker-check', 'other', '')),
    clinical_question VARCHAR(1000) NOT NULL DEFAULT '',
    relevant_history VARCHAR(1000) NOT NULL DEFAULT '',

    -- Symptoms
    symptom_palpitations BOOLEAN NOT NULL DEFAULT FALSE,
    symptom_syncope BOOLEAN NOT NULL DEFAULT FALSE,
    symptom_presyncope BOOLEAN NOT NULL DEFAULT FALSE,
    symptom_breathlessness BOOLEAN NOT NULL DEFAULT FALSE,
    symptom_frequency VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (symptom_frequency IN ('daily', 'weekly', 'monthly', 'rare', '')),

    -- Cardiac context / red flags
    known_arrhythmia VARCHAR(30) NOT NULL DEFAULT ''
        CHECK (known_arrhythmia IN ('none', 'atrial-fibrillation', 'svt', 'vt', 'heart-block', 'other', '')),
    recent_stroke_tia BOOLEAN NOT NULL DEFAULT FALSE,
    relevant_medications VARCHAR(1000) NOT NULL DEFAULT '',

    -- Requester / triage
    urgency VARCHAR(15) NOT NULL DEFAULT 'routine'
        CHECK (urgency IN ('routine', 'urgent', '')),
    supervising_consultant VARCHAR(255) NOT NULL DEFAULT '',
    requester_contact VARCHAR(255) NOT NULL DEFAULT '',
    notes VARCHAR(1000) NOT NULL DEFAULT ''
);

CREATE INDEX index_holter_monitor_test_request_patient_id
    ON holter_monitor_test_request(patient_id);
CREATE INDEX index_holter_monitor_test_request_clinician_id
    ON holter_monitor_test_request(clinician_id);

CREATE TRIGGER trigger_holter_monitor_test_request_updated_at
    BEFORE UPDATE ON holter_monitor_test_request
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE holter_monitor_test_request IS
    'Ambulatory ECG (Holter) monitoring request (referral). Captures the requested monitor type, primary indication and clinical question, symptoms and symptom frequency, cardiac context and red flags, relevant history and medications, and triage urgency.';
COMMENT ON COLUMN holter_monitor_test_request.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN holter_monitor_test_request.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN holter_monitor_test_request.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN holter_monitor_test_request.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN holter_monitor_test_request.patient_id IS
    'Foreign key to the patient.';
COMMENT ON COLUMN holter_monitor_test_request.clinician_id IS
    'Foreign key to the requesting clinician (referrer).';
COMMENT ON COLUMN holter_monitor_test_request.status IS
    'Request lifecycle status: draft, submitted, vetted, scheduled, rejected.';
COMMENT ON COLUMN holter_monitor_test_request.site_name IS
    'Name of the requesting site or clinic.';
COMMENT ON COLUMN holter_monitor_test_request.setting IS
    'Care setting: outpatient, inpatient, community, emergency.';
COMMENT ON COLUMN holter_monitor_test_request.referral_date IS
    'Date the referral was made.';
COMMENT ON COLUMN holter_monitor_test_request.requested_by_date IS
    'Date by which the monitoring is requested to be performed.';
COMMENT ON COLUMN holter_monitor_test_request.monitor_type IS
    'Requested monitor type: 24-hour, 48-hour, 7-day, 14-day, event-recorder, implantable-loop-recorder, other. Used for symptom-frequency / monitor-duration appropriateness.';
COMMENT ON COLUMN holter_monitor_test_request.primary_indication IS
    'Primary clinical indication, used for appropriateness scoring.';
COMMENT ON COLUMN holter_monitor_test_request.clinical_question IS
    'Specific clinical question the monitoring should answer (highest-value field).';
COMMENT ON COLUMN holter_monitor_test_request.relevant_history IS
    'Relevant cardiac, medical, and surgical history.';
COMMENT ON COLUMN holter_monitor_test_request.symptom_palpitations IS
    'Whether the patient reports palpitations.';
COMMENT ON COLUMN holter_monitor_test_request.symptom_syncope IS
    'Whether the patient reports syncope (red flag).';
COMMENT ON COLUMN holter_monitor_test_request.symptom_presyncope IS
    'Whether the patient reports presyncope / near-syncope.';
COMMENT ON COLUMN holter_monitor_test_request.symptom_breathlessness IS
    'Whether the patient reports breathlessness.';
COMMENT ON COLUMN holter_monitor_test_request.symptom_frequency IS
    'Frequency of symptoms: daily, weekly, monthly, rare. Drives monitor-duration matching.';
COMMENT ON COLUMN holter_monitor_test_request.known_arrhythmia IS
    'Known arrhythmia: none, atrial-fibrillation, svt, vt, heart-block, other.';
COMMENT ON COLUMN holter_monitor_test_request.recent_stroke_tia IS
    'Whether the patient has had a recent stroke or TIA (AF-detection driver).';
COMMENT ON COLUMN holter_monitor_test_request.relevant_medications IS
    'Relevant current medications (e.g. rate-control, antiarrhythmics, QT-prolonging drugs).';
COMMENT ON COLUMN holter_monitor_test_request.urgency IS
    'Requested triage urgency: routine, urgent.';
COMMENT ON COLUMN holter_monitor_test_request.supervising_consultant IS
    'Name of the supervising / responsible consultant.';
COMMENT ON COLUMN holter_monitor_test_request.requester_contact IS
    'Contact details (bleep / phone) for the requester.';
COMMENT ON COLUMN holter_monitor_test_request.notes IS
    'Free-text additional notes.';
