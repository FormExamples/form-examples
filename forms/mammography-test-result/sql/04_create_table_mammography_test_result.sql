-- Breast mammography result (report) — the source-of-truth record.

CREATE TABLE mammography_test_result (
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

    -- Examination
    exam_type VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (exam_type IN ('screening', 'diagnostic', 'symptomatic', 'surveillance', 'other', '')),
    laterality VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (laterality IN ('left', 'right', 'bilateral', '')),
    examination_adequacy VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (examination_adequacy IN ('adequate', 'limited', 'non-diagnostic', '')),
    breast_density VARCHAR(1) NOT NULL DEFAULT ''
        CHECK (breast_density IN ('a', 'b', 'c', 'd', '')),

    -- Clinical context
    clinical_history VARCHAR(1000) NOT NULL DEFAULT '',
    comparison_with_previous VARCHAR(1000) NOT NULL DEFAULT '',

    -- Findings
    findings_narrative VARCHAR(2000) NOT NULL DEFAULT '',
    mass BOOLEAN NOT NULL DEFAULT FALSE,
    calcifications BOOLEAN NOT NULL DEFAULT FALSE,
    architectural_distortion BOOLEAN NOT NULL DEFAULT FALSE,
    asymmetry BOOLEAN NOT NULL DEFAULT FALSE,
    skin_or_nipple_change BOOLEAN NOT NULL DEFAULT FALSE,
    lymphadenopathy BOOLEAN NOT NULL DEFAULT FALSE,
    incidental_finding BOOLEAN NOT NULL DEFAULT FALSE,

    -- Measurements
    largest_lesion_size_mm NUMERIC(6,1)
        CHECK (largest_lesion_size_mm IS NULL OR largest_lesion_size_mm BETWEEN 0 AND 1000),

    -- Impression and structured score
    impression VARCHAR(2000) NOT NULL DEFAULT '',
    bi_rads_category VARCHAR(2) NOT NULL DEFAULT ''
        CHECK (bi_rads_category IN ('0', '1', '2', '3', '4a', '4b', '4c', '5', '6', '')),
    recommended_follow_up VARCHAR(1000) NOT NULL DEFAULT '',

    -- Critical-result communication
    critical_result_communicated BOOLEAN NOT NULL DEFAULT FALSE,
    reported_to VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX index_mammography_test_result_patient_id
    ON mammography_test_result(patient_id);
CREATE INDEX index_mammography_test_result_clinician_id
    ON mammography_test_result(clinician_id);

CREATE TRIGGER trigger_mammography_test_result_updated_at
    BEFORE UPDATE ON mammography_test_result
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE mammography_test_result IS
    'Breast mammography result (report). Captures the performed examination and laterality, the clinical history, the narrative and structured findings, breast density (ACR A-D), the largest lesion measurement, the impression, the BI-RADS final assessment category (the key structured score), recommended follow-up, and critical-result communication. This is the source-of-truth record that the four-axis interpretation grade is computed from.';
COMMENT ON COLUMN mammography_test_result.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN mammography_test_result.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN mammography_test_result.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN mammography_test_result.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN mammography_test_result.patient_id IS
    'Foreign key to the patient.';
COMMENT ON COLUMN mammography_test_result.clinician_id IS
    'Foreign key to the reporting clinician (radiologist / consultant / reporting radiographer).';
COMMENT ON COLUMN mammography_test_result.originating_request_reference IS
    'Free-text reference linking this report back to the originating mammography request (referral).';
COMMENT ON COLUMN mammography_test_result.report_status IS
    'Report lifecycle status: preliminary, final, amended, cancelled.';
COMMENT ON COLUMN mammography_test_result.performed_date IS
    'Date the mammography examination was performed.';
COMMENT ON COLUMN mammography_test_result.reported_date IS
    'Date the report was authored / signed.';
COMMENT ON COLUMN mammography_test_result.exam_type IS
    'Type of mammography performed: screening, diagnostic, symptomatic, surveillance, other. Only BI-RADS 0/1/2 may be assigned to a screening study; 3/4/5/6 require a complete diagnostic work-up.';
COMMENT ON COLUMN mammography_test_result.laterality IS
    'Examined side: left, right, bilateral.';
COMMENT ON COLUMN mammography_test_result.examination_adequacy IS
    'Diagnostic adequacy of the examination: adequate, limited, non-diagnostic.';
COMMENT ON COLUMN mammography_test_result.breast_density IS
    'ACR BI-RADS breast composition / density: a = almost entirely fatty, b = scattered fibroglandular, c = heterogeneously dense, d = extremely dense.';
COMMENT ON COLUMN mammography_test_result.clinical_history IS
    'Clinical history and the question the examination was performed to answer.';
COMMENT ON COLUMN mammography_test_result.comparison_with_previous IS
    'Comparison with relevant previous mammograms or breast imaging.';
COMMENT ON COLUMN mammography_test_result.findings_narrative IS
    'Narrative description of the imaging findings (the body of the report).';
COMMENT ON COLUMN mammography_test_result.mass IS
    'Whether a mass is present.';
COMMENT ON COLUMN mammography_test_result.calcifications IS
    'Whether calcifications (e.g. clustered, pleomorphic) are present.';
COMMENT ON COLUMN mammography_test_result.architectural_distortion IS
    'Whether architectural distortion is present.';
COMMENT ON COLUMN mammography_test_result.asymmetry IS
    'Whether an asymmetry (developing, focal, or global) is present.';
COMMENT ON COLUMN mammography_test_result.skin_or_nipple_change IS
    'Whether a skin thickening / retraction or nipple change is present.';
COMMENT ON COLUMN mammography_test_result.lymphadenopathy IS
    'Whether axillary or intramammary lymphadenopathy is present.';
COMMENT ON COLUMN mammography_test_result.incidental_finding IS
    'Whether one or more incidental findings warranting documentation are present.';
COMMENT ON COLUMN mammography_test_result.largest_lesion_size_mm IS
    'Largest lesion long-axis size in millimetres, for surveillance and categorisation.';
COMMENT ON COLUMN mammography_test_result.impression IS
    'Summary impression / conclusion answering the clinical question.';
COMMENT ON COLUMN mammography_test_result.bi_rads_category IS
    'ACR BI-RADS final assessment category (the key structured score): 0 = incomplete, need additional imaging; 1 = negative; 2 = benign; 3 = probably benign; 4a/4b/4c = suspicious (low / intermediate / moderate); 5 = highly suggestive of malignancy; 6 = known biopsy-proven malignancy.';
COMMENT ON COLUMN mammography_test_result.recommended_follow_up IS
    'Recommended follow-up: routine screening interval, short-interval follow-up, additional imaging, biopsy, or specialist referral.';
COMMENT ON COLUMN mammography_test_result.critical_result_communicated IS
    'Whether a critical or unexpected significant result was communicated directly to the referrer.';
COMMENT ON COLUMN mammography_test_result.reported_to IS
    'Who the critical / urgent result was communicated to, with date and time if applicable.';
