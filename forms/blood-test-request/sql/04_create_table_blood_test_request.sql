-- Pathology / phlebotomy blood-test order (request) — the source-of-truth record.
-- Unlike a single-procedure request, this orders one or more blood-test PANELS,
-- modelled as BOOLEAN columns. At least one panel should be selected; a request
-- with no panel selected fires the no-test-selected flag.

CREATE TABLE blood_test_request (
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

    -- Requested panels (booleans). At least one should be TRUE.
    full_blood_count BOOLEAN NOT NULL DEFAULT FALSE,
    urea_electrolytes BOOLEAN NOT NULL DEFAULT FALSE,
    liver_function BOOLEAN NOT NULL DEFAULT FALSE,
    thyroid_function BOOLEAN NOT NULL DEFAULT FALSE,
    hba1c BOOLEAN NOT NULL DEFAULT FALSE,
    lipid_profile BOOLEAN NOT NULL DEFAULT FALSE,
    c_reactive_protein BOOLEAN NOT NULL DEFAULT FALSE,
    coagulation_screen BOOLEAN NOT NULL DEFAULT FALSE,
    bone_profile BOOLEAN NOT NULL DEFAULT FALSE,
    ferritin_iron BOOLEAN NOT NULL DEFAULT FALSE,
    vitamin_b12_folate BOOLEAN NOT NULL DEFAULT FALSE,
    vitamin_d BOOLEAN NOT NULL DEFAULT FALSE,
    hba1c_monitoring BOOLEAN NOT NULL DEFAULT FALSE,
    glucose BOOLEAN NOT NULL DEFAULT FALSE,
    inr BOOLEAN NOT NULL DEFAULT FALSE,
    blood_culture BOOLEAN NOT NULL DEFAULT FALSE,
    group_and_save BOOLEAN NOT NULL DEFAULT FALSE,
    crossmatch BOOLEAN NOT NULL DEFAULT FALSE,
    troponin BOOLEAN NOT NULL DEFAULT FALSE,
    d_dimer BOOLEAN NOT NULL DEFAULT FALSE,
    amylase_lipase BOOLEAN NOT NULL DEFAULT FALSE,

    -- Clinical context
    primary_indication VARCHAR(40) NOT NULL DEFAULT ''
        CHECK (primary_indication IN ('routine-monitoring', 'anaemia', 'fatigue', 'infection', 'diabetes-monitoring', 'thyroid-symptoms', 'cardiovascular-risk', 'liver-disease', 'renal-monitoring', 'anticoagulation-monitoring', 'pre-operative', 'suspected-malignancy', 'other', '')),
    clinical_details VARCHAR(1000) NOT NULL DEFAULT '',
    relevant_medications VARCHAR(1000) NOT NULL DEFAULT '',

    -- Pre-analytical / specimen handling
    fasting_required BOOLEAN NOT NULL DEFAULT FALSE,
    fasting_status VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (fasting_status IN ('fasting', 'non-fasting', 'unknown', '')),
    specimen_collected VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (specimen_collected IN ('yes', 'no', '')),
    collection_datetime TIMESTAMPTZ,

    -- Patient safety / access
    known_blood_borne_virus BOOLEAN NOT NULL DEFAULT FALSE,
    difficult_venous_access BOOLEAN NOT NULL DEFAULT FALSE,

    -- Requester / triage
    urgency VARCHAR(15) NOT NULL DEFAULT 'routine'
        CHECK (urgency IN ('routine', 'urgent', 'stat', '')),
    supervising_consultant VARCHAR(255) NOT NULL DEFAULT '',
    requester_contact VARCHAR(255) NOT NULL DEFAULT '',
    notes VARCHAR(1000) NOT NULL DEFAULT ''
);

CREATE INDEX index_blood_test_request_patient_id
    ON blood_test_request(patient_id);
CREATE INDEX index_blood_test_request_clinician_id
    ON blood_test_request(clinician_id);

CREATE TRIGGER trigger_blood_test_request_updated_at
    BEFORE UPDATE ON blood_test_request
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE blood_test_request IS
    'Pathology / phlebotomy blood-test order (request). Captures the requested test panels (booleans), the clinical indication and details, pre-analytical / specimen handling, patient-safety factors, and triage urgency.';
COMMENT ON COLUMN blood_test_request.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN blood_test_request.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN blood_test_request.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN blood_test_request.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN blood_test_request.patient_id IS
    'Foreign key to the patient.';
COMMENT ON COLUMN blood_test_request.clinician_id IS
    'Foreign key to the requesting clinician (referrer).';
COMMENT ON COLUMN blood_test_request.status IS
    'Request lifecycle status: draft, submitted, vetted, collected, rejected.';
