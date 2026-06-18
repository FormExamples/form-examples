-- CT (computed tomography) scan request (referral) — the source-of-truth record.

CREATE TABLE ct_scan_test_request (
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
        CHECK (body_region IN ('head', 'neck', 'chest', 'abdomen', 'pelvis', 'abdomen-pelvis', 'spine', 'ct-angiogram', 'ct-colonography', 'whole-body', 'extremity', 'other', '')),
    primary_indication VARCHAR(30) NOT NULL DEFAULT ''
        CHECK (primary_indication IN ('trauma', 'suspected-stroke', 'suspected-malignancy', 'cancer-staging', 'pulmonary-embolism', 'abdominal-pain', 'renal-colic', 'infection-abscess', 'pre-surgical-planning', 'follow-up-surveillance', 'headache', 'other', '')),
    clinical_question VARCHAR(1000) NOT NULL DEFAULT '',
    relevant_history VARCHAR(1000) NOT NULL DEFAULT '',

    -- Contrast and radiation safety
    contrast_required VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (contrast_required IN ('none', 'iv-iodinated', 'oral', 'both', 'unknown', '')),
    pregnancy_status VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (pregnancy_status IN ('not-pregnant', 'pregnant', 'possible', 'unknown', 'not-applicable', '')),
    egfr NUMERIC(5,1)
        CHECK (egfr IS NULL OR egfr BETWEEN 0 AND 200),
    previous_contrast_reaction VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (previous_contrast_reaction IN ('none', 'mild', 'moderate', 'severe', 'unknown', '')),
    iodine_contrast_allergy BOOLEAN NOT NULL DEFAULT FALSE,
    metformin BOOLEAN NOT NULL DEFAULT FALSE,
    diabetes BOOLEAN NOT NULL DEFAULT FALSE,
    renal_impairment BOOLEAN NOT NULL DEFAULT FALSE,
    weight_kg NUMERIC(5,1)
        CHECK (weight_kg IS NULL OR weight_kg BETWEEN 0 AND 500),
    relevant_previous_imaging VARCHAR(1000) NOT NULL DEFAULT '',

    -- Requester / triage
    urgency VARCHAR(15) NOT NULL DEFAULT 'routine'
        CHECK (urgency IN ('routine', 'urgent', 'emergency', '')),
    supervising_consultant VARCHAR(255) NOT NULL DEFAULT '',
    ir_me_r_justification VARCHAR(1000) NOT NULL DEFAULT '',
    notes VARCHAR(1000) NOT NULL DEFAULT ''
);

CREATE INDEX index_ct_scan_test_request_patient_id
    ON ct_scan_test_request(patient_id);
CREATE INDEX index_ct_scan_test_request_clinician_id
    ON ct_scan_test_request(clinician_id);

CREATE TRIGGER trigger_ct_scan_test_request_updated_at
    BEFORE UPDATE ON ct_scan_test_request
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE ct_scan_test_request IS
    'CT (computed tomography) scan request (referral). Captures the requested body region, the clinical indication and question, relevant history, contrast and radiation-safety factors (eGFR, allergy, metformin, pregnancy), the IR(ME)R radiation justification, and triage urgency.';
COMMENT ON COLUMN ct_scan_test_request.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN ct_scan_test_request.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN ct_scan_test_request.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN ct_scan_test_request.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN ct_scan_test_request.patient_id IS
    'Foreign key to the patient.';
COMMENT ON COLUMN ct_scan_test_request.clinician_id IS
    'Foreign key to the requesting clinician (referrer).';
COMMENT ON COLUMN ct_scan_test_request.status IS
    'Request lifecycle status: draft, submitted, vetted, scheduled, rejected.';
COMMENT ON COLUMN ct_scan_test_request.site_name IS
    'Name of the requesting site or clinic.';
COMMENT ON COLUMN ct_scan_test_request.setting IS
    'Care setting: outpatient, inpatient, community, emergency.';
COMMENT ON COLUMN ct_scan_test_request.referral_date IS
    'Date the referral was made.';
COMMENT ON COLUMN ct_scan_test_request.requested_by_date IS
    'Date by which the scan is requested to be performed.';
COMMENT ON COLUMN ct_scan_test_request.body_region IS
    'Requested CT body region: head, neck, chest, abdomen, pelvis, abdomen-pelvis, spine, ct-angiogram, ct-colonography, whole-body, extremity, other.';
COMMENT ON COLUMN ct_scan_test_request.primary_indication IS
    'Primary clinical indication, used for ACR appropriateness scoring.';
COMMENT ON COLUMN ct_scan_test_request.clinical_question IS
    'Specific clinical question the scan should answer (highest-value field).';
COMMENT ON COLUMN ct_scan_test_request.relevant_history IS
    'Relevant medical, surgical, and oncological history.';
COMMENT ON COLUMN ct_scan_test_request.contrast_required IS
    'Contrast requirement: none, iv-iodinated, oral, both, unknown.';
COMMENT ON COLUMN ct_scan_test_request.pregnancy_status IS
    'Pregnancy status for radiation justification: not-pregnant, pregnant, possible, unknown, not-applicable.';
COMMENT ON COLUMN ct_scan_test_request.egfr IS
    'Estimated glomerular filtration rate (mL/min/1.73m2), for contrast nephropathy risk.';
COMMENT ON COLUMN ct_scan_test_request.previous_contrast_reaction IS
    'Severity of any previous iodinated contrast reaction: none, mild, moderate, severe, unknown.';
COMMENT ON COLUMN ct_scan_test_request.iodine_contrast_allergy IS
    'Whether the patient has a known iodinated contrast allergy.';
COMMENT ON COLUMN ct_scan_test_request.metformin IS
    'Whether the patient is taking metformin (contrast / renal interaction).';
COMMENT ON COLUMN ct_scan_test_request.diabetes IS
    'Whether the patient has diabetes.';
COMMENT ON COLUMN ct_scan_test_request.renal_impairment IS
    'Whether the patient has known renal impairment.';
COMMENT ON COLUMN ct_scan_test_request.weight_kg IS
    'Patient weight in kilograms, affecting dose and scanner table limits.';
COMMENT ON COLUMN ct_scan_test_request.relevant_previous_imaging IS
    'Details of relevant previous imaging being followed up or compared.';
COMMENT ON COLUMN ct_scan_test_request.urgency IS
    'Requested triage urgency: routine, urgent, emergency.';
COMMENT ON COLUMN ct_scan_test_request.supervising_consultant IS
    'Name of the supervising / responsible consultant.';
COMMENT ON COLUMN ct_scan_test_request.ir_me_r_justification IS
    'IR(ME)R radiation justification: why the benefit of the exposure outweighs the radiation detriment.';
COMMENT ON COLUMN ct_scan_test_request.notes IS
    'Free-text additional notes.';
