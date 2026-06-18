-- Nuclear medicine (radionuclide imaging) request (referral) — the source-of-truth record.

CREATE TABLE nuclear_medicine_test_request (
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
    scan_type VARCHAR(30) NOT NULL DEFAULT ''
        CHECK (scan_type IN ('bone-scan', 'myocardial-perfusion', 'vq-lung-scan', 'thyroid-uptake', 'renal-dmsa', 'renal-mag3', 'gallium-octreotide', 'white-cell-scan', 'sentinel-node', 'other', '')),
    primary_indication VARCHAR(40) NOT NULL DEFAULT ''
        CHECK (primary_indication IN ('suspected-bone-metastases', 'cardiac-ischaemia', 'pulmonary-embolism', 'thyroid-function', 'renal-function', 'infection-localisation', 'tumour-localisation', 'sentinel-node-mapping', 'other', '')),
    clinical_question VARCHAR(1000) NOT NULL DEFAULT '',
    relevant_history VARCHAR(1000) NOT NULL DEFAULT '',

    -- Safety / radiation governance
    pregnancy_status VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (pregnancy_status IN ('not-pregnant', 'pregnant', 'possible', 'unknown', 'not-applicable', '')),
    breastfeeding BOOLEAN NOT NULL DEFAULT FALSE,
    egfr NUMERIC(5,1)
        CHECK (egfr IS NULL OR egfr BETWEEN 0 AND 200),
    recent_other_nuclear_scan BOOLEAN NOT NULL DEFAULT FALSE,
    weight_kg NUMERIC(5,1)
        CHECK (weight_kg IS NULL OR weight_kg BETWEEN 0 AND 500),

    -- Requester / triage
    urgency VARCHAR(15) NOT NULL DEFAULT 'routine'
        CHECK (urgency IN ('routine', 'urgent', 'emergency', '')),
    ir_me_r_justification VARCHAR(1000) NOT NULL DEFAULT '',
    supervising_consultant VARCHAR(255) NOT NULL DEFAULT '',
    requester_contact VARCHAR(255) NOT NULL DEFAULT '',
    notes VARCHAR(1000) NOT NULL DEFAULT ''
);

CREATE INDEX index_nuclear_medicine_test_request_patient_id
    ON nuclear_medicine_test_request(patient_id);
CREATE INDEX index_nuclear_medicine_test_request_clinician_id
    ON nuclear_medicine_test_request(clinician_id);

CREATE TRIGGER trigger_nuclear_medicine_test_request_updated_at
    BEFORE UPDATE ON nuclear_medicine_test_request
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE nuclear_medicine_test_request IS
    'Nuclear medicine (radionuclide imaging) request (referral). Captures the requested scan type, the clinical indication and question, relevant history, radiation-safety governance (pregnancy, breastfeeding, renal function, recent radionuclide exposure), IR(ME)R justification, and triage urgency.';
COMMENT ON COLUMN nuclear_medicine_test_request.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN nuclear_medicine_test_request.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN nuclear_medicine_test_request.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN nuclear_medicine_test_request.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN nuclear_medicine_test_request.patient_id IS
    'Foreign key to the patient.';
COMMENT ON COLUMN nuclear_medicine_test_request.clinician_id IS
    'Foreign key to the requesting clinician (referrer).';
COMMENT ON COLUMN nuclear_medicine_test_request.status IS
    'Request lifecycle status: draft, submitted, vetted, scheduled, rejected.';
COMMENT ON COLUMN nuclear_medicine_test_request.site_name IS
    'Name of the requesting site or clinic.';
COMMENT ON COLUMN nuclear_medicine_test_request.setting IS
    'Care setting: outpatient, inpatient, community, emergency.';
COMMENT ON COLUMN nuclear_medicine_test_request.referral_date IS
    'Date the referral was made.';
COMMENT ON COLUMN nuclear_medicine_test_request.requested_by_date IS
    'Date by which the scan is requested to be performed.';
COMMENT ON COLUMN nuclear_medicine_test_request.scan_type IS
    'Requested radionuclide scan type: bone-scan, myocardial-perfusion, vq-lung-scan, thyroid-uptake, renal-dmsa, renal-mag3, gallium-octreotide, white-cell-scan, sentinel-node, other.';
COMMENT ON COLUMN nuclear_medicine_test_request.primary_indication IS
    'Primary clinical indication, used for appropriateness scoring.';
COMMENT ON COLUMN nuclear_medicine_test_request.clinical_question IS
    'Specific clinical question the scan should answer (highest-value field).';
COMMENT ON COLUMN nuclear_medicine_test_request.relevant_history IS
    'Relevant medical, surgical, and oncological history.';
COMMENT ON COLUMN nuclear_medicine_test_request.pregnancy_status IS
    'Pregnancy status for radiation justification: not-pregnant, pregnant, possible, unknown, not-applicable.';
COMMENT ON COLUMN nuclear_medicine_test_request.breastfeeding IS
    'Whether the patient is currently breastfeeding (affects radiopharmaceutical choice and interruption advice).';
COMMENT ON COLUMN nuclear_medicine_test_request.egfr IS
    'Estimated glomerular filtration rate (mL/min/1.73m2), relevant to renal radiopharmaceutical handling.';
COMMENT ON COLUMN nuclear_medicine_test_request.recent_other_nuclear_scan IS
    'Whether the patient had another recent radionuclide study (residual activity may interfere with imaging).';
COMMENT ON COLUMN nuclear_medicine_test_request.weight_kg IS
    'Patient weight in kg, used for administered-activity calculation.';
COMMENT ON COLUMN nuclear_medicine_test_request.urgency IS
    'Requested triage urgency: routine, urgent, emergency.';
COMMENT ON COLUMN nuclear_medicine_test_request.ir_me_r_justification IS
    'IR(ME)R justification statement for the exposure (referrer-supplied clinical rationale).';
COMMENT ON COLUMN nuclear_medicine_test_request.supervising_consultant IS
    'Name of the supervising / responsible consultant.';
COMMENT ON COLUMN nuclear_medicine_test_request.requester_contact IS
    'Contact details (bleep / phone) for the requester.';
COMMENT ON COLUMN nuclear_medicine_test_request.notes IS
    'Free-text additional notes.';
