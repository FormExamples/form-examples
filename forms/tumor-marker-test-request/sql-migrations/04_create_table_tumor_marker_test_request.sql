-- Serum tumour-marker blood-test request (referral) — the source-of-truth record.
-- Unlike a single-procedure request, this orders one or more serum tumour MARKERS,
-- modelled as BOOLEAN columns. At least one marker should be selected; a request
-- with no marker selected fires the no-marker-selected flag. Tumour markers are
-- poor screening tests (low specificity); the engine discourages non-evidence-based
-- screening use and checks marker-to-indication appropriateness.

CREATE TABLE tumor_marker_test_request (
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

    -- Requested serum tumour markers (booleans). At least one should be TRUE.
    psa BOOLEAN NOT NULL DEFAULT FALSE,
    ca125 BOOLEAN NOT NULL DEFAULT FALSE,
    ca19_9 BOOLEAN NOT NULL DEFAULT FALSE,
    carcinoembryonic_antigen_cea BOOLEAN NOT NULL DEFAULT FALSE,
    alpha_fetoprotein_afp BOOLEAN NOT NULL DEFAULT FALSE,
    beta_hcg BOOLEAN NOT NULL DEFAULT FALSE,
    ca15_3 BOOLEAN NOT NULL DEFAULT FALSE,
    lactate_dehydrogenase_ldh BOOLEAN NOT NULL DEFAULT FALSE,
    calcitonin BOOLEAN NOT NULL DEFAULT FALSE,
    chromogranin_a BOOLEAN NOT NULL DEFAULT FALSE,

    -- Clinical context
    primary_indication VARCHAR(40) NOT NULL DEFAULT ''
        CHECK (primary_indication IN ('suspected-malignancy', 'cancer-monitoring', 'treatment-response', 'recurrence-surveillance', 'screening-high-risk', 'characterise-mass', 'other', '')),
    clinical_details VARCHAR(1000) NOT NULL DEFAULT '',
    known_cancer_site VARCHAR(255) NOT NULL DEFAULT '',
    on_treatment BOOLEAN NOT NULL DEFAULT FALSE,
    previous_marker_value NUMERIC(12,2),
    previous_marker_date DATE,

    -- Requester / triage
    urgency VARCHAR(15) NOT NULL DEFAULT 'routine'
        CHECK (urgency IN ('routine', 'urgent', 'two-week-wait', '')),
    supervising_consultant VARCHAR(255) NOT NULL DEFAULT '',
    requester_contact VARCHAR(255) NOT NULL DEFAULT '',
    notes VARCHAR(1000) NOT NULL DEFAULT ''
);

CREATE INDEX index_tumor_marker_test_request_patient_id
    ON tumor_marker_test_request(patient_id);
CREATE INDEX index_tumor_marker_test_request_clinician_id
    ON tumor_marker_test_request(clinician_id);

CREATE INDEX tumor_marker_test_request_index_gto
    ON tumor_marker_test_request
    USING GIN ((
        site_name
    ) gin_trgm_ops);

CREATE TRIGGER trigger_tumor_marker_test_request_updated_at
    BEFORE UPDATE ON tumor_marker_test_request
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE tumor_marker_test_request IS
    'Serum tumour-marker blood-test request (referral). Captures the requested tumour markers (booleans), the clinical indication and details, any known cancer site / prior marker value, and triage urgency.';
COMMENT ON COLUMN tumor_marker_test_request.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN tumor_marker_test_request.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN tumor_marker_test_request.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN tumor_marker_test_request.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN tumor_marker_test_request.patient_id IS
    'Foreign key to the patient.';
COMMENT ON COLUMN tumor_marker_test_request.clinician_id IS
    'Foreign key to the requesting clinician (referrer).';
COMMENT ON COLUMN tumor_marker_test_request.status IS
    'Request lifecycle status: draft, submitted, vetted, collected, rejected.';
COMMENT ON COLUMN tumor_marker_test_request.site_name IS
    'Name of the requesting site or clinic.';
COMMENT ON COLUMN tumor_marker_test_request.setting IS
    'Care setting: outpatient, inpatient, community, emergency.';
COMMENT ON COLUMN tumor_marker_test_request.referral_date IS
    'Date the request was made.';
COMMENT ON COLUMN tumor_marker_test_request.requested_by_date IS
    'Date by which the test is requested to be performed.';
COMMENT ON COLUMN tumor_marker_test_request.psa IS
    'Whether prostate-specific antigen (PSA) is requested.';
COMMENT ON COLUMN tumor_marker_test_request.ca125 IS
    'Whether CA125 (suspected ovarian cancer; NICE CG122 / NG12) is requested.';
COMMENT ON COLUMN tumor_marker_test_request.ca19_9 IS
    'Whether CA19-9 (pancreatic / hepatobiliary cancer) is requested.';
COMMENT ON COLUMN tumor_marker_test_request.carcinoembryonic_antigen_cea IS
    'Whether carcinoembryonic antigen (CEA; colorectal cancer monitoring) is requested.';
COMMENT ON COLUMN tumor_marker_test_request.alpha_fetoprotein_afp IS
    'Whether alpha-fetoprotein (AFP; hepatocellular carcinoma, germ-cell tumours) is requested.';
COMMENT ON COLUMN tumor_marker_test_request.beta_hcg IS
    'Whether beta human chorionic gonadotrophin (beta-hCG; germ-cell / trophoblastic tumours) is requested.';
COMMENT ON COLUMN tumor_marker_test_request.ca15_3 IS
    'Whether CA15-3 (breast cancer monitoring) is requested.';
COMMENT ON COLUMN tumor_marker_test_request.lactate_dehydrogenase_ldh IS
    'Whether lactate dehydrogenase (LDH; germ-cell tumours, lymphoma prognosis) is requested.';
COMMENT ON COLUMN tumor_marker_test_request.calcitonin IS
    'Whether calcitonin (medullary thyroid carcinoma) is requested.';
COMMENT ON COLUMN tumor_marker_test_request.chromogranin_a IS
    'Whether chromogranin A (neuroendocrine tumours) is requested.';
COMMENT ON COLUMN tumor_marker_test_request.primary_indication IS
    'Primary clinical indication, used for appropriateness scoring.';
COMMENT ON COLUMN tumor_marker_test_request.clinical_details IS
    'Clinical details / history supporting the request (highest-value completeness field).';
COMMENT ON COLUMN tumor_marker_test_request.known_cancer_site IS
    'Known or suspected primary cancer site, if any.';
COMMENT ON COLUMN tumor_marker_test_request.on_treatment IS
    'Whether the patient is currently on cancer treatment (affects marker interpretation).';
COMMENT ON COLUMN tumor_marker_test_request.previous_marker_value IS
    'Most recent previous marker value, for trend / response interpretation.';
COMMENT ON COLUMN tumor_marker_test_request.previous_marker_date IS
    'Date of the most recent previous marker value.';
COMMENT ON COLUMN tumor_marker_test_request.urgency IS
    'Requested triage urgency: routine, urgent, two-week-wait.';
COMMENT ON COLUMN tumor_marker_test_request.supervising_consultant IS
    'Name of the supervising / responsible consultant.';
COMMENT ON COLUMN tumor_marker_test_request.requester_contact IS
    'Contact details (bleep / phone) for the requester.';
COMMENT ON COLUMN tumor_marker_test_request.notes IS
    'Free-text additional notes.';
