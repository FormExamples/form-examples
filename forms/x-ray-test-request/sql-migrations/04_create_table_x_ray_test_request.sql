-- Plain-radiograph (X-ray) imaging request (referral) — the source-of-truth record.

CREATE TABLE x_ray_test_request (
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
    body_region VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (body_region IN ('chest', 'abdomen', 'spine-cervical', 'spine-thoracic', 'spine-lumbar', 'pelvis', 'hip', 'knee', 'ankle-foot', 'shoulder', 'wrist-hand', 'skull', 'dental', 'other', '')),
    laterality VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (laterality IN ('left', 'right', 'bilateral', 'not-applicable', '')),
    primary_indication VARCHAR(30) NOT NULL DEFAULT ''
        CHECK (primary_indication IN ('trauma-fracture', 'chest-infection', 'suspected-pneumothorax', 'foreign-body', 'joint-pain', 'arthritis', 'pre-operative', 'line-position-check', 'abdominal-obstruction', 'swallowed-object', 'follow-up', 'other', '')),
    clinical_question VARCHAR(1000) NOT NULL DEFAULT '',
    relevant_history VARCHAR(1000) NOT NULL DEFAULT '',

    -- Safety / radiation
    pregnancy_status VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (pregnancy_status IN ('not-pregnant', 'pregnant', 'possible', 'unknown', 'not-applicable', '')),
    recent_similar_xray BOOLEAN NOT NULL DEFAULT FALSE,
    mobility VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (mobility IN ('ambulant', 'wheelchair', 'trolley', '')),

    -- Requester / triage
    urgency VARCHAR(15) NOT NULL DEFAULT 'routine'
        CHECK (urgency IN ('routine', 'urgent', 'emergency', '')),
    ir_me_r_justification VARCHAR(1000) NOT NULL DEFAULT '',
    supervising_consultant VARCHAR(255) NOT NULL DEFAULT '',
    requester_contact VARCHAR(255) NOT NULL DEFAULT '',
    notes VARCHAR(1000) NOT NULL DEFAULT ''
);

CREATE INDEX index_x_ray_test_request_patient_id
    ON x_ray_test_request(patient_id);
CREATE INDEX index_x_ray_test_request_clinician_id
    ON x_ray_test_request(clinician_id);

CREATE TRIGGER trigger_x_ray_test_request_updated_at
    BEFORE UPDATE ON x_ray_test_request
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE x_ray_test_request IS
    'Plain-radiograph (X-ray) imaging request (referral). Captures the requested body region and laterality, the clinical indication and question, relevant history, radiation-safety details (pregnancy status, recent similar exposure), mobility, and triage urgency.';
COMMENT ON COLUMN x_ray_test_request.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN x_ray_test_request.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN x_ray_test_request.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN x_ray_test_request.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN x_ray_test_request.patient_id IS
    'Foreign key to the patient.';
COMMENT ON COLUMN x_ray_test_request.clinician_id IS
    'Foreign key to the requesting clinician (referrer).';
COMMENT ON COLUMN x_ray_test_request.status IS
    'Request lifecycle status: draft, submitted, vetted, scheduled, rejected.';
COMMENT ON COLUMN x_ray_test_request.site_name IS
    'Name of the requesting site or clinic.';
COMMENT ON COLUMN x_ray_test_request.setting IS
    'Care setting: outpatient, inpatient, community, emergency.';
COMMENT ON COLUMN x_ray_test_request.referral_date IS
    'Date the referral was made.';
COMMENT ON COLUMN x_ray_test_request.requested_by_date IS
    'Date by which the X-ray is requested to be performed.';
COMMENT ON COLUMN x_ray_test_request.body_region IS
    'Body region to be imaged, used for appropriateness scoring and dose banding.';
COMMENT ON COLUMN x_ray_test_request.laterality IS
    'Laterality of the requested region: left, right, bilateral, not-applicable.';
COMMENT ON COLUMN x_ray_test_request.primary_indication IS
    'Primary clinical indication, used for appropriateness scoring.';
COMMENT ON COLUMN x_ray_test_request.clinical_question IS
    'Specific clinical question the X-ray should answer (highest-value field).';
COMMENT ON COLUMN x_ray_test_request.relevant_history IS
    'Relevant medical, surgical, and trauma history.';
COMMENT ON COLUMN x_ray_test_request.pregnancy_status IS
    'Patient pregnancy status for radiation safety: not-pregnant, pregnant, possible, unknown, not-applicable.';
COMMENT ON COLUMN x_ray_test_request.recent_similar_xray IS
    'Whether a similar X-ray of the same region was recently performed (repeat-exposure check).';
COMMENT ON COLUMN x_ray_test_request.mobility IS
    'Patient mobility for the examination: ambulant, wheelchair, trolley.';
COMMENT ON COLUMN x_ray_test_request.urgency IS
    'Requested triage urgency: routine, urgent, emergency.';
COMMENT ON COLUMN x_ray_test_request.ir_me_r_justification IS
    'Referrer justification for the exposure under IR(ME)R 2017 (benefit weighed against radiation detriment).';
COMMENT ON COLUMN x_ray_test_request.supervising_consultant IS
    'Name of the supervising / responsible consultant.';
COMMENT ON COLUMN x_ray_test_request.requester_contact IS
    'Contact details (bleep / phone) for the requester.';
COMMENT ON COLUMN x_ray_test_request.notes IS
    'Free-text additional notes.';
