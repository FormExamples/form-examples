-- Cystoscopy (bladder endoscopy) request (referral) — the source-of-truth record.

CREATE TABLE cystoscopy_test_request (
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
    procedure VARCHAR(30) NOT NULL DEFAULT ''
        CHECK (procedure IN ('flexible-cystoscopy', 'rigid-cystoscopy', 'other', '')),
    primary_indication VARCHAR(40) NOT NULL DEFAULT ''
        CHECK (primary_indication IN ('visible-haematuria', 'non-visible-haematuria', 'recurrent-uti', 'lower-urinary-tract-symptoms', 'bladder-cancer-surveillance', 'suspected-bladder-tumour', 'urethral-stricture', 'catheter-problems', 'other', '')),
    clinical_question VARCHAR(1000) NOT NULL DEFAULT '',
    relevant_history VARCHAR(1000) NOT NULL DEFAULT '',

    -- Symptoms
    symptom_haematuria BOOLEAN NOT NULL DEFAULT FALSE,
    symptom_dysuria BOOLEAN NOT NULL DEFAULT FALSE,
    symptom_frequency BOOLEAN NOT NULL DEFAULT FALSE,
    symptom_retention BOOLEAN NOT NULL DEFAULT FALSE,
    visible_haematuria BOOLEAN NOT NULL DEFAULT FALSE,
    current_uti BOOLEAN NOT NULL DEFAULT FALSE,

    -- Bleeding risk
    taking_anticoagulant BOOLEAN NOT NULL DEFAULT FALSE,
    anticoagulant_agent VARCHAR(255) NOT NULL DEFAULT '',
    taking_antiplatelet BOOLEAN NOT NULL DEFAULT FALSE,
    previous_bladder_cancer BOOLEAN NOT NULL DEFAULT FALSE,

    -- Requester / triage
    urgency VARCHAR(15) NOT NULL DEFAULT 'routine'
        CHECK (urgency IN ('routine', 'urgent', 'two-week-wait', 'emergency', '')),
    supervising_consultant VARCHAR(255) NOT NULL DEFAULT '',
    requester_contact VARCHAR(255) NOT NULL DEFAULT '',
    notes VARCHAR(1000) NOT NULL DEFAULT ''
);

CREATE INDEX index_cystoscopy_test_request_patient_id
    ON cystoscopy_test_request(patient_id);
CREATE INDEX index_cystoscopy_test_request_clinician_id
    ON cystoscopy_test_request(clinician_id);

CREATE TRIGGER trigger_cystoscopy_test_request_updated_at
    BEFORE UPDATE ON cystoscopy_test_request
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE cystoscopy_test_request IS
    'Cystoscopy (bladder endoscopy) request (referral). Captures the requested procedure, the clinical indication and question, relevant history, symptoms, bleeding-risk factors, and triage urgency.';
COMMENT ON COLUMN cystoscopy_test_request.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN cystoscopy_test_request.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN cystoscopy_test_request.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN cystoscopy_test_request.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN cystoscopy_test_request.patient_id IS
    'Foreign key to the patient.';
COMMENT ON COLUMN cystoscopy_test_request.clinician_id IS
    'Foreign key to the requesting clinician (referrer).';
COMMENT ON COLUMN cystoscopy_test_request.status IS
    'Request lifecycle status: draft, submitted, vetted, scheduled, rejected.';
COMMENT ON COLUMN cystoscopy_test_request.site_name IS
    'Name of the requesting site or clinic.';
COMMENT ON COLUMN cystoscopy_test_request.setting IS
    'Care setting: outpatient, inpatient, community, emergency.';
COMMENT ON COLUMN cystoscopy_test_request.referral_date IS
    'Date the referral was made.';
COMMENT ON COLUMN cystoscopy_test_request.requested_by_date IS
    'Date by which the cystoscopy is requested to be performed.';
COMMENT ON COLUMN cystoscopy_test_request.procedure IS
    'Requested procedure: flexible-cystoscopy, rigid-cystoscopy, other.';
COMMENT ON COLUMN cystoscopy_test_request.primary_indication IS
    'Primary clinical indication, used for appropriateness scoring.';
COMMENT ON COLUMN cystoscopy_test_request.clinical_question IS
    'Specific clinical question the cystoscopy should answer (highest-value field).';
COMMENT ON COLUMN cystoscopy_test_request.relevant_history IS
    'Relevant medical, surgical, and urological history.';
COMMENT ON COLUMN cystoscopy_test_request.symptom_haematuria IS
    'Whether the patient reports blood in the urine (haematuria).';
COMMENT ON COLUMN cystoscopy_test_request.symptom_dysuria IS
    'Whether the patient reports painful or difficult urination (dysuria).';
COMMENT ON COLUMN cystoscopy_test_request.symptom_frequency IS
    'Whether the patient reports urinary frequency.';
COMMENT ON COLUMN cystoscopy_test_request.symptom_retention IS
    'Whether the patient reports urinary retention.';
COMMENT ON COLUMN cystoscopy_test_request.visible_haematuria IS
    'Whether the haematuria is visible (macroscopic / frank) rather than non-visible (red flag for 2WW).';
COMMENT ON COLUMN cystoscopy_test_request.current_uti IS
    'Whether the patient currently has an active urinary tract infection (defer for active UTI).';
COMMENT ON COLUMN cystoscopy_test_request.taking_anticoagulant IS
    'Whether the patient is taking an anticoagulant (bleeding-risk factor).';
COMMENT ON COLUMN cystoscopy_test_request.anticoagulant_agent IS
    'Name of the anticoagulant agent the patient is taking, if any.';
COMMENT ON COLUMN cystoscopy_test_request.taking_antiplatelet IS
    'Whether the patient is taking an antiplatelet agent (bleeding-risk factor).';
COMMENT ON COLUMN cystoscopy_test_request.previous_bladder_cancer IS
    'Whether the patient has a history of bladder cancer (surveillance context).';
COMMENT ON COLUMN cystoscopy_test_request.urgency IS
    'Requested triage urgency: routine, urgent, two-week-wait, emergency.';
COMMENT ON COLUMN cystoscopy_test_request.supervising_consultant IS
    'Name of the supervising / responsible consultant.';
COMMENT ON COLUMN cystoscopy_test_request.requester_contact IS
    'Contact details (bleep / phone) for the requester.';
COMMENT ON COLUMN cystoscopy_test_request.notes IS
    'Free-text additional notes.';
