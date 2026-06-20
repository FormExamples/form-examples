-- Serum tumour-marker test result (report) — the source-of-truth record.
-- Unlike the request (which orders one or more markers as BOOLEAN columns), this
-- records the measured RESULT VALUES for each serum tumour marker as NUMERIC
-- columns, plus the prior value and trend, an overall result status, the
-- interpretive narrative and impression, recommended follow-up, and
-- critical-result communication. Tumour markers are poor screening tests (low
-- specificity, raised in benign conditions); the engine interprets the measured
-- values in clinical context rather than vetting a request. A markedly elevated
-- value or a rising trend on treatment drives an abnormal/urgent oncology review;
-- a very high AFP / beta-hCG (suggesting a germ-cell tumour) drives a critical
-- result.

CREATE TABLE tumor_marker_test_result (
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

    -- Specimen and clinical context
    specimen_condition VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (specimen_condition IN ('satisfactory', 'haemolysed', 'lipaemic', 'insufficient', '')),
    clinical_history VARCHAR(1000) NOT NULL DEFAULT '',
    known_cancer_site VARCHAR(255) NOT NULL DEFAULT '',

    -- Measured serum tumour-marker result values (NUMERIC). NULL when not measured.
    psa NUMERIC(12,2)
        CHECK (psa IS NULL OR psa >= 0),
    ca125 NUMERIC(12,2)
        CHECK (ca125 IS NULL OR ca125 >= 0),
    ca19_9 NUMERIC(12,2)
        CHECK (ca19_9 IS NULL OR ca19_9 >= 0),
    carcinoembryonic_antigen_cea NUMERIC(12,2)
        CHECK (carcinoembryonic_antigen_cea IS NULL OR carcinoembryonic_antigen_cea >= 0),
    alpha_fetoprotein_afp NUMERIC(12,2)
        CHECK (alpha_fetoprotein_afp IS NULL OR alpha_fetoprotein_afp >= 0),
    beta_hcg NUMERIC(12,2)
        CHECK (beta_hcg IS NULL OR beta_hcg >= 0),
    ca15_3 NUMERIC(12,2)
        CHECK (ca15_3 IS NULL OR ca15_3 >= 0),
    lactate_dehydrogenase_ldh NUMERIC(12,2)
        CHECK (lactate_dehydrogenase_ldh IS NULL OR lactate_dehydrogenase_ldh >= 0),
    calcitonin NUMERIC(12,2)
        CHECK (calcitonin IS NULL OR calcitonin >= 0),
    chromogranin_a NUMERIC(12,2)
        CHECK (chromogranin_a IS NULL OR chromogranin_a >= 0),

    -- Trend / comparison with previous
    previous_value NUMERIC(12,2)
        CHECK (previous_value IS NULL OR previous_value >= 0),
    trend VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (trend IN ('rising', 'stable', 'falling', 'not-applicable', '')),
    comparison_with_previous VARCHAR(1000) NOT NULL DEFAULT '',

    -- Overall result status and interpretation
    overall_result_status VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (overall_result_status IN ('normal', 'abnormal', 'critical', '')),
    markedly_elevated BOOLEAN NOT NULL DEFAULT FALSE,
    findings_narrative VARCHAR(2000) NOT NULL DEFAULT '',
    impression VARCHAR(2000) NOT NULL DEFAULT '',
    reporting_category VARCHAR(50) NOT NULL DEFAULT '',
    recommended_follow_up VARCHAR(1000) NOT NULL DEFAULT '',

    -- Critical-result communication
    critical_result_communicated BOOLEAN NOT NULL DEFAULT FALSE,
    reported_to VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX index_tumor_marker_test_result_patient_id
    ON tumor_marker_test_result(patient_id);
CREATE INDEX index_tumor_marker_test_result_clinician_id
    ON tumor_marker_test_result(clinician_id);

CREATE TRIGGER trigger_tumor_marker_test_result_updated_at
    BEFORE UPDATE ON tumor_marker_test_result
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE tumor_marker_test_result IS
    'Serum tumour-marker test result (report). Captures the measured result value for each serum tumour marker (NUMERIC), the prior value and trend, an overall result status, the interpretive narrative and impression, recommended follow-up, and critical-result communication. This is the source-of-truth record that the four-axis interpretation grade is computed from.';
COMMENT ON COLUMN tumor_marker_test_result.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN tumor_marker_test_result.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN tumor_marker_test_result.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN tumor_marker_test_result.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN tumor_marker_test_result.patient_id IS
    'Foreign key to the patient.';
COMMENT ON COLUMN tumor_marker_test_result.clinician_id IS
    'Foreign key to the reporting clinician (clinical biochemist / oncologist / reporting clinician).';
COMMENT ON COLUMN tumor_marker_test_result.originating_request_reference IS
    'Free-text reference linking this report back to the originating tumour-marker test request (referral).';
COMMENT ON COLUMN tumor_marker_test_result.report_status IS
    'Report lifecycle status: preliminary, final, amended, cancelled.';
COMMENT ON COLUMN tumor_marker_test_result.performed_date IS
    'Date the specimen was collected / the assay was performed.';
COMMENT ON COLUMN tumor_marker_test_result.reported_date IS
    'Date the report was authored / signed.';
COMMENT ON COLUMN tumor_marker_test_result.specimen_condition IS
    'Specimen condition affecting assay validity: satisfactory, haemolysed, lipaemic, insufficient.';
COMMENT ON COLUMN tumor_marker_test_result.clinical_history IS
    'Clinical history and the question the test was performed to answer.';
COMMENT ON COLUMN tumor_marker_test_result.known_cancer_site IS
    'Known or suspected primary cancer site, if any (context for interpretation).';
COMMENT ON COLUMN tumor_marker_test_result.psa IS
    'Measured prostate-specific antigen (PSA) value in ng/mL; NULL if not measured.';
COMMENT ON COLUMN tumor_marker_test_result.ca125 IS
    'Measured CA125 value in IU/mL (suspected ovarian cancer; NICE CG122 ultrasound threshold 35 IU/mL); NULL if not measured.';
COMMENT ON COLUMN tumor_marker_test_result.ca19_9 IS
    'Measured CA19-9 value in U/mL (pancreatic / hepatobiliary cancer; reference < 37 U/mL); NULL if not measured.';
COMMENT ON COLUMN tumor_marker_test_result.carcinoembryonic_antigen_cea IS
    'Measured carcinoembryonic antigen (CEA) value in ng/mL (colorectal cancer monitoring); NULL if not measured.';
COMMENT ON COLUMN tumor_marker_test_result.alpha_fetoprotein_afp IS
    'Measured alpha-fetoprotein (AFP) value in ng/mL (hepatocellular carcinoma, germ-cell tumours); a very high value suggests a germ-cell tumour; NULL if not measured.';
COMMENT ON COLUMN tumor_marker_test_result.beta_hcg IS
    'Measured beta human chorionic gonadotrophin (beta-hCG) value in IU/L (germ-cell / trophoblastic tumours); a very high value suggests a germ-cell tumour; NULL if not measured.';
COMMENT ON COLUMN tumor_marker_test_result.ca15_3 IS
    'Measured CA15-3 value in U/mL (breast cancer monitoring); NULL if not measured.';
COMMENT ON COLUMN tumor_marker_test_result.lactate_dehydrogenase_ldh IS
    'Measured lactate dehydrogenase (LDH) value in U/L (germ-cell tumour staging, lymphoma prognosis); NULL if not measured.';
COMMENT ON COLUMN tumor_marker_test_result.calcitonin IS
    'Measured calcitonin value in ng/L (medullary thyroid carcinoma); NULL if not measured.';
COMMENT ON COLUMN tumor_marker_test_result.chromogranin_a IS
    'Measured chromogranin A value in nmol/L (neuroendocrine tumours); NULL if not measured.';
COMMENT ON COLUMN tumor_marker_test_result.previous_value IS
    'Most recent previous value of the principal marker, for trend / response interpretation; NULL if none.';
COMMENT ON COLUMN tumor_marker_test_result.trend IS
    'Trend of the principal marker versus the previous value: rising, stable, falling, not-applicable.';
COMMENT ON COLUMN tumor_marker_test_result.comparison_with_previous IS
    'Narrative comparison with previous tumour-marker results.';
COMMENT ON COLUMN tumor_marker_test_result.overall_result_status IS
    'Overall result status: normal, abnormal, critical.';
COMMENT ON COLUMN tumor_marker_test_result.markedly_elevated IS
    'Whether one or more markers are markedly elevated above the reference range.';
COMMENT ON COLUMN tumor_marker_test_result.findings_narrative IS
    'Narrative description of the measured values and their interpretation (the body of the report).';
COMMENT ON COLUMN tumor_marker_test_result.impression IS
    'Summary impression / conclusion answering the clinical question.';
COMMENT ON COLUMN tumor_marker_test_result.reporting_category IS
    'Structured-reporting category label (e.g. a germ-cell-marker pattern or monitoring-trend category).';
COMMENT ON COLUMN tumor_marker_test_result.recommended_follow_up IS
    'Recommended follow-up: repeat interval, referral, or further investigation.';
COMMENT ON COLUMN tumor_marker_test_result.critical_result_communicated IS
    'Whether a critical or unexpected significant result was communicated directly to the requester.';
COMMENT ON COLUMN tumor_marker_test_result.reported_to IS
    'Who the critical / urgent result was communicated to, with date and time if applicable.';
