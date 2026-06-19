-- Cytology specimen test request (referral) — the source-of-truth record.

CREATE TABLE cytology_test_request (
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
    specimen_type VARCHAR(40) NOT NULL DEFAULT ''
        CHECK (specimen_type IN ('cervical-smear', 'urine-cytology', 'sputum-cytology', 'fluid-pleural-ascitic', 'fine-needle-aspiration-thyroid', 'fine-needle-aspiration-breast', 'csf-cytology', 'other', '')),
    specimen_site VARCHAR(255) NOT NULL DEFAULT '',
    primary_indication VARCHAR(40) NOT NULL DEFAULT ''
        CHECK (primary_indication IN ('cervical-screening', 'suspected-malignancy', 'haematuria', 'effusion-investigation', 'thyroid-nodule', 'breast-lump', 'follow-up', 'other', '')),
    clinical_question VARCHAR(1000) NOT NULL DEFAULT '',
    clinical_details VARCHAR(1000) NOT NULL DEFAULT '',

    -- Cervical-screening / cytology context
    hpv_test_requested BOOLEAN NOT NULL DEFAULT FALSE,
    previous_abnormal_cytology VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (previous_abnormal_cytology IN ('none', 'borderline', 'low-grade', 'high-grade', 'unknown', '')),
    last_menstrual_period_date DATE,

    -- Specimen collection / pre-analytical
    specimen_collected VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (specimen_collected IN ('yes', 'no', '')),
    collection_datetime TIMESTAMPTZ,

    -- Requester / triage
    urgency VARCHAR(15) NOT NULL DEFAULT 'routine'
        CHECK (urgency IN ('routine', 'urgent', 'two-week-wait', '')),
    supervising_consultant VARCHAR(255) NOT NULL DEFAULT '',
    requester_contact VARCHAR(255) NOT NULL DEFAULT '',
    notes VARCHAR(1000) NOT NULL DEFAULT ''
);

CREATE INDEX index_cytology_test_request_patient_id
    ON cytology_test_request(patient_id);
CREATE INDEX index_cytology_test_request_clinician_id
    ON cytology_test_request(clinician_id);

CREATE TRIGGER trigger_cytology_test_request_updated_at
    BEFORE UPDATE ON cytology_test_request
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE cytology_test_request IS
    'Cytology specimen test request (referral). Captures the requested specimen type and site, the clinical indication and question, cervical-screening / cytology context, specimen collection (pre-analytical) details, and triage urgency.';
COMMENT ON COLUMN cytology_test_request.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN cytology_test_request.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN cytology_test_request.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN cytology_test_request.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN cytology_test_request.patient_id IS
    'Foreign key to the patient.';
COMMENT ON COLUMN cytology_test_request.clinician_id IS
    'Foreign key to the requesting clinician (referrer).';
COMMENT ON COLUMN cytology_test_request.status IS
    'Request lifecycle status: draft, submitted, vetted, scheduled, rejected.';
COMMENT ON COLUMN cytology_test_request.site_name IS
    'Name of the requesting site or clinic.';
COMMENT ON COLUMN cytology_test_request.setting IS
    'Care setting: outpatient, inpatient, community, emergency.';
COMMENT ON COLUMN cytology_test_request.referral_date IS
    'Date the referral was made.';
COMMENT ON COLUMN cytology_test_request.requested_by_date IS
    'Date by which the cytology examination is requested to be performed.';
COMMENT ON COLUMN cytology_test_request.specimen_type IS
    'Requested cytology specimen type: cervical-smear, urine-cytology, sputum-cytology, fluid-pleural-ascitic, fine-needle-aspiration-thyroid, fine-needle-aspiration-breast, csf-cytology, other.';
COMMENT ON COLUMN cytology_test_request.specimen_site IS
    'Anatomical site or source of the specimen (free text).';
COMMENT ON COLUMN cytology_test_request.primary_indication IS
    'Primary clinical indication, used for appropriateness scoring: cervical-screening, suspected-malignancy, haematuria, effusion-investigation, thyroid-nodule, breast-lump, follow-up, other.';
COMMENT ON COLUMN cytology_test_request.clinical_question IS
    'Specific clinical question the cytology examination should answer (highest-value field).';
COMMENT ON COLUMN cytology_test_request.clinical_details IS
    'Relevant clinical details, history, and findings for the reporting cytologist.';
COMMENT ON COLUMN cytology_test_request.hpv_test_requested IS
    'Whether high-risk HPV testing is requested (cervical screening primary screen).';
COMMENT ON COLUMN cytology_test_request.previous_abnormal_cytology IS
    'Previous abnormal cytology grade: none, borderline, low-grade, high-grade, unknown.';
COMMENT ON COLUMN cytology_test_request.last_menstrual_period_date IS
    'First day of the last menstrual period (LMP), relevant to cervical-smear timing.';
COMMENT ON COLUMN cytology_test_request.specimen_collected IS
    'Whether the specimen has already been collected: yes, no.';
COMMENT ON COLUMN cytology_test_request.collection_datetime IS
    'Date and time the specimen was collected (pre-analytical timing).';
COMMENT ON COLUMN cytology_test_request.urgency IS
    'Requested triage urgency: routine, urgent, two-week-wait.';
COMMENT ON COLUMN cytology_test_request.supervising_consultant IS
    'Name of the supervising / responsible consultant.';
COMMENT ON COLUMN cytology_test_request.requester_contact IS
    'Contact details (bleep / phone) for the requester.';
COMMENT ON COLUMN cytology_test_request.notes IS
    'Free-text additional notes.';
