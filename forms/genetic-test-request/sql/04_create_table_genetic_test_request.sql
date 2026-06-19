-- Clinical genetics / genomic test request (referral) — the source-of-truth record.

CREATE TABLE genetic_test_request (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    patient_id UUID NOT NULL REFERENCES patient(id) ON DELETE CASCADE,
    clinician_id UUID NOT NULL REFERENCES clinician(id) ON DELETE CASCADE,

    status VARCHAR(20) NOT NULL DEFAULT 'draft'
        CHECK (status IN ('draft', 'submitted', 'vetted', 'accepted', 'rejected', '')),
    site_name VARCHAR(255) NOT NULL DEFAULT '',
    setting VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (setting IN ('outpatient', 'inpatient', 'community', 'emergency', '')),
    referral_date DATE,
    requested_by_date DATE,

    -- Requested test
    test_type VARCHAR(40) NOT NULL DEFAULT ''
        CHECK (test_type IN ('diagnostic-single-gene', 'gene-panel', 'whole-exome', 'whole-genome', 'chromosomal-microarray', 'karyotype', 'predictive-presymptomatic', 'carrier-testing', 'pharmacogenomic', 'prenatal', 'other', '')),
    primary_indication VARCHAR(40) NOT NULL DEFAULT ''
        CHECK (primary_indication IN ('suspected-genetic-disorder', 'familial-cancer', 'developmental-delay', 'congenital-anomaly', 'cardiomyopathy-arrhythmia', 'neuromuscular', 'predictive-family-history', 'carrier-screening', 'prenatal-diagnosis', 'pharmacogenomics', 'other', '')),
    clinical_question VARCHAR(1000) NOT NULL DEFAULT '',
    clinical_details VARCHAR(2000) NOT NULL DEFAULT '',
    family_history VARCHAR(2000) NOT NULL DEFAULT '',
    suspected_condition VARCHAR(255) NOT NULL DEFAULT '',

    -- Consent and counselling
    consent_obtained BOOLEAN NOT NULL DEFAULT FALSE,
    genetic_counselling_offered BOOLEAN NOT NULL DEFAULT FALSE,
    affected_relative_tested BOOLEAN NOT NULL DEFAULT FALSE,

    -- Specimen / logistics
    specimen_type VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (specimen_type IN ('blood', 'saliva', 'tissue', 'prenatal', '')),
    urgency VARCHAR(15) NOT NULL DEFAULT 'routine'
        CHECK (urgency IN ('routine', 'urgent', '')),
    supervising_consultant VARCHAR(255) NOT NULL DEFAULT '',
    requester_contact VARCHAR(255) NOT NULL DEFAULT '',
    notes VARCHAR(1000) NOT NULL DEFAULT ''
);

CREATE INDEX index_genetic_test_request_patient_id
    ON genetic_test_request(patient_id);
CREATE INDEX index_genetic_test_request_clinician_id
    ON genetic_test_request(clinician_id);

CREATE TRIGGER trigger_genetic_test_request_updated_at
    BEFORE UPDATE ON genetic_test_request
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE genetic_test_request IS
    'Clinical genetics / genomic test request (referral). Captures the requested test type, the clinical indication and question, clinical details, family history, consent and pre-test counselling status, specimen type, and triage urgency. Aligned with the NHS National Genomic Test Directory eligibility criteria.';
COMMENT ON COLUMN genetic_test_request.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN genetic_test_request.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN genetic_test_request.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN genetic_test_request.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN genetic_test_request.patient_id IS
    'Foreign key to the patient.';
COMMENT ON COLUMN genetic_test_request.clinician_id IS
    'Foreign key to the requesting clinician (referrer).';
COMMENT ON COLUMN genetic_test_request.status IS
    'Request lifecycle status: draft, submitted, vetted, accepted, rejected.';
COMMENT ON COLUMN genetic_test_request.site_name IS
    'Name of the requesting site or clinic.';
COMMENT ON COLUMN genetic_test_request.setting IS
    'Care setting: outpatient, inpatient, community, emergency.';
COMMENT ON COLUMN genetic_test_request.referral_date IS
    'Date the referral was made.';
COMMENT ON COLUMN genetic_test_request.requested_by_date IS
    'Date by which the test result is requested.';
COMMENT ON COLUMN genetic_test_request.test_type IS
    'Requested genomic test type: diagnostic-single-gene, gene-panel, whole-exome, whole-genome, chromosomal-microarray, karyotype, predictive-presymptomatic, carrier-testing, pharmacogenomic, prenatal, other.';
COMMENT ON COLUMN genetic_test_request.primary_indication IS
    'Primary clinical indication, mapped to a National Genomic Test Directory clinical indication for appropriateness scoring.';
COMMENT ON COLUMN genetic_test_request.clinical_question IS
    'Specific clinical question the test should answer (highest-value field).';
COMMENT ON COLUMN genetic_test_request.clinical_details IS
    'Relevant clinical details, phenotype (HPO terms), and examination findings.';
COMMENT ON COLUMN genetic_test_request.family_history IS
    'Relevant family history, pedigree summary, and inheritance pattern.';
COMMENT ON COLUMN genetic_test_request.suspected_condition IS
    'Suspected condition or gene of interest, if known.';
COMMENT ON COLUMN genetic_test_request.consent_obtained IS
    'Whether informed consent for genomic testing (Record of Discussion) has been obtained.';
COMMENT ON COLUMN genetic_test_request.genetic_counselling_offered IS
    'Whether pre-test genetic counselling has been offered or provided (mandatory for predictive / presymptomatic testing).';
COMMENT ON COLUMN genetic_test_request.affected_relative_tested IS
    'Whether an affected relative has already been tested and a familial variant is known.';
COMMENT ON COLUMN genetic_test_request.specimen_type IS
    'Specimen type: blood, saliva, tissue, prenatal.';
COMMENT ON COLUMN genetic_test_request.urgency IS
    'Requested triage urgency: routine, urgent.';
COMMENT ON COLUMN genetic_test_request.supervising_consultant IS
    'Name of the supervising / responsible consultant.';
COMMENT ON COLUMN genetic_test_request.requester_contact IS
    'Contact details (bleep / phone) for the requester.';
COMMENT ON COLUMN genetic_test_request.notes IS
    'Free-text additional notes.';