COMMENT ON COLUMN blood_test_request.site_name IS
    'Name of the requesting site or clinic.';
COMMENT ON COLUMN blood_test_request.setting IS
    'Care setting: outpatient, inpatient, community, emergency.';
COMMENT ON COLUMN blood_test_request.referral_date IS
    'Date the request was made.';
COMMENT ON COLUMN blood_test_request.full_blood_count IS
    'Whether a full blood count (FBC) is requested.';
COMMENT ON COLUMN blood_test_request.urea_electrolytes IS
    'Whether urea and electrolytes (U&E) are requested.';
COMMENT ON COLUMN blood_test_request.liver_function IS
    'Whether liver function tests (LFT) are requested.';
COMMENT ON COLUMN blood_test_request.thyroid_function IS
    'Whether thyroid function tests (TFT) are requested.';
COMMENT ON COLUMN blood_test_request.hba1c IS
    'Whether HbA1c (glycated haemoglobin, diagnostic) is requested.';
COMMENT ON COLUMN blood_test_request.lipid_profile IS
    'Whether a lipid profile is requested.';
COMMENT ON COLUMN blood_test_request.c_reactive_protein IS
    'Whether C-reactive protein (CRP) is requested.';
COMMENT ON COLUMN blood_test_request.coagulation_screen IS
    'Whether a coagulation screen (PT / APTT) is requested.';
COMMENT ON COLUMN blood_test_request.bone_profile IS
    'Whether a bone profile (calcium, phosphate, ALP, albumin) is requested.';
COMMENT ON COLUMN blood_test_request.ferritin_iron IS
    'Whether ferritin / iron studies are requested.';
COMMENT ON COLUMN blood_test_request.vitamin_b12_folate IS
    'Whether vitamin B12 and folate are requested.';
COMMENT ON COLUMN blood_test_request.vitamin_d IS
    'Whether vitamin D (25-OH) is requested.';
COMMENT ON COLUMN blood_test_request.hba1c_monitoring IS
    'Whether HbA1c for diabetes monitoring (repeat) is requested.';
COMMENT ON COLUMN blood_test_request.glucose IS
    'Whether a glucose (fasting or random) is requested.';
COMMENT ON COLUMN blood_test_request.inr IS
    'Whether an INR (anticoagulation monitoring) is requested.';
COMMENT ON COLUMN blood_test_request.blood_culture IS
    'Whether a blood culture is requested.';
COMMENT ON COLUMN blood_test_request.group_and_save IS
    'Whether a group and save (blood group and antibody screen) is requested.';
COMMENT ON COLUMN blood_test_request.crossmatch IS
    'Whether a crossmatch (for transfusion) is requested.';
COMMENT ON COLUMN blood_test_request.troponin IS
    'Whether a troponin (cardiac marker) is requested.';
COMMENT ON COLUMN blood_test_request.d_dimer IS
    'Whether a D-dimer is requested.';
COMMENT ON COLUMN blood_test_request.amylase_lipase IS
    'Whether amylase / lipase is requested.';
COMMENT ON COLUMN blood_test_request.primary_indication IS
    'Primary clinical indication, used for appropriateness scoring.';
COMMENT ON COLUMN blood_test_request.clinical_details IS
    'Clinical details / history supporting the request (highest-value completeness field).';
COMMENT ON COLUMN blood_test_request.relevant_medications IS
    'Relevant medications (e.g. anticoagulants, statins) affecting interpretation or safety.';
COMMENT ON COLUMN blood_test_request.fasting_required IS
    'Whether any requested test requires the patient to be fasting.';
COMMENT ON COLUMN blood_test_request.fasting_status IS
    'Patient fasting status at collection: fasting, non-fasting, unknown.';
COMMENT ON COLUMN blood_test_request.specimen_collected IS
    'Whether the specimen has been collected: yes, no.';
COMMENT ON COLUMN blood_test_request.collection_datetime IS
    'Timestamp when the specimen was collected.';
COMMENT ON COLUMN blood_test_request.known_blood_borne_virus IS
    'Whether the patient has a known blood-borne virus (handling precaution).';
COMMENT ON COLUMN blood_test_request.difficult_venous_access IS
    'Whether the patient has difficult venous access.';
COMMENT ON COLUMN blood_test_request.urgency IS
    'Requested triage urgency: routine, urgent, stat.';
COMMENT ON COLUMN blood_test_request.supervising_consultant IS
    'Name of the supervising / responsible consultant.';
COMMENT ON COLUMN blood_test_request.requester_contact IS
    'Contact details (bleep / phone) for the requester.';
COMMENT ON COLUMN blood_test_request.notes IS
    'Free-text additional notes.';
