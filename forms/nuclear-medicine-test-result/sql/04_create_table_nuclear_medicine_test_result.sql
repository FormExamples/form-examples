-- Nuclear medicine (radionuclide scan) result (report) — the source-of-truth record.

CREATE TABLE nuclear_medicine_test_result (
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
    scan_type VARCHAR(25) NOT NULL DEFAULT ''
        CHECK (scan_type IN ('bone-scan', 'myocardial-perfusion', 'vq-lung-scan', 'thyroid-uptake', 'renal-dmsa', 'renal-mag3', 'gallium-octreotide', 'white-cell-scan', 'sentinel-node', 'other', '')),
    radiopharmaceutical VARCHAR(255) NOT NULL DEFAULT '',
    injected_activity_mbq NUMERIC(8,1)
        CHECK (injected_activity_mbq IS NULL OR injected_activity_mbq BETWEEN 0 AND 100000),
    examination_adequacy VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (examination_adequacy IN ('adequate', 'limited', 'non-diagnostic', '')),

    -- Clinical context
    clinical_history VARCHAR(1000) NOT NULL DEFAULT '',
    comparison_with_previous VARCHAR(1000) NOT NULL DEFAULT '',

    -- Findings
    findings_narrative VARCHAR(2000) NOT NULL DEFAULT '',
    abnormal_uptake BOOLEAN NOT NULL DEFAULT FALSE,
    metastatic_pattern BOOLEAN NOT NULL DEFAULT FALSE,
    perfusion_defect BOOLEAN NOT NULL DEFAULT FALSE,
    photopenic_area BOOLEAN NOT NULL DEFAULT FALSE,
    no_significant_abnormality BOOLEAN NOT NULL DEFAULT FALSE,
    incidental_finding BOOLEAN NOT NULL DEFAULT FALSE,

    -- Quantitative measurements
    ejection_fraction_percent NUMERIC(5,1)
        CHECK (ejection_fraction_percent IS NULL OR ejection_fraction_percent BETWEEN 0 AND 100),
    split_function_left_percent NUMERIC(5,1)
        CHECK (split_function_left_percent IS NULL OR split_function_left_percent BETWEEN 0 AND 100),
    split_function_right_percent NUMERIC(5,1)
        CHECK (split_function_right_percent IS NULL OR split_function_right_percent BETWEEN 0 AND 100),

    -- Impression and follow-up
    impression VARCHAR(2000) NOT NULL DEFAULT '',
    reporting_category VARCHAR(100) NOT NULL DEFAULT '',
    recommended_follow_up VARCHAR(1000) NOT NULL DEFAULT '',

    -- Critical-result communication
    critical_result_communicated BOOLEAN NOT NULL DEFAULT FALSE,
    reported_to VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX index_nuclear_medicine_test_result_patient_id
    ON nuclear_medicine_test_result(patient_id);
CREATE INDEX index_nuclear_medicine_test_result_clinician_id
    ON nuclear_medicine_test_result(clinician_id);

CREATE TRIGGER trigger_nuclear_medicine_test_result_updated_at
    BEFORE UPDATE ON nuclear_medicine_test_result
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE nuclear_medicine_test_result IS
    'Nuclear medicine (radionuclide scan) result (report). Captures the performed examination, the radiopharmaceutical and injected activity, clinical history, the narrative and structured findings, key quantitative measurements (e.g. ejection fraction, split renal function), the impression and structured reporting category (e.g. V/Q PE probability), recommended follow-up, and critical-result communication. This is the source-of-truth record that the four-axis interpretation grade is computed from.';
COMMENT ON COLUMN nuclear_medicine_test_result.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN nuclear_medicine_test_result.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN nuclear_medicine_test_result.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN nuclear_medicine_test_result.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN nuclear_medicine_test_result.patient_id IS
    'Foreign key to the patient.';
COMMENT ON COLUMN nuclear_medicine_test_result.clinician_id IS
    'Foreign key to the reporting clinician (nuclear-medicine physician / radiologist).';
COMMENT ON COLUMN nuclear_medicine_test_result.originating_request_reference IS
    'Free-text reference linking this report back to the originating nuclear medicine scan request (referral).';
COMMENT ON COLUMN nuclear_medicine_test_result.report_status IS
    'Report lifecycle status: preliminary, final, amended, cancelled.';
COMMENT ON COLUMN nuclear_medicine_test_result.performed_date IS
    'Date the nuclear medicine examination was performed.';
COMMENT ON COLUMN nuclear_medicine_test_result.reported_date IS
    'Date the report was authored / signed.';
COMMENT ON COLUMN nuclear_medicine_test_result.scan_type IS
    'Radionuclide scan type: bone-scan, myocardial-perfusion, vq-lung-scan, thyroid-uptake, renal-dmsa, renal-mag3, gallium-octreotide, white-cell-scan, sentinel-node, other.';
COMMENT ON COLUMN nuclear_medicine_test_result.radiopharmaceutical IS
    'Radiopharmaceutical (tracer) administered, e.g. Tc-99m MDP, Tc-99m MAA, Tc-99m sestamibi, Tc-99m MAG3, Tc-99m DMSA, Ga-68 DOTATATE.';
COMMENT ON COLUMN nuclear_medicine_test_result.injected_activity_mbq IS
    'Administered activity in megabecquerels (MBq), for dose audit (DRL comparison).';
COMMENT ON COLUMN nuclear_medicine_test_result.examination_adequacy IS
    'Diagnostic adequacy of the examination: adequate, limited, non-diagnostic.';
COMMENT ON COLUMN nuclear_medicine_test_result.clinical_history IS
    'Clinical history and the question the examination was performed to answer.';
COMMENT ON COLUMN nuclear_medicine_test_result.comparison_with_previous IS
    'Comparison with relevant previous imaging studies.';
COMMENT ON COLUMN nuclear_medicine_test_result.findings_narrative IS
    'Narrative description of the scintigraphic findings (the body of the report).';
COMMENT ON COLUMN nuclear_medicine_test_result.abnormal_uptake IS
    'Whether abnormal tracer uptake (focal or diffuse) is present.';
COMMENT ON COLUMN nuclear_medicine_test_result.metastatic_pattern IS
    'Whether a pattern suggestive of metastatic disease (e.g. multiple foci on bone scan) is present.';
COMMENT ON COLUMN nuclear_medicine_test_result.perfusion_defect IS
    'Whether a perfusion defect (e.g. myocardial or pulmonary) is present.';
COMMENT ON COLUMN nuclear_medicine_test_result.photopenic_area IS
    'Whether a photopenic (reduced-uptake / cold) area is present.';
COMMENT ON COLUMN nuclear_medicine_test_result.no_significant_abnormality IS
    'Whether the study shows no significant abnormality.';
COMMENT ON COLUMN nuclear_medicine_test_result.incidental_finding IS
    'Whether one or more incidental findings warranting documentation are present.';
COMMENT ON COLUMN nuclear_medicine_test_result.ejection_fraction_percent IS
    'Left-ventricular ejection fraction percentage, where gated cardiac studies are performed (0-100).';
COMMENT ON COLUMN nuclear_medicine_test_result.split_function_left_percent IS
    'Left-kidney split (differential) function percentage, for renal studies (0-100).';
COMMENT ON COLUMN nuclear_medicine_test_result.split_function_right_percent IS
    'Right-kidney split (differential) function percentage, for renal studies (0-100).';
COMMENT ON COLUMN nuclear_medicine_test_result.impression IS
    'Summary impression / conclusion answering the clinical question.';
COMMENT ON COLUMN nuclear_medicine_test_result.reporting_category IS
    'Free-text structured-reporting category label, e.g. PE probability for a V/Q study (normal / very-low / intermediate / high) or a bone-scan flare category.';
COMMENT ON COLUMN nuclear_medicine_test_result.recommended_follow_up IS
    'Recommended follow-up imaging, referral, or management.';
COMMENT ON COLUMN nuclear_medicine_test_result.critical_result_communicated IS
    'Whether a critical or unexpected significant result was communicated directly to the referrer.';
COMMENT ON COLUMN nuclear_medicine_test_result.reported_to IS
    'Who the critical / urgent result was communicated to, with date and time if applicable.';
