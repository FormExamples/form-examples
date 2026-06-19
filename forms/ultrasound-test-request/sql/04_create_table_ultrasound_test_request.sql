-- General (non-obstetric) diagnostic ultrasound request (referral) — the source-of-truth record.

CREATE TABLE ultrasound_test_request (
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
    body_region VARCHAR(30) NOT NULL DEFAULT ''
        CHECK (body_region IN ('abdomen', 'pelvis', 'renal-tract', 'liver-biliary', 'thyroid-neck', 'scrotum-testes', 'breast', 'soft-tissue', 'vascular-doppler', 'dvt-leg', 'carotid', 'msk-joint', 'other', '')),
    laterality VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (laterality IN ('left', 'right', 'bilateral', 'not-applicable', '')),
    primary_indication VARCHAR(40) NOT NULL DEFAULT ''
        CHECK (primary_indication IN ('abdominal-pain', 'suspected-gallstones', 'abnormal-lfts', 'renal-impairment', 'haematuria', 'palpable-mass', 'suspected-dvt', 'suspected-aaa', 'thyroid-nodule', 'testicular-pain', 'follow-up', 'other', '')),
    clinical_question VARCHAR(1000) NOT NULL DEFAULT '',
    relevant_history VARCHAR(1000) NOT NULL DEFAULT '',

    -- Preparation requirements
    fasting_required BOOLEAN NOT NULL DEFAULT FALSE,
    full_bladder_required BOOLEAN NOT NULL DEFAULT FALSE,

    -- Requester / triage
    urgency VARCHAR(15) NOT NULL DEFAULT 'routine'
        CHECK (urgency IN ('routine', 'urgent', 'emergency', '')),
    supervising_consultant VARCHAR(255) NOT NULL DEFAULT '',
    requester_contact VARCHAR(255) NOT NULL DEFAULT '',
    notes VARCHAR(1000) NOT NULL DEFAULT ''
);

CREATE INDEX index_ultrasound_test_request_patient_id
    ON ultrasound_test_request(patient_id);
CREATE INDEX index_ultrasound_test_request_clinician_id
    ON ultrasound_test_request(clinician_id);

CREATE TRIGGER trigger_ultrasound_test_request_updated_at
    BEFORE UPDATE ON ultrasound_test_request
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE ultrasound_test_request IS
    'General (non-obstetric) diagnostic ultrasound request (referral). Captures the requested examination (body region, laterality), the clinical indication and question, relevant history, preparation requirements, and triage urgency.';
COMMENT ON COLUMN ultrasound_test_request.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN ultrasound_test_request.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN ultrasound_test_request.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN ultrasound_test_request.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN ultrasound_test_request.patient_id IS
    'Foreign key to the patient.';
COMMENT ON COLUMN ultrasound_test_request.clinician_id IS
    'Foreign key to the requesting clinician (referrer).';
COMMENT ON COLUMN ultrasound_test_request.status IS
    'Request lifecycle status: draft, submitted, vetted, scheduled, rejected.';
COMMENT ON COLUMN ultrasound_test_request.site_name IS
    'Name of the requesting site or clinic.';
COMMENT ON COLUMN ultrasound_test_request.setting IS
    'Care setting: outpatient, inpatient, community, emergency.';
COMMENT ON COLUMN ultrasound_test_request.referral_date IS
    'Date the referral was made.';
COMMENT ON COLUMN ultrasound_test_request.requested_by_date IS
    'Date by which the scan is requested to be performed.';
COMMENT ON COLUMN ultrasound_test_request.body_region IS
    'Requested body region: abdomen, pelvis, renal-tract, liver-biliary, thyroid-neck, scrotum-testes, breast, soft-tissue, vascular-doppler, dvt-leg, carotid, msk-joint, other.';
COMMENT ON COLUMN ultrasound_test_request.laterality IS
    'Laterality of the requested examination: left, right, bilateral, not-applicable.';
COMMENT ON COLUMN ultrasound_test_request.primary_indication IS
    'Primary clinical indication, used for appropriateness scoring.';
COMMENT ON COLUMN ultrasound_test_request.clinical_question IS
    'Specific clinical question the scan should answer (highest-value field).';
COMMENT ON COLUMN ultrasound_test_request.relevant_history IS
    'Relevant medical, surgical, and clinical history.';
COMMENT ON COLUMN ultrasound_test_request.fasting_required IS
    'Whether fasting is required for the examination (e.g. upper-abdominal / biliary scans).';
COMMENT ON COLUMN ultrasound_test_request.full_bladder_required IS
    'Whether a full bladder is required for the examination (e.g. pelvic / lower-urinary-tract scans).';
COMMENT ON COLUMN ultrasound_test_request.urgency IS
    'Requested triage urgency: routine, urgent, emergency.';
COMMENT ON COLUMN ultrasound_test_request.supervising_consultant IS
    'Name of the supervising / responsible consultant.';
COMMENT ON COLUMN ultrasound_test_request.requester_contact IS
    'Contact details (bleep / phone) for the requester.';
COMMENT ON COLUMN ultrasound_test_request.notes IS
    'Free-text additional notes.';
