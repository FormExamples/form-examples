-- Histopathology test result (report) — the source-of-truth record.

CREATE TABLE histopathology_test_result (
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

    -- Specimen
    specimen_type VARCHAR(255) NOT NULL DEFAULT '',
    specimen_site VARCHAR(255) NOT NULL DEFAULT '',
    specimen_adequacy VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (specimen_adequacy IN ('adequate', 'suboptimal', 'inadequate', '')),

    -- Clinical context
    clinical_history VARCHAR(1000) NOT NULL DEFAULT '',

    -- Examination findings
    macroscopic_description VARCHAR(2000) NOT NULL DEFAULT '',
    microscopic_description VARCHAR(2000) NOT NULL DEFAULT '',
    diagnosis VARCHAR(2000) NOT NULL DEFAULT '',

    -- Malignancy and tumour characterisation
    malignancy_present BOOLEAN NOT NULL DEFAULT FALSE,
    tumour_type VARCHAR(255) NOT NULL DEFAULT '',
    histological_grade VARCHAR(30) NOT NULL DEFAULT ''
        CHECK (histological_grade IN ('well-differentiated', 'moderately-differentiated', 'poorly-differentiated', 'undifferentiated', 'not-applicable', '')),

    -- Pathological TNM staging (UICC/AJCC 8th edition)
    tnm_pt VARCHAR(20) NOT NULL DEFAULT '',
    tnm_pn VARCHAR(20) NOT NULL DEFAULT '',
    tnm_pm VARCHAR(20) NOT NULL DEFAULT '',

    -- Resection and invasion
    resection_margins VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (resection_margins IN ('clear', 'involved', 'close', 'not-applicable', '')),
    lymphovascular_invasion BOOLEAN NOT NULL DEFAULT FALSE,

    -- Ancillary tests and coding
    immunohistochemistry VARCHAR(1000) NOT NULL DEFAULT '',
    snomed_code VARCHAR(50) NOT NULL DEFAULT '',
    comparison_with_previous VARCHAR(1000) NOT NULL DEFAULT '',

    -- Conclusion
    impression VARCHAR(2000) NOT NULL DEFAULT '',
    reporting_category VARCHAR(255) NOT NULL DEFAULT '',
    recommended_follow_up VARCHAR(1000) NOT NULL DEFAULT '',

    -- Critical-result communication
    critical_result_communicated BOOLEAN NOT NULL DEFAULT FALSE,
    reported_to VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX index_histopathology_test_result_patient_id
    ON histopathology_test_result(patient_id);
CREATE INDEX index_histopathology_test_result_clinician_id
    ON histopathology_test_result(clinician_id);

CREATE TRIGGER trigger_histopathology_test_result_updated_at
    BEFORE UPDATE ON histopathology_test_result
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE histopathology_test_result IS
    'Histopathology test result (report). Captures the examined specimen and adequacy, clinical history, the macroscopic and microscopic descriptions, the diagnosis, malignancy and tumour characterisation (type, histological grade, pathological TNM stage), resection margins and lymphovascular invasion, ancillary immunohistochemistry and SNOMED coding, the impression, recommended follow-up, and critical-result communication. This is the source-of-truth record that the four-axis interpretation grade is computed from.';
COMMENT ON COLUMN histopathology_test_result.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN histopathology_test_result.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN histopathology_test_result.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN histopathology_test_result.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN histopathology_test_result.patient_id IS
    'Foreign key to the patient.';
COMMENT ON COLUMN histopathology_test_result.clinician_id IS
    'Foreign key to the reporting clinician (consultant histopathologist / biomedical scientist).';
COMMENT ON COLUMN histopathology_test_result.originating_request_reference IS
    'Free-text reference linking this report back to the originating histopathology test request (referral).';
COMMENT ON COLUMN histopathology_test_result.report_status IS
    'Report lifecycle status: preliminary, final, amended, supplementary, cancelled.';
COMMENT ON COLUMN histopathology_test_result.performed_date IS
    'Date the specimen was examined / grossed.';
COMMENT ON COLUMN histopathology_test_result.reported_date IS
    'Date the report was authored / signed.';
COMMENT ON COLUMN histopathology_test_result.specimen_type IS
    'Type of specimen examined (e.g. biopsy, excision, resection, endoscopic biopsy).';
COMMENT ON COLUMN histopathology_test_result.specimen_site IS
    'Anatomical site the specimen was taken from.';
COMMENT ON COLUMN histopathology_test_result.specimen_adequacy IS
    'Adequacy of the specimen for diagnosis: adequate, suboptimal, inadequate.';
COMMENT ON COLUMN histopathology_test_result.clinical_history IS
    'Clinical history and the question the examination was performed to answer.';
COMMENT ON COLUMN histopathology_test_result.macroscopic_description IS
    'Macroscopic (gross) description of the specimen: dimensions, appearance, blocks taken.';
COMMENT ON COLUMN histopathology_test_result.microscopic_description IS
    'Microscopic (histological) description of the tissue under the microscope.';
COMMENT ON COLUMN histopathology_test_result.diagnosis IS
    'Histopathological diagnosis (the body of the report conclusion).';
COMMENT ON COLUMN histopathology_test_result.malignancy_present IS
    'Whether malignancy is present in the examined specimen.';
COMMENT ON COLUMN histopathology_test_result.tumour_type IS
    'Tumour type / histological subtype where a neoplasm is present.';
COMMENT ON COLUMN histopathology_test_result.histological_grade IS
    'Histological differentiation grade: well-differentiated, moderately-differentiated, poorly-differentiated, undifferentiated, not-applicable.';
COMMENT ON COLUMN histopathology_test_result.tnm_pt IS
    'Pathological primary tumour (pT) category per UICC/AJCC TNM 8th edition.';
COMMENT ON COLUMN histopathology_test_result.tnm_pn IS
    'Pathological regional lymph node (pN) category per UICC/AJCC TNM 8th edition.';
COMMENT ON COLUMN histopathology_test_result.tnm_pm IS
    'Pathological distant metastasis (pM) category per UICC/AJCC TNM 8th edition.';
COMMENT ON COLUMN histopathology_test_result.resection_margins IS
    'Resection margin status: clear, involved, close, not-applicable.';
COMMENT ON COLUMN histopathology_test_result.lymphovascular_invasion IS
    'Whether lymphovascular invasion is identified.';
COMMENT ON COLUMN histopathology_test_result.immunohistochemistry IS
    'Immunohistochemistry and other ancillary test results.';
COMMENT ON COLUMN histopathology_test_result.snomed_code IS
    'SNOMED CT topography / morphology code(s) for the diagnosis.';
COMMENT ON COLUMN histopathology_test_result.comparison_with_previous IS
    'Comparison with relevant previous histology.';
COMMENT ON COLUMN histopathology_test_result.impression IS
    'Summary impression / conclusion answering the clinical question.';
COMMENT ON COLUMN histopathology_test_result.reporting_category IS
    'Free-text structured grade / stage summary (e.g. an RCPath cancer-dataset core-item or staging summary line).';
COMMENT ON COLUMN histopathology_test_result.recommended_follow_up IS
    'Recommended follow-up, referral, MDT discussion, or management.';
COMMENT ON COLUMN histopathology_test_result.critical_result_communicated IS
    'Whether a critical or unexpected significant result was communicated directly to the requester.';
COMMENT ON COLUMN histopathology_test_result.reported_to IS
    'Who the critical / urgent result was communicated to, with date and time if applicable.';
