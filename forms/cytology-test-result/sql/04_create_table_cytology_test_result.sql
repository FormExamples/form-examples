-- Cytology test result (report) — the source-of-truth record.

CREATE TABLE cytology_test_result (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    patient_id UUID NOT NULL REFERENCES patient(id) ON DELETE CASCADE,
    clinician_id UUID NOT NULL REFERENCES clinician(id) ON DELETE CASCADE,

    -- Report identification
    originating_request_reference VARCHAR(255) NOT NULL DEFAULT '',
    report_status VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (report_status IN ('preliminary', 'final', 'amended', 'cancelled', '')),
    performed_date DATE,
    reported_date DATE,

    -- Specimen
    specimen_type VARCHAR(40) NOT NULL DEFAULT ''
        CHECK (specimen_type IN ('cervical-smear', 'urine-cytology', 'sputum-cytology', 'fluid-pleural-ascitic', 'fine-needle-aspiration-thyroid', 'fine-needle-aspiration-breast', 'csf-cytology', 'other', '')),
    specimen_adequacy VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (specimen_adequacy IN ('satisfactory', 'unsatisfactory', '')),

    -- Clinical context
    clinical_history VARCHAR(1000) NOT NULL DEFAULT '',
    comparison_with_previous VARCHAR(1000) NOT NULL DEFAULT '',

    -- Cytology findings and grading
    cytology_result_category VARCHAR(500) NOT NULL DEFAULT '',
    hpv_result VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (hpv_result IN ('positive', 'negative', 'not-tested', 'not-applicable', '')),
    malignancy_present BOOLEAN NOT NULL DEFAULT FALSE,
    dysplasia_present BOOLEAN NOT NULL DEFAULT FALSE,
    microscopic_description VARCHAR(2000) NOT NULL DEFAULT '',
    diagnosis VARCHAR(2000) NOT NULL DEFAULT '',

    -- Impression and follow-up
    impression VARCHAR(2000) NOT NULL DEFAULT '',
    reporting_category VARCHAR(100) NOT NULL DEFAULT '',
    recommended_follow_up VARCHAR(1000) NOT NULL DEFAULT '',

    -- Critical-result communication
    critical_result_communicated BOOLEAN NOT NULL DEFAULT FALSE,
    reported_to VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX index_cytology_test_result_patient_id
    ON cytology_test_result(patient_id);
CREATE INDEX index_cytology_test_result_clinician_id
    ON cytology_test_result(clinician_id);

CREATE TRIGGER trigger_cytology_test_result_updated_at
    BEFORE UPDATE ON cytology_test_result
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE cytology_test_result IS
    'Cytology test result (report). Captures the examined specimen and its adequacy, the clinical history, the cytology result category and HPV status, the microscopic description and diagnosis, the impression and structured-reporting category, recommended follow-up, and critical-result communication. This is the source-of-truth record that the four-axis interpretation grade is computed from.';
COMMENT ON COLUMN cytology_test_result.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN cytology_test_result.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN cytology_test_result.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN cytology_test_result.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN cytology_test_result.patient_id IS
    'Foreign key to the patient.';
COMMENT ON COLUMN cytology_test_result.clinician_id IS
    'Foreign key to the reporting clinician (consultant cytopathologist / biomedical scientist).';
COMMENT ON COLUMN cytology_test_result.originating_request_reference IS
    'Free-text reference linking this report back to the originating cytology test request (referral).';
COMMENT ON COLUMN cytology_test_result.report_status IS
    'Report lifecycle status: preliminary, final, amended, cancelled.';
COMMENT ON COLUMN cytology_test_result.performed_date IS
    'Date the cytology examination was performed / specimen received.';
COMMENT ON COLUMN cytology_test_result.reported_date IS
    'Date the report was authored / signed.';
COMMENT ON COLUMN cytology_test_result.specimen_type IS
    'Examined cytology specimen type: cervical-smear, urine-cytology, sputum-cytology, fluid-pleural-ascitic, fine-needle-aspiration-thyroid, fine-needle-aspiration-breast, csf-cytology, other.';
COMMENT ON COLUMN cytology_test_result.specimen_adequacy IS
    'Specimen adequacy for cytological interpretation: satisfactory, unsatisfactory.';
COMMENT ON COLUMN cytology_test_result.clinical_history IS
    'Clinical history and the question the examination was performed to answer.';
COMMENT ON COLUMN cytology_test_result.comparison_with_previous IS
    'Comparison with relevant previous cytology / histology results.';
COMMENT ON COLUMN cytology_test_result.cytology_result_category IS
    'Free-text cytology result category holding the relevant grading: e.g. cervical (negative / borderline / low-grade-dyskaryosis / high-grade-dyskaryosis / glandular), thyroid (Thy1-Thy5), breast (C1-C5), urine / serous-fluid system categories.';
COMMENT ON COLUMN cytology_test_result.hpv_result IS
    'HPV (human papillomavirus) test result where applicable: positive, negative, not-tested, not-applicable.';
COMMENT ON COLUMN cytology_test_result.malignancy_present IS
    'Whether malignant cells are present in the specimen.';
COMMENT ON COLUMN cytology_test_result.dysplasia_present IS
    'Whether dysplasia / dyskaryosis (pre-malignant atypia) is present in the specimen.';
COMMENT ON COLUMN cytology_test_result.microscopic_description IS
    'Microscopic description of the cellular findings (the body of the report).';
COMMENT ON COLUMN cytology_test_result.diagnosis IS
    'Cytological diagnosis / interpretation.';
COMMENT ON COLUMN cytology_test_result.impression IS
    'Summary impression / conclusion answering the clinical question.';
COMMENT ON COLUMN cytology_test_result.reporting_category IS
    'Structured-reporting grading category label (e.g. an NHS cervical-screening dyskaryosis grade, RCPath Thy or breast C category).';
COMMENT ON COLUMN cytology_test_result.recommended_follow_up IS
    'Recommended follow-up: repeat cytology, colposcopy, biopsy, MDT referral, or routine recall.';
COMMENT ON COLUMN cytology_test_result.critical_result_communicated IS
    'Whether a critical or unexpected significant result was communicated directly to the referrer.';
COMMENT ON COLUMN cytology_test_result.reported_to IS
    'Who the critical / urgent result was communicated to, with date and time if applicable.';
