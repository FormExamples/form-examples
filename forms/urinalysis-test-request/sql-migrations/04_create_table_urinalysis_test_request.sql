-- Urinalysis (urine pathology) test request (order) — the source-of-truth record.
-- The form ORDERS multiple urine tests; each requested test is modelled as a
-- BOOLEAN column. At least one test should be selected; a request with no test
-- selected fires a safety flag.

CREATE TABLE urinalysis_test_request (
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

    -- Requested tests (urine test panel; each test is a boolean order line)
    dipstick BOOLEAN NOT NULL DEFAULT FALSE,
    microscopy_culture_sensitivity BOOLEAN NOT NULL DEFAULT FALSE,
    albumin_creatinine_ratio BOOLEAN NOT NULL DEFAULT FALSE,
    protein_creatinine_ratio BOOLEAN NOT NULL DEFAULT FALSE,
    pregnancy_test BOOLEAN NOT NULL DEFAULT FALSE,
    drug_screen BOOLEAN NOT NULL DEFAULT FALSE,
    cytology BOOLEAN NOT NULL DEFAULT FALSE,
    twenty_four_hour_collection BOOLEAN NOT NULL DEFAULT FALSE,

    -- Clinical context
    primary_indication VARCHAR(40) NOT NULL DEFAULT ''
        CHECK (primary_indication IN ('suspected-uti', 'haematuria', 'proteinuria', 'diabetes-monitoring', 'renal-monitoring', 'pregnancy-screen', 'pre-operative', 'catheter-related', 'suspected-malignancy', 'drug-monitoring', 'other', '')),
    clinical_details VARCHAR(1000) NOT NULL DEFAULT '',

    -- Symptoms / red flags
    symptom_dysuria BOOLEAN NOT NULL DEFAULT FALSE,
    symptom_frequency BOOLEAN NOT NULL DEFAULT FALSE,
    symptom_visible_haematuria BOOLEAN NOT NULL DEFAULT FALSE,
    symptom_loin_pain BOOLEAN NOT NULL DEFAULT FALSE,
    symptom_fever BOOLEAN NOT NULL DEFAULT FALSE,

    -- Specimen (preanalytical)
    specimen_type VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (specimen_type IN ('midstream', 'catheter', 'clean-catch', '24h', 'random', '')),
    specimen_collected VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (specimen_collected IN ('yes', 'no', '')),
    collection_datetime TIMESTAMPTZ,

    -- Modifiers
    pregnant BOOLEAN NOT NULL DEFAULT FALSE,
    catheterised BOOLEAN NOT NULL DEFAULT FALSE,
    current_antibiotics BOOLEAN NOT NULL DEFAULT FALSE,

    -- Requester / triage
    urgency VARCHAR(15) NOT NULL DEFAULT 'routine'
        CHECK (urgency IN ('routine', 'urgent', 'stat', '')),
    supervising_consultant VARCHAR(255) NOT NULL DEFAULT '',
    requester_contact VARCHAR(255) NOT NULL DEFAULT '',
    notes VARCHAR(1000) NOT NULL DEFAULT ''
);

CREATE INDEX index_urinalysis_test_request_patient_id
    ON urinalysis_test_request(patient_id);
CREATE INDEX index_urinalysis_test_request_clinician_id
    ON urinalysis_test_request(clinician_id);

CREATE TRIGGER trigger_urinalysis_test_request_updated_at
    BEFORE UPDATE ON urinalysis_test_request
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE urinalysis_test_request IS
    'Urinalysis (urine pathology) test request (order). Captures the requested urine test panel, the clinical indication and details, symptoms / red flags, specimen preanalytical data, modifiers, and triage urgency.';
COMMENT ON COLUMN urinalysis_test_request.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN urinalysis_test_request.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN urinalysis_test_request.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN urinalysis_test_request.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN urinalysis_test_request.patient_id IS
    'Foreign key to the patient.';
COMMENT ON COLUMN urinalysis_test_request.clinician_id IS
    'Foreign key to the requesting clinician (referrer).';
COMMENT ON COLUMN urinalysis_test_request.status IS
    'Request lifecycle status: draft, submitted, vetted, scheduled, rejected.';
COMMENT ON COLUMN urinalysis_test_request.site_name IS
    'Name of the requesting site or clinic.';
