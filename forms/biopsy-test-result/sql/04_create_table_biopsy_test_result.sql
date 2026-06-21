-- Biopsy histopathology result (report) — the source-of-truth record.

CREATE TABLE biopsy_test_result (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    patient_id UUID NOT NULL REFERENCES patient(id) ON DELETE CASCADE,
    clinician_id UUID NOT NULL REFERENCES clinician(id) ON DELETE CASCADE,

    -- Report identification
    originating_request_reference VARCHAR(255) NOT NULL DEFAULT '',
    report_status VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (report_status IN ('preliminary', 'final', 'amended', 'supplementary', 'cancelled', '')),
    performed_date DATE,
    reported_date DATE,

    -- Specimen / procedure
    biopsy_site VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (biopsy_site IN ('skin', 'breast', 'lymph-node', 'liver', 'kidney', 'prostate', 'lung', 'bone-marrow', 'gi-tract', 'thyroid', 'soft-tissue', 'other', '')),
    biopsy_method VARCHAR(25) NOT NULL DEFAULT ''
        CHECK (biopsy_method IN ('punch', 'excision', 'incision', 'core-needle', 'fine-needle-aspiration', 'image-guided', 'endoscopic', 'other', '')),
    specimen_adequacy VARCHAR(12) NOT NULL DEFAULT ''
        CHECK (specimen_adequacy IN ('adequate', 'suboptimal', 'inadequate', '')),

    -- Clinical context
    clinical_history VARCHAR(1000) NOT NULL DEFAULT '',
    comparison_with_previous VARCHAR(1000) NOT NULL DEFAULT '',

    -- Macroscopic and microscopic description
    macroscopic_description VARCHAR(2000) NOT NULL DEFAULT '',
    microscopic_description VARCHAR(2000) NOT NULL DEFAULT '',

    -- Diagnosis and grading
    diagnosis VARCHAR(2000) NOT NULL DEFAULT '',
    malignancy_present BOOLEAN NOT NULL DEFAULT FALSE,
    tumour_type VARCHAR(255) NOT NULL DEFAULT '',
    histological_grade VARCHAR(30) NOT NULL DEFAULT ''
        CHECK (histological_grade IN ('well-differentiated', 'moderately-differentiated', 'poorly-differentiated', 'undifferentiated', 'not-applicable', '')),
    resection_margins VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (resection_margins IN ('clear', 'involved', 'close', 'not-applicable', '')),
    lymphovascular_invasion BOOLEAN NOT NULL DEFAULT FALSE,

    -- Ancillary tests
    immunohistochemistry VARCHAR(1000) NOT NULL DEFAULT '',
    molecular_results VARCHAR(1000) NOT NULL DEFAULT '',
    snomed_code VARCHAR(50) NOT NULL DEFAULT '',

    -- Conclusion and follow-up
    impression VARCHAR(2000) NOT NULL DEFAULT '',
    reporting_category VARCHAR(100) NOT NULL DEFAULT '',
    recommended_follow_up VARCHAR(1000) NOT NULL DEFAULT '',

    -- Critical-result communication
    critical_result_communicated BOOLEAN NOT NULL DEFAULT FALSE,
    reported_to VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX index_biopsy_test_result_patient_id
    ON biopsy_test_result(patient_id);
CREATE INDEX index_biopsy_test_result_clinician_id
    ON biopsy_test_result(clinician_id);

CREATE TRIGGER trigger_biopsy_test_result_updated_at
    BEFORE UPDATE ON biopsy_test_result
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE biopsy_test_result IS
    'Biopsy histopathology result (report). Captures the specimen and procedure, clinical history, the macroscopic and microscopic descriptions, the diagnosis with malignancy status, tumour type, histological grade, resection margins, lymphovascular invasion, immunohistochemistry and molecular results, the impression, recommended follow-up, and critical-result communication. This is the source-of-truth record that the four-axis interpretation grade is computed from.';
COMMENT ON COLUMN biopsy_test_result.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN biopsy_test_result.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN biopsy_test_result.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN biopsy_test_result.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN biopsy_test_result.patient_id IS
    'Foreign key to the patient.';
COMMENT ON COLUMN biopsy_test_result.clinician_id IS
    'Foreign key to the reporting clinician (consultant histopathologist / cytopathologist).';
COMMENT ON COLUMN biopsy_test_result.originating_request_reference IS
    'Free-text reference linking this report back to the originating biopsy test request (referral).';
COMMENT ON COLUMN biopsy_test_result.report_status IS
    'Report lifecycle status: preliminary, final, amended, supplementary, cancelled.';
COMMENT ON COLUMN biopsy_test_result.performed_date IS
    'Date the biopsy specimen was taken / received.';
COMMENT ON COLUMN biopsy_test_result.reported_date IS
    'Date the report was authored / signed.';
COMMENT ON COLUMN biopsy_test_result.biopsy_site IS
    'Anatomical biopsy site: skin, breast, lymph-node, liver, kidney, prostate, lung, bone-marrow, gi-tract, thyroid, soft-tissue, other.';
COMMENT ON COLUMN biopsy_test_result.biopsy_method IS
    'Biopsy method: punch, excision, incision, core-needle, fine-needle-aspiration, image-guided, endoscopic, other.';
COMMENT ON COLUMN biopsy_test_result.specimen_adequacy IS
    'Diagnostic adequacy of the specimen: adequate, suboptimal, inadequate.';
COMMENT ON COLUMN biopsy_test_result.clinical_history IS
    'Clinical history and the question the biopsy was performed to answer.';
COMMENT ON COLUMN biopsy_test_result.comparison_with_previous IS
    'Comparison with relevant previous histopathology or cytology.';
COMMENT ON COLUMN biopsy_test_result.macroscopic_description IS
    'Macroscopic (gross) description of the specimen as received.';
COMMENT ON COLUMN biopsy_test_result.microscopic_description IS
    'Microscopic (histological) description of the specimen.';
COMMENT ON COLUMN biopsy_test_result.diagnosis IS
    'Definitive histopathological diagnosis (the body of the report).';
COMMENT ON COLUMN biopsy_test_result.malignancy_present IS
    'Whether malignancy is present in the specimen.';
COMMENT ON COLUMN biopsy_test_result.tumour_type IS
    'Tumour type / morphology (e.g. invasive ductal carcinoma, squamous cell carcinoma).';
COMMENT ON COLUMN biopsy_test_result.histological_grade IS
    'Histological differentiation grade: well-differentiated, moderately-differentiated, poorly-differentiated, undifferentiated, not-applicable.';
COMMENT ON COLUMN biopsy_test_result.resection_margins IS
    'Resection margin status: clear, involved, close, not-applicable.';
COMMENT ON COLUMN biopsy_test_result.lymphovascular_invasion IS
    'Whether lymphovascular invasion is present.';
COMMENT ON COLUMN biopsy_test_result.immunohistochemistry IS
    'Immunohistochemistry panel results and interpretation.';
COMMENT ON COLUMN biopsy_test_result.molecular_results IS
    'Molecular / genetic test results relevant to diagnosis or therapy.';
COMMENT ON COLUMN biopsy_test_result.snomed_code IS
    'SNOMED CT morphology / topography code for the diagnosis.';
COMMENT ON COLUMN biopsy_test_result.impression IS
    'Summary impression / conclusion answering the clinical question.';
COMMENT ON COLUMN biopsy_test_result.reporting_category IS
    'Free-text grade / diagnosis summary label (e.g. an RCPath dataset or TNM8 category).';
COMMENT ON COLUMN biopsy_test_result.recommended_follow_up IS
    'Recommended follow-up, multidisciplinary-team (MDT) discussion, referral, or management.';
COMMENT ON COLUMN biopsy_test_result.critical_result_communicated IS
    'Whether a critical or unexpected significant result was communicated directly to the referrer.';
COMMENT ON COLUMN biopsy_test_result.reported_to IS
    'Who the critical / urgent result was communicated to, with date and time if applicable.';
