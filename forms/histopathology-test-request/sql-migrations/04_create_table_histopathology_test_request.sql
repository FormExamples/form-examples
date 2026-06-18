-- Tissue histopathology specimen request (referral) — the source-of-truth record.

CREATE TABLE histopathology_test_request (
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
    specimen_type VARCHAR(30) NOT NULL DEFAULT ''
        CHECK (specimen_type IN ('biopsy', 'excision', 'resection', 'endoscopic-biopsy', 'skin-lesion', 'frozen-section', 'other', '')),
    specimen_site VARCHAR(255) NOT NULL DEFAULT '',
    number_of_specimens INTEGER
        CHECK (number_of_specimens IS NULL OR number_of_specimens BETWEEN 0 AND 100),
    fixative VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (fixative IN ('formalin', 'fresh', 'other', '')),

    -- Indication / clinical context
    primary_indication VARCHAR(40) NOT NULL DEFAULT ''
        CHECK (primary_indication IN ('suspected-malignancy', 'cancer-staging', 'inflammatory-disease', 'infection', 'characterise-lesion', 'margin-assessment', 'transplant-monitoring', 'other', '')),
    clinical_question VARCHAR(1000) NOT NULL DEFAULT '',
    clinical_details VARCHAR(1000) NOT NULL DEFAULT '',
    provisional_diagnosis VARCHAR(1000) NOT NULL DEFAULT '',
    previous_histology VARCHAR(1000) NOT NULL DEFAULT '',

    -- Urgency / red flags
    urgent_frozen_section BOOLEAN NOT NULL DEFAULT FALSE,
    two_week_wait BOOLEAN NOT NULL DEFAULT FALSE,
    urgency VARCHAR(15) NOT NULL DEFAULT 'routine'
        CHECK (urgency IN ('routine', 'urgent', 'two-week-wait', '')),

    -- Requester
    supervising_consultant VARCHAR(255) NOT NULL DEFAULT '',
    requester_contact VARCHAR(255) NOT NULL DEFAULT '',
    notes VARCHAR(1000) NOT NULL DEFAULT ''
);

CREATE INDEX index_histopathology_test_request_patient_id
    ON histopathology_test_request(patient_id);
CREATE INDEX index_histopathology_test_request_clinician_id
    ON histopathology_test_request(clinician_id);

CREATE TRIGGER trigger_histopathology_test_request_updated_at
    BEFORE UPDATE ON histopathology_test_request
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE histopathology_test_request IS
    'Tissue histopathology specimen request (referral). Captures the specimen, the clinical indication and question, clinical details, provisional diagnosis, previous histology, and triage urgency.';
COMMENT ON COLUMN histopathology_test_request.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN histopathology_test_request.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN histopathology_test_request.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN histopathology_test_request.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN histopathology_test_request.patient_id IS
    'Foreign key to the patient.';
COMMENT ON COLUMN histopathology_test_request.clinician_id IS
    'Foreign key to the requesting clinician (referrer).';
COMMENT ON COLUMN histopathology_test_request.status IS
    'Request lifecycle status: draft, submitted, vetted, scheduled, rejected.';
COMMENT ON COLUMN histopathology_test_request.site_name IS
    'Name of the requesting site or clinic.';
COMMENT ON COLUMN histopathology_test_request.setting IS
    'Care setting: outpatient, inpatient, community, emergency.';
COMMENT ON COLUMN histopathology_test_request.referral_date IS
    'Date the referral was made.';
COMMENT ON COLUMN histopathology_test_request.requested_by_date IS
    'Date by which the report is requested to be available.';
COMMENT ON COLUMN histopathology_test_request.specimen_type IS
    'Specimen type: biopsy, excision, resection, endoscopic-biopsy, skin-lesion, frozen-section, other.';
COMMENT ON COLUMN histopathology_test_request.specimen_site IS
    'Anatomical site the specimen was taken from.';
COMMENT ON COLUMN histopathology_test_request.number_of_specimens IS
    'Number of specimen containers / pots submitted (0-100).';
COMMENT ON COLUMN histopathology_test_request.fixative IS
    'Fixative used: formalin, fresh, other.';
COMMENT ON COLUMN histopathology_test_request.primary_indication IS
    'Primary clinical indication, used for appropriateness scoring.';
COMMENT ON COLUMN histopathology_test_request.clinical_question IS
    'Specific clinical question the report should answer (highest-value field).';
COMMENT ON COLUMN histopathology_test_request.clinical_details IS
    'Relevant clinical details, history, and context for the pathologist.';
COMMENT ON COLUMN histopathology_test_request.provisional_diagnosis IS
    'Provisional or working diagnosis.';
COMMENT ON COLUMN histopathology_test_request.previous_histology IS
    'Reference to relevant previous histology / cytology.';
COMMENT ON COLUMN histopathology_test_request.urgent_frozen_section IS
    'Whether an intra-operative urgent frozen section is requested (red flag, immediate).';
COMMENT ON COLUMN histopathology_test_request.two_week_wait IS
    'Whether this is a suspected-cancer two-week-wait (2WW) pathway request (red flag).';
COMMENT ON COLUMN histopathology_test_request.urgency IS
    'Requested triage urgency: routine, urgent, two-week-wait.';
COMMENT ON COLUMN histopathology_test_request.supervising_consultant IS
    'Name of the supervising / responsible consultant.';
COMMENT ON COLUMN histopathology_test_request.requester_contact IS
    'Contact details (bleep / phone) for the requester.';
COMMENT ON COLUMN histopathology_test_request.notes IS
    'Free-text additional notes.';