COMMENT ON COLUMN urinalysis_test_request.setting IS
    'Care setting: outpatient, inpatient, community, emergency.';
COMMENT ON COLUMN urinalysis_test_request.referral_date IS
    'Date the request was made.';
COMMENT ON COLUMN urinalysis_test_request.dipstick IS
    'Requested test: urine dipstick (reagent strip) for leucocytes, nitrites, blood, protein, glucose.';
COMMENT ON COLUMN urinalysis_test_request.microscopy_culture_sensitivity IS
    'Requested test: microscopy, culture and sensitivity (MC&S) for confirmed / complicated UTI.';
COMMENT ON COLUMN urinalysis_test_request.albumin_creatinine_ratio IS
    'Requested test: urine albumin-to-creatinine ratio (ACR) for albuminuria / CKD / diabetes monitoring.';
COMMENT ON COLUMN urinalysis_test_request.protein_creatinine_ratio IS
    'Requested test: urine protein-to-creatinine ratio (PCR) for proteinuria quantification.';
COMMENT ON COLUMN urinalysis_test_request.pregnancy_test IS
    'Requested test: urine pregnancy test (hCG).';
COMMENT ON COLUMN urinalysis_test_request.drug_screen IS
    'Requested test: urine drug screen / toxicology.';
COMMENT ON COLUMN urinalysis_test_request.cytology IS
    'Requested test: urine cytology for suspected urothelial malignancy.';
COMMENT ON COLUMN urinalysis_test_request.twenty_four_hour_collection IS
    'Requested test: 24-hour urine collection (e.g. protein, creatinine clearance, metanephrines).';
COMMENT ON COLUMN urinalysis_test_request.primary_indication IS
    'Primary clinical indication, used for appropriateness scoring: suspected-uti, haematuria, proteinuria, diabetes-monitoring, renal-monitoring, pregnancy-screen, pre-operative, catheter-related, suspected-malignancy, drug-monitoring, other.';
COMMENT ON COLUMN urinalysis_test_request.clinical_details IS
    'Relevant clinical details and history supporting the request (highest-value field).';
COMMENT ON COLUMN urinalysis_test_request.symptom_dysuria IS
    'Whether the patient reports dysuria (painful urination).';
COMMENT ON COLUMN urinalysis_test_request.symptom_frequency IS
    'Whether the patient reports urinary frequency / urgency.';
COMMENT ON COLUMN urinalysis_test_request.symptom_visible_haematuria IS
    'Whether the patient reports visible (macroscopic) haematuria (red flag).';
COMMENT ON COLUMN urinalysis_test_request.symptom_loin_pain IS
    'Whether the patient reports loin / flank pain (possible upper-tract involvement).';
COMMENT ON COLUMN urinalysis_test_request.symptom_fever IS
    'Whether the patient reports fever / systemic symptoms (possible pyelonephritis / urosepsis).';
COMMENT ON COLUMN urinalysis_test_request.specimen_type IS
    'Specimen type: midstream (MSU), catheter (CSU), clean-catch, 24h, random.';
COMMENT ON COLUMN urinalysis_test_request.specimen_collected IS
    'Whether the specimen has already been collected: yes, no.';
COMMENT ON COLUMN urinalysis_test_request.collection_datetime IS
    'Date and time the specimen was collected (preanalytical timing).';
COMMENT ON COLUMN urinalysis_test_request.pregnant IS
    'Whether the patient is pregnant (alters UTI MSU / culture pathway).';
COMMENT ON COLUMN urinalysis_test_request.catheterised IS
    'Whether the patient is catheterised (CSU; asymptomatic bacteriuria caveats).';
COMMENT ON COLUMN urinalysis_test_request.current_antibiotics IS
    'Whether the patient is currently taking antibiotics (may suppress culture growth).';
COMMENT ON COLUMN urinalysis_test_request.urgency IS
    'Requested triage urgency: routine, urgent, stat.';
COMMENT ON COLUMN urinalysis_test_request.supervising_consultant IS
    'Name of the supervising / responsible consultant.';
COMMENT ON COLUMN urinalysis_test_request.requester_contact IS
    'Contact details (bleep / phone) for the requester.';
COMMENT ON COLUMN urinalysis_test_request.notes IS
    'Free-text additional notes.';
