-- DEXA bone density scan request (referral) — the source-of-truth record.

CREATE TABLE dexa_bone_density_test_request (
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
    scan_region VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (scan_region IN ('hip', 'spine', 'hip-and-spine', 'forearm', 'whole-body', 'other', '')),
    primary_indication VARCHAR(30) NOT NULL DEFAULT ''
        CHECK (primary_indication IN ('osteoporosis-screening', 'fragility-fracture', 'long-term-steroids', 'early-menopause', 'high-frax-risk', 'monitoring-treatment', 'secondary-osteoporosis', 'other', '')),
    clinical_question VARCHAR(1000) NOT NULL DEFAULT '',
    relevant_history VARCHAR(1000) NOT NULL DEFAULT '',

    -- Fracture-risk factors (FRAX inputs and red flags)
    frax_major_fracture_percent NUMERIC(4,1)
        CHECK (frax_major_fracture_percent IS NULL OR frax_major_fracture_percent BETWEEN 0 AND 100),
    previous_fragility_fracture BOOLEAN NOT NULL DEFAULT FALSE,
    long_term_steroids BOOLEAN NOT NULL DEFAULT FALSE,
    menopause_status VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (menopause_status IN ('pre', 'peri', 'post', 'not-applicable', '')),
    parental_hip_fracture BOOLEAN NOT NULL DEFAULT FALSE,
    weight_kg NUMERIC(5,1)
        CHECK (weight_kg IS NULL OR weight_kg BETWEEN 0 AND 500),

    -- Previous DEXA
    previous_dexa VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (previous_dexa IN ('none', 'normal', 'osteopenia', 'osteoporosis', 'unknown', '')),
    previous_dexa_date DATE,

    -- Requester / triage
    urgency VARCHAR(15) NOT NULL DEFAULT 'routine'
        CHECK (urgency IN ('routine', 'urgent', '')),
    supervising_consultant VARCHAR(255) NOT NULL DEFAULT '',
    requester_contact VARCHAR(255) NOT NULL DEFAULT '',
    notes VARCHAR(1000) NOT NULL DEFAULT ''
);

CREATE INDEX index_dexa_bone_density_test_request_patient_id
    ON dexa_bone_density_test_request(patient_id);
CREATE INDEX index_dexa_bone_density_test_request_clinician_id
    ON dexa_bone_density_test_request(clinician_id);

CREATE TRIGGER trigger_dexa_bone_density_test_request_updated_at
    BEFORE UPDATE ON dexa_bone_density_test_request
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE dexa_bone_density_test_request IS
    'DEXA / DXA bone-densitometry (osteoporosis) scan request (referral). Captures the requested scan region, the clinical indication and question, fracture-risk factors (FRAX inputs), previous DEXA history, and triage urgency.';
COMMENT ON COLUMN dexa_bone_density_test_request.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN dexa_bone_density_test_request.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN dexa_bone_density_test_request.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN dexa_bone_density_test_request.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN dexa_bone_density_test_request.patient_id IS
    'Foreign key to the patient.';
COMMENT ON COLUMN dexa_bone_density_test_request.clinician_id IS
    'Foreign key to the requesting clinician (referrer).';
COMMENT ON COLUMN dexa_bone_density_test_request.status IS
    'Request lifecycle status: draft, submitted, vetted, scheduled, rejected.';
COMMENT ON COLUMN dexa_bone_density_test_request.site_name IS
    'Name of the requesting site or clinic.';
COMMENT ON COLUMN dexa_bone_density_test_request.setting IS
    'Care setting: outpatient, inpatient, community, emergency.';
COMMENT ON COLUMN dexa_bone_density_test_request.referral_date IS
    'Date the referral was made.';
COMMENT ON COLUMN dexa_bone_density_test_request.requested_by_date IS
    'Date by which the scan is requested to be performed.';
COMMENT ON COLUMN dexa_bone_density_test_request.scan_region IS
    'Requested DEXA scan region: hip, spine, hip-and-spine, forearm, whole-body, other.';
COMMENT ON COLUMN dexa_bone_density_test_request.primary_indication IS
    'Primary clinical indication, used for appropriateness scoring: osteoporosis-screening, fragility-fracture, long-term-steroids, early-menopause, high-frax-risk, monitoring-treatment, secondary-osteoporosis, other.';
COMMENT ON COLUMN dexa_bone_density_test_request.clinical_question IS
    'Specific clinical question the scan should answer (highest-value field).';
COMMENT ON COLUMN dexa_bone_density_test_request.relevant_history IS
    'Relevant medical, surgical, and fracture history.';
COMMENT ON COLUMN dexa_bone_density_test_request.frax_major_fracture_percent IS
    'FRAX 10-year major osteoporotic fracture probability as a percentage (0-100).';
COMMENT ON COLUMN dexa_bone_density_test_request.previous_fragility_fracture IS
    'Whether the patient has had a previous fragility fracture (low-trauma).';
COMMENT ON COLUMN dexa_bone_density_test_request.long_term_steroids IS
    'Whether the patient is on long-term oral glucocorticoid (steroid) therapy.';
COMMENT ON COLUMN dexa_bone_density_test_request.menopause_status IS
    'Menopause status: pre, peri, post, not-applicable.';
COMMENT ON COLUMN dexa_bone_density_test_request.parental_hip_fracture IS
    'Whether a parent had a hip fracture (FRAX risk factor).';
COMMENT ON COLUMN dexa_bone_density_test_request.weight_kg IS
    'Body weight in kilograms (FRAX input; low weight raises fracture risk).';
COMMENT ON COLUMN dexa_bone_density_test_request.previous_dexa IS
    'Result of any previous DEXA: none, normal, osteopenia, osteoporosis, unknown.';
COMMENT ON COLUMN dexa_bone_density_test_request.previous_dexa_date IS
    'Date of the most recent previous DEXA scan.';
COMMENT ON COLUMN dexa_bone_density_test_request.urgency IS
    'Requested triage urgency: routine, urgent.';
COMMENT ON COLUMN dexa_bone_density_test_request.supervising_consultant IS
    'Name of the supervising / responsible consultant.';
COMMENT ON COLUMN dexa_bone_density_test_request.requester_contact IS
    'Contact details (bleep / phone) for the requester.';
COMMENT ON COLUMN dexa_bone_density_test_request.notes IS
    'Free-text additional notes.';
