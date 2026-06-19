-- Fluoroscopy / contrast-study request (referral) — the source-of-truth record.

CREATE TABLE fluoroscopy_test_request (
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
    study_type VARCHAR(40) NOT NULL DEFAULT ''
        CHECK (study_type IN ('barium-swallow', 'barium-meal', 'barium-follow-through', 'barium-enema', 'water-soluble-contrast-swallow', 'defecating-proctogram', 'hysterosalpingogram', 'micturating-cystourethrogram', 'arthrogram', 'fluoroscopy-guided-procedure', 'other', '')),
    primary_indication VARCHAR(40) NOT NULL DEFAULT ''
        CHECK (primary_indication IN ('dysphagia', 'reflux', 'suspected-obstruction', 'suspected-perforation', 'constipation', 'infertility-tubal-patency', 'vesicoureteric-reflux', 'joint-assessment', 'other', '')),
    clinical_question VARCHAR(1000) NOT NULL DEFAULT '',
    relevant_history VARCHAR(1000) NOT NULL DEFAULT '',

    -- Safety / radiation context
    pregnancy_status VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (pregnancy_status IN ('not-pregnant', 'pregnant', 'possible', 'unknown', 'not-applicable', '')),
    contrast_allergy BOOLEAN NOT NULL DEFAULT FALSE,
    aspiration_risk BOOLEAN NOT NULL DEFAULT FALSE,
    diabetes BOOLEAN NOT NULL DEFAULT FALSE,

    -- Requester / triage
    urgency VARCHAR(15) NOT NULL DEFAULT 'routine'
        CHECK (urgency IN ('routine', 'urgent', 'emergency', '')),
    ir_me_r_justification VARCHAR(1000) NOT NULL DEFAULT '',
    supervising_consultant VARCHAR(255) NOT NULL DEFAULT '',
    requester_contact VARCHAR(255) NOT NULL DEFAULT '',
    notes VARCHAR(1000) NOT NULL DEFAULT ''
);

CREATE INDEX index_fluoroscopy_test_request_patient_id
    ON fluoroscopy_test_request(patient_id);
CREATE INDEX index_fluoroscopy_test_request_clinician_id
    ON fluoroscopy_test_request(clinician_id);

CREATE TRIGGER trigger_fluoroscopy_test_request_updated_at
    BEFORE UPDATE ON fluoroscopy_test_request
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE fluoroscopy_test_request IS
    'Fluoroscopy / contrast-study request (referral) for barium studies and related procedures. Captures the requested study, the clinical indication and question, relevant history, pregnancy and radiation-safety context, and triage urgency.';
COMMENT ON COLUMN fluoroscopy_test_request.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN fluoroscopy_test_request.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN fluoroscopy_test_request.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN fluoroscopy_test_request.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN fluoroscopy_test_request.patient_id IS
    'Foreign key to the patient.';
COMMENT ON COLUMN fluoroscopy_test_request.clinician_id IS
    'Foreign key to the requesting clinician (referrer).';
COMMENT ON COLUMN fluoroscopy_test_request.status IS
    'Request lifecycle status: draft, submitted, vetted, scheduled, rejected.';
COMMENT ON COLUMN fluoroscopy_test_request.site_name IS
    'Name of the requesting site or clinic.';
COMMENT ON COLUMN fluoroscopy_test_request.setting IS
    'Care setting: outpatient, inpatient, community, emergency.';
COMMENT ON COLUMN fluoroscopy_test_request.referral_date IS
    'Date the referral was made.';
COMMENT ON COLUMN fluoroscopy_test_request.requested_by_date IS
    'Date by which the study is requested to be performed.';
COMMENT ON COLUMN fluoroscopy_test_request.study_type IS
    'Requested fluoroscopy / contrast study type, used for appropriateness and radiation-dose banding.';
COMMENT ON COLUMN fluoroscopy_test_request.primary_indication IS
    'Primary clinical indication, used for appropriateness scoring and contrast-choice safety.';
COMMENT ON COLUMN fluoroscopy_test_request.clinical_question IS
    'Specific clinical question the study should answer (highest-value field).';
COMMENT ON COLUMN fluoroscopy_test_request.relevant_history IS
    'Relevant medical, surgical, and clinical history.';
COMMENT ON COLUMN fluoroscopy_test_request.pregnancy_status IS
    'Pregnancy status for ionising-radiation safety: not-pregnant, pregnant, possible, unknown, not-applicable.';
COMMENT ON COLUMN fluoroscopy_test_request.contrast_allergy IS
    'Whether the patient has a known contrast-media allergy (safety factor).';
COMMENT ON COLUMN fluoroscopy_test_request.aspiration_risk IS
    'Whether the patient is at risk of aspiration (favours water-soluble contrast).';
COMMENT ON COLUMN fluoroscopy_test_request.diabetes IS
    'Whether the patient has diabetes.';
COMMENT ON COLUMN fluoroscopy_test_request.urgency IS
    'Requested triage urgency: routine, urgent, emergency.';
COMMENT ON COLUMN fluoroscopy_test_request.ir_me_r_justification IS
    'IR(ME)R justification: clinical rationale for exposing the patient to ionising radiation.';
COMMENT ON COLUMN fluoroscopy_test_request.supervising_consultant IS
    'Name of the supervising / responsible consultant.';
COMMENT ON COLUMN fluoroscopy_test_request.requester_contact IS
    'Contact details (bleep / phone) for the requester.';
COMMENT ON COLUMN fluoroscopy_test_request.notes IS
    'Free-text additional notes.';
