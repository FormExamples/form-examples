-- PET-CT scan request (referral) — the source-of-truth record.

CREATE TABLE pet_scan_test_request (
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
        CHECK (scan_type IN ('fdg-pet-ct', 'psma-pet', 'dotatate-pet', 'amyloid-pet', 'cardiac-pet', 'other', '')),
    primary_indication VARCHAR(40) NOT NULL DEFAULT ''
        CHECK (primary_indication IN ('cancer-staging', 'cancer-restaging', 'treatment-response', 'suspected-recurrence', 'solitary-pulmonary-nodule', 'lymphoma', 'cardiac-viability', 'infection-inflammation', 'neurology-dementia', 'other', '')),
    clinical_question VARCHAR(1000) NOT NULL DEFAULT '',
    relevant_history VARCHAR(1000) NOT NULL DEFAULT '',
    primary_tumour_site VARCHAR(255) NOT NULL DEFAULT '',

    -- Patient preparation / safety
    diabetes BOOLEAN NOT NULL DEFAULT FALSE,
    blood_glucose_mmol_l NUMERIC(4,1)
        CHECK (blood_glucose_mmol_l IS NULL OR blood_glucose_mmol_l BETWEEN 0 AND 60),
    pregnancy_status VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (pregnancy_status IN ('not-pregnant', 'pregnant', 'possible', 'unknown', 'not-applicable', '')),
    breastfeeding BOOLEAN NOT NULL DEFAULT FALSE,
    egfr NUMERIC(5,1)
        CHECK (egfr IS NULL OR egfr BETWEEN 0 AND 200),
    recent_chemo_radiotherapy VARCHAR(1000) NOT NULL DEFAULT '',
    claustrophobia BOOLEAN NOT NULL DEFAULT FALSE,
    weight_kg NUMERIC(5,1)
        CHECK (weight_kg IS NULL OR weight_kg BETWEEN 0 AND 500),

    -- Requester / triage / justification
    urgency VARCHAR(15) NOT NULL DEFAULT 'routine'
        CHECK (urgency IN ('routine', 'urgent', 'emergency', '')),
    ir_me_r_justification VARCHAR(1000) NOT NULL DEFAULT '',
    supervising_consultant VARCHAR(255) NOT NULL DEFAULT '',
    requester_contact VARCHAR(255) NOT NULL DEFAULT '',
    notes VARCHAR(1000) NOT NULL DEFAULT ''
);

CREATE INDEX index_pet_scan_test_request_patient_id
    ON pet_scan_test_request(patient_id);
CREATE INDEX index_pet_scan_test_request_clinician_id
    ON pet_scan_test_request(clinician_id);

CREATE TRIGGER trigger_pet_scan_test_request_updated_at
    BEFORE UPDATE ON pet_scan_test_request
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE pet_scan_test_request IS
    'PET-CT scan request (referral). Captures the requested tracer / scan type, the clinical indication and question, primary tumour site, FDG-PET patient-preparation and safety data (glucose control, pregnancy, breastfeeding, renal function), IR(ME)R justification, and triage urgency.';
COMMENT ON COLUMN pet_scan_test_request.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN pet_scan_test_request.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN pet_scan_test_request.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN pet_scan_test_request.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN pet_scan_test_request.patient_id IS
    'Foreign key to the patient.';
COMMENT ON COLUMN pet_scan_test_request.clinician_id IS
    'Foreign key to the requesting clinician (referrer).';
COMMENT ON COLUMN pet_scan_test_request.status IS
    'Request lifecycle status: draft, submitted, vetted, scheduled, rejected.';
COMMENT ON COLUMN pet_scan_test_request.site_name IS
    'Name of the requesting site or clinic.';
COMMENT ON COLUMN pet_scan_test_request.setting IS
    'Care setting: outpatient, inpatient, community, emergency.';
COMMENT ON COLUMN pet_scan_test_request.referral_date IS
    'Date the referral was made.';
COMMENT ON COLUMN pet_scan_test_request.requested_by_date IS
    'Date by which the scan is requested to be performed.';
COMMENT ON COLUMN pet_scan_test_request.scan_type IS
    'Requested PET tracer / scan type: fdg-pet-ct, psma-pet, dotatate-pet, amyloid-pet, cardiac-pet, other.';
COMMENT ON COLUMN pet_scan_test_request.primary_indication IS
    'Primary clinical indication, used for appropriateness scoring.';
COMMENT ON COLUMN pet_scan_test_request.clinical_question IS
    'Specific clinical question the scan should answer (highest-value field).';
COMMENT ON COLUMN pet_scan_test_request.relevant_history IS
    'Relevant medical, oncological, and treatment history.';
COMMENT ON COLUMN pet_scan_test_request.primary_tumour_site IS
    'Primary tumour site or suspected primary, where applicable.';
COMMENT ON COLUMN pet_scan_test_request.diabetes IS
    'Whether the patient has diabetes (affects FDG glucose control / preparation).';
COMMENT ON COLUMN pet_scan_test_request.blood_glucose_mmol_l IS
    'Most-recent blood glucose in mmol/L; FDG uptake needs glucose control, typically below 11 mmol/L.';
COMMENT ON COLUMN pet_scan_test_request.pregnancy_status IS
    'Pregnancy status: not-pregnant, pregnant, possible, unknown, not-applicable.';
COMMENT ON COLUMN pet_scan_test_request.breastfeeding IS
    'Whether the patient is currently breastfeeding (radiopharmaceutical precaution).';
COMMENT ON COLUMN pet_scan_test_request.egfr IS
    'Estimated glomerular filtration rate (mL/min/1.73m2), for any iodinated CT contrast.';
COMMENT ON COLUMN pet_scan_test_request.recent_chemo_radiotherapy IS
    'Recent chemotherapy / radiotherapy details and dates (affect timing and uptake).';
COMMENT ON COLUMN pet_scan_test_request.claustrophobia IS
    'Whether the patient has claustrophobia (may need support or sedation).';
COMMENT ON COLUMN pet_scan_test_request.weight_kg IS
    'Patient weight in kg, used for tracer dosing and table limits.';
COMMENT ON COLUMN pet_scan_test_request.urgency IS
    'Requested triage urgency: routine, urgent, emergency.';
COMMENT ON COLUMN pet_scan_test_request.ir_me_r_justification IS
    'IR(ME)R justification statement supporting the radiation exposure.';
COMMENT ON COLUMN pet_scan_test_request.supervising_consultant IS
    'Name of the supervising / responsible consultant.';
COMMENT ON COLUMN pet_scan_test_request.requester_contact IS
    'Contact details (bleep / phone) for the requester.';
COMMENT ON COLUMN pet_scan_test_request.notes IS
    'Free-text additional notes.';
