-- Coagulation / haemostasis blood-test order (request) — the source-of-truth record.
-- Unlike a single-procedure request, this orders one or more coagulation TESTS,
-- modelled as BOOLEAN columns. At least one test should be selected; a request
-- with no test selected fires the no-test-selected flag.

CREATE TABLE coagulation_test_request (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    patient_id UUID NOT NULL REFERENCES patient(id) ON DELETE CASCADE,
    clinician_id UUID NOT NULL REFERENCES clinician(id) ON DELETE CASCADE,

    status VARCHAR(20) NOT NULL DEFAULT 'draft'
        CHECK (status IN ('draft', 'submitted', 'vetted', 'collected', 'rejected', '')),
    site_name VARCHAR(255) NOT NULL DEFAULT '',
    setting VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (setting IN ('outpatient', 'inpatient', 'community', 'emergency', '')),
    referral_date DATE,
    requested_by_date DATE,

    -- Requested coagulation tests (booleans). At least one should be TRUE.
    prothrombin_time_inr BOOLEAN NOT NULL DEFAULT FALSE,
    activated_partial_thromboplastin_time BOOLEAN NOT NULL DEFAULT FALSE,
    fibrinogen BOOLEAN NOT NULL DEFAULT FALSE,
    d_dimer BOOLEAN NOT NULL DEFAULT FALSE,
    thrombophilia_screen BOOLEAN NOT NULL DEFAULT FALSE,
    factor_assays BOOLEAN NOT NULL DEFAULT FALSE,
    anti_xa_assay BOOLEAN NOT NULL DEFAULT FALSE,
    mixing_studies BOOLEAN NOT NULL DEFAULT FALSE,
    von_willebrand_screen BOOLEAN NOT NULL DEFAULT FALSE,

    -- Clinical context
    primary_indication VARCHAR(40) NOT NULL DEFAULT ''
        CHECK (primary_indication IN ('anticoagulation-monitoring', 'bleeding-disorder', 'suspected-dvt-pe', 'pre-operative', 'thrombophilia-investigation', 'liver-disease', 'disseminated-intravascular-coagulation', 'abnormal-bleeding', 'other', '')),
    clinical_details VARCHAR(1000) NOT NULL DEFAULT '',
    on_anticoagulant BOOLEAN NOT NULL DEFAULT FALSE,
    anticoagulant_agent VARCHAR(255) NOT NULL DEFAULT '',
    bleeding_history BOOLEAN NOT NULL DEFAULT FALSE,
    thrombosis_history BOOLEAN NOT NULL DEFAULT FALSE,

    -- Pre-analytical / specimen handling (citrate tube fill, ratio, timing)
    specimen_collected VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (specimen_collected IN ('yes', 'no', '')),
    collection_datetime TIMESTAMPTZ,

    -- Requester / triage
    urgency VARCHAR(15) NOT NULL DEFAULT 'routine'
        CHECK (urgency IN ('routine', 'urgent', 'stat', '')),
    supervising_consultant VARCHAR(255) NOT NULL DEFAULT '',
    requester_contact VARCHAR(255) NOT NULL DEFAULT '',
    notes VARCHAR(1000) NOT NULL DEFAULT ''
);

CREATE INDEX index_coagulation_test_request_patient_id
    ON coagulation_test_request(patient_id);
CREATE INDEX index_coagulation_test_request_clinician_id
    ON coagulation_test_request(clinician_id);

CREATE TRIGGER trigger_coagulation_test_request_updated_at
    BEFORE UPDATE ON coagulation_test_request
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE coagulation_test_request IS
    'Coagulation / haemostasis blood-test order (request). Captures the requested coagulation tests (booleans), the clinical indication and details, anticoagulant and bleeding / thrombosis history, pre-analytical / specimen handling (citrate tube fill, ratio, timing), and triage urgency.';
COMMENT ON COLUMN coagulation_test_request.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN coagulation_test_request.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN coagulation_test_request.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN coagulation_test_request.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN coagulation_test_request.patient_id IS
    'Foreign key to the patient.';
COMMENT ON COLUMN coagulation_test_request.clinician_id IS
    'Foreign key to the requesting clinician (referrer).';
COMMENT ON COLUMN coagulation_test_request.status IS
    'Request lifecycle status: draft, submitted, vetted, collected, rejected.';
COMMENT ON COLUMN coagulation_test_request.site_name IS
    'Name of the requesting site or clinic.';
COMMENT ON COLUMN coagulation_test_request.setting IS
    'Care setting: outpatient, inpatient, community, emergency.';
COMMENT ON COLUMN coagulation_test_request.referral_date IS
    'Date the referral was made.';
COMMENT ON COLUMN coagulation_test_request.requested_by_date IS
    'Date by which the tests are requested to be performed.';
COMMENT ON COLUMN coagulation_test_request.prothrombin_time_inr IS
    'Whether prothrombin time / INR is requested.';
COMMENT ON COLUMN coagulation_test_request.activated_partial_thromboplastin_time IS
    'Whether activated partial thromboplastin time (APTT) is requested.';
COMMENT ON COLUMN coagulation_test_request.fibrinogen IS
    'Whether a fibrinogen (Clauss) assay is requested.';
COMMENT ON COLUMN coagulation_test_request.d_dimer IS
    'Whether a D-dimer assay is requested.';
COMMENT ON COLUMN coagulation_test_request.thrombophilia_screen IS
    'Whether a thrombophilia screen is requested.';
COMMENT ON COLUMN coagulation_test_request.factor_assays IS
    'Whether specific coagulation factor assays are requested.';
COMMENT ON COLUMN coagulation_test_request.anti_xa_assay IS
    'Whether an anti-Xa assay (e.g. for LMWH / DOAC level) is requested.';
COMMENT ON COLUMN coagulation_test_request.mixing_studies IS
    'Whether mixing studies (to investigate a prolonged clotting time) are requested.';
COMMENT ON COLUMN coagulation_test_request.von_willebrand_screen IS
    'Whether a von Willebrand screen is requested.';
COMMENT ON COLUMN coagulation_test_request.primary_indication IS
    'Primary clinical indication, used for appropriateness scoring.';
COMMENT ON COLUMN coagulation_test_request.clinical_details IS
    'Free-text clinical details supporting the request (highest-value field).';
COMMENT ON COLUMN coagulation_test_request.on_anticoagulant IS
    'Whether the patient is currently on an anticoagulant.';
COMMENT ON COLUMN coagulation_test_request.anticoagulant_agent IS
    'Name of the anticoagulant agent, if any (e.g. warfarin, apixaban, LMWH).';
COMMENT ON COLUMN coagulation_test_request.bleeding_history IS
    'Whether the patient has a personal or family bleeding history.';
COMMENT ON COLUMN coagulation_test_request.thrombosis_history IS
    'Whether the patient has a personal or family thrombosis history.';
COMMENT ON COLUMN coagulation_test_request.specimen_collected IS
    'Whether the specimen has been collected: yes, no.';
COMMENT ON COLUMN coagulation_test_request.collection_datetime IS
    'Timestamp the specimen was collected (citrate-sample analysis timing matters).';
COMMENT ON COLUMN coagulation_test_request.urgency IS
    'Requested triage urgency: routine, urgent, stat.';
COMMENT ON COLUMN coagulation_test_request.supervising_consultant IS
    'Name of the supervising / responsible consultant.';
COMMENT ON COLUMN coagulation_test_request.requester_contact IS
    'Contact details (bleep / phone) for the requester.';
COMMENT ON COLUMN coagulation_test_request.notes IS
    'Free-text additional notes.';
