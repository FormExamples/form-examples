-- Microbiology specimen culture / MC&S request (referral) — the
-- source-of-truth record. The requested tests are modelled as BOOLEAN columns;
-- at least one test should be selected, and culture-and-sensitivity is the most
-- common. The form is completed by a clinician, vetted by the laboratory.

CREATE TABLE microbiology_culture_test_request (
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

    -- Specimen
    specimen_type VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (specimen_type IN ('blood-culture', 'urine', 'wound-swab', 'sputum', 'throat-swab', 'stool', 'csf', 'tissue', 'catheter-tip', 'genital-swab', 'other', '')),
    specimen_site_detail VARCHAR(255) NOT NULL DEFAULT '',

    -- Requested tests (booleans)
    test_culture_and_sensitivity BOOLEAN NOT NULL DEFAULT FALSE,
    test_gram_stain BOOLEAN NOT NULL DEFAULT FALSE,
    test_acid_fast_bacilli_tb BOOLEAN NOT NULL DEFAULT FALSE,
    test_fungal_culture BOOLEAN NOT NULL DEFAULT FALSE,
    test_pcr_molecular BOOLEAN NOT NULL DEFAULT FALSE,
    test_c_difficile_toxin BOOLEAN NOT NULL DEFAULT FALSE,
    test_mrsa_screen BOOLEAN NOT NULL DEFAULT FALSE,

    -- Clinical context
    primary_indication VARCHAR(30) NOT NULL DEFAULT ''
        CHECK (primary_indication IN ('suspected-sepsis', 'urinary-tract-infection', 'wound-infection', 'respiratory-infection', 'gastroenteritis', 'meningitis', 'sti-screen', 'pyrexia-unknown-origin', 'infection-screening', 'other', '')),
    clinical_details VARCHAR(1000) NOT NULL DEFAULT '',
    fever BOOLEAN NOT NULL DEFAULT FALSE,
    current_antibiotics BOOLEAN NOT NULL DEFAULT FALSE,
    antibiotic_name VARCHAR(255) NOT NULL DEFAULT '',
    recent_travel BOOLEAN NOT NULL DEFAULT FALSE,
    immunocompromised BOOLEAN NOT NULL DEFAULT FALSE,

    -- Pre-analytical / specimen handling
    specimen_collected VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (specimen_collected IN ('yes', 'no', '')),
    collection_datetime TIMESTAMPTZ,

    -- Requester / triage
    urgency VARCHAR(10) NOT NULL DEFAULT 'routine'
        CHECK (urgency IN ('routine', 'urgent', 'stat', '')),
    supervising_consultant VARCHAR(255) NOT NULL DEFAULT '',
    requester_contact VARCHAR(255) NOT NULL DEFAULT '',
    notes VARCHAR(1000) NOT NULL DEFAULT ''
);

CREATE INDEX index_microbiology_culture_test_request_patient_id
    ON microbiology_culture_test_request(patient_id);
CREATE INDEX index_microbiology_culture_test_request_clinician_id
    ON microbiology_culture_test_request(clinician_id);

CREATE TRIGGER trigger_microbiology_culture_test_request_updated_at
    BEFORE UPDATE ON microbiology_culture_test_request
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE microbiology_culture_test_request IS
    'Microbiology specimen culture / MC&S request (referral). Captures the specimen, the requested tests (booleans), the clinical indication and details, pre-analytical / specimen handling, patient-safety factors, and triage urgency.';
COMMENT ON COLUMN microbiology_culture_test_request.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN microbiology_culture_test_request.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN microbiology_culture_test_request.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN microbiology_culture_test_request.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN microbiology_culture_test_request.patient_id IS
    'Foreign key to the patient.';
COMMENT ON COLUMN microbiology_culture_test_request.clinician_id IS
    'Foreign key to the requesting clinician (referrer).';
COMMENT ON COLUMN microbiology_culture_test_request.status IS
    'Request lifecycle status: draft, submitted, vetted, scheduled, rejected.';
COMMENT ON COLUMN microbiology_culture_test_request.site_name IS
    'Name of the requesting site or clinic.';
COMMENT ON COLUMN microbiology_culture_test_request.setting IS
    'Care setting: outpatient, inpatient, community, emergency.';
COMMENT ON COLUMN microbiology_culture_test_request.referral_date IS
    'Date the referral was made.';
COMMENT ON COLUMN microbiology_culture_test_request.requested_by_date IS
    'Date by which the test is requested to be processed.';
COMMENT ON COLUMN microbiology_culture_test_request.specimen_type IS
    'Specimen type: blood-culture, urine, wound-swab, sputum, throat-swab, stool, csf, tissue, catheter-tip, genital-swab, other.';
COMMENT ON COLUMN microbiology_culture_test_request.specimen_site_detail IS
    'Free-text detail of the anatomical specimen site (e.g. left leg ulcer, midstream urine).';
COMMENT ON COLUMN microbiology_culture_test_request.test_culture_and_sensitivity IS
    'Whether culture and antibiotic sensitivity (MC&S) is requested.';
COMMENT ON COLUMN microbiology_culture_test_request.test_gram_stain IS
    'Whether a Gram stain / direct microscopy is requested.';
COMMENT ON COLUMN microbiology_culture_test_request.test_acid_fast_bacilli_tb IS
    'Whether acid-fast bacilli (AFB) / TB culture is requested.';
COMMENT ON COLUMN microbiology_culture_test_request.test_fungal_culture IS
    'Whether fungal (mycology) culture is requested.';
COMMENT ON COLUMN microbiology_culture_test_request.test_pcr_molecular IS
    'Whether PCR / molecular detection is requested.';
COMMENT ON COLUMN microbiology_culture_test_request.test_c_difficile_toxin IS
    'Whether Clostridioides difficile toxin testing is requested.';
COMMENT ON COLUMN microbiology_culture_test_request.test_mrsa_screen IS
    'Whether MRSA colonisation screening is requested.';
COMMENT ON COLUMN microbiology_culture_test_request.primary_indication IS
    'Primary clinical indication, used for appropriateness scoring.';
COMMENT ON COLUMN microbiology_culture_test_request.clinical_details IS
    'Clinical details / relevant history supporting the request.';
COMMENT ON COLUMN microbiology_culture_test_request.fever IS
    'Whether the patient has fever / pyrexia.';
COMMENT ON COLUMN microbiology_culture_test_request.current_antibiotics IS
    'Whether the patient is currently on antibiotics (affects yield).';
COMMENT ON COLUMN microbiology_culture_test_request.antibiotic_name IS
    'Name(s) of current antibiotic(s), if any.';
COMMENT ON COLUMN microbiology_culture_test_request.recent_travel IS
    'Whether the patient has relevant recent travel history.';
COMMENT ON COLUMN microbiology_culture_test_request.immunocompromised IS
    'Whether the patient is immunocompromised.';
COMMENT ON COLUMN microbiology_culture_test_request.specimen_collected IS
    'Whether the specimen has already been collected: yes, no.';
COMMENT ON COLUMN microbiology_culture_test_request.collection_datetime IS
    'Date and time the specimen was collected (pre-analytical transport clock).';
COMMENT ON COLUMN microbiology_culture_test_request.urgency IS
    'Requested triage urgency: routine, urgent, stat.';
COMMENT ON COLUMN microbiology_culture_test_request.supervising_consultant IS
    'Name of the supervising / responsible consultant.';
COMMENT ON COLUMN microbiology_culture_test_request.requester_contact IS
    'Contact details (bleep / phone) for the requester.';
COMMENT ON COLUMN microbiology_culture_test_request.notes IS
    'Free-text additional notes.';
