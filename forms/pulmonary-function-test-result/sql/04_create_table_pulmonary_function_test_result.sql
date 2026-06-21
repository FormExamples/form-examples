-- Pulmonary function test (lung-function / spirometry) result (report) — the source-of-truth record.

CREATE TABLE pulmonary_function_test_result (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    patient_id UUID NOT NULL REFERENCES patient(id) ON DELETE CASCADE,
    clinician_id UUID NOT NULL REFERENCES clinician(id) ON DELETE CASCADE,

    -- Report identification
    originating_request_reference VARCHAR(255) NOT NULL DEFAULT '',
    test_type VARCHAR(30) NOT NULL DEFAULT ''
        CHECK (test_type IN ('spirometry', 'spirometry-with-reversibility', 'full-lung-function', 'gas-transfer-dlco', 'peak-flow', 'feno', 'other', '')),
    performed_date DATE,
    reported_date DATE,
    report_status VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (report_status IN ('preliminary', 'final', 'amended', 'cancelled', '')),
    test_quality VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (test_quality IN ('acceptable', 'sub-optimal', 'unacceptable', '')),

    -- Clinical context
    clinical_history VARCHAR(1000) NOT NULL DEFAULT '',

    -- Measured values
    fev1_litres NUMERIC(4,2)
        CHECK (fev1_litres IS NULL OR fev1_litres BETWEEN 0 AND 12),
    fev1_percent_predicted NUMERIC(5,1)
        CHECK (fev1_percent_predicted IS NULL OR fev1_percent_predicted BETWEEN 0 AND 250),
    fvc_litres NUMERIC(4,2)
        CHECK (fvc_litres IS NULL OR fvc_litres BETWEEN 0 AND 12),
    fvc_percent_predicted NUMERIC(5,1)
        CHECK (fvc_percent_predicted IS NULL OR fvc_percent_predicted BETWEEN 0 AND 250),
    fev1_fvc_ratio NUMERIC(4,2)
        CHECK (fev1_fvc_ratio IS NULL OR fev1_fvc_ratio BETWEEN 0 AND 1),
    peak_expiratory_flow NUMERIC(6,1)
        CHECK (peak_expiratory_flow IS NULL OR peak_expiratory_flow BETWEEN 0 AND 1200),
    dlco_percent_predicted NUMERIC(5,1)
        CHECK (dlco_percent_predicted IS NULL OR dlco_percent_predicted BETWEEN 0 AND 250),

    -- Interpretation summary
    ventilatory_pattern VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (ventilatory_pattern IN ('normal', 'obstructive', 'restrictive', 'mixed', '')),
    severity VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (severity IN ('none', 'mild', 'moderate', 'severe', 'very-severe', '')),
    bronchodilator_reversibility VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (bronchodilator_reversibility IN ('positive', 'negative', 'not-tested', '')),

    -- Structured findings
    airflow_obstruction BOOLEAN NOT NULL DEFAULT FALSE,
    restriction BOOLEAN NOT NULL DEFAULT FALSE,
    reduced_gas_transfer BOOLEAN NOT NULL DEFAULT FALSE,
    significant_reversibility BOOLEAN NOT NULL DEFAULT FALSE,
    normal_spirometry BOOLEAN NOT NULL DEFAULT FALSE,

    -- Narrative and conclusion
    findings_narrative VARCHAR(2000) NOT NULL DEFAULT '',
    comparison_with_previous VARCHAR(1000) NOT NULL DEFAULT '',
    impression VARCHAR(2000) NOT NULL DEFAULT '',
    reporting_category VARCHAR(50) NOT NULL DEFAULT '',
    recommended_follow_up VARCHAR(1000) NOT NULL DEFAULT '',

    -- Critical-result communication
    critical_result_communicated BOOLEAN NOT NULL DEFAULT FALSE,
    reported_to VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX index_pulmonary_function_test_result_patient_id
    ON pulmonary_function_test_result(patient_id);
CREATE INDEX index_pulmonary_function_test_result_clinician_id
    ON pulmonary_function_test_result(clinician_id);

CREATE TRIGGER trigger_pulmonary_function_test_result_updated_at
    BEFORE UPDATE ON pulmonary_function_test_result
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE pulmonary_function_test_result IS
    'Pulmonary function test (lung-function / spirometry) result (report). Captures the performed test type and quality, clinical history, the measured spirometry / gas-transfer values, the structured ventilatory interpretation (pattern, severity, bronchodilator reversibility), the narrative and structured findings, the impression, recommended follow-up, and critical-result communication. This is the source-of-truth record that the four-axis interpretation grade is computed from.';
COMMENT ON COLUMN pulmonary_function_test_result.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN pulmonary_function_test_result.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN pulmonary_function_test_result.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN pulmonary_function_test_result.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN pulmonary_function_test_result.patient_id IS
    'Foreign key to the patient.';
COMMENT ON COLUMN pulmonary_function_test_result.clinician_id IS
    'Foreign key to the reporting clinician (respiratory physician / clinical physiologist).';
COMMENT ON COLUMN pulmonary_function_test_result.originating_request_reference IS
    'Free-text reference linking this report back to the originating pulmonary function test request (referral).';
COMMENT ON COLUMN pulmonary_function_test_result.test_type IS
    'Performed test type: spirometry, spirometry-with-reversibility, full-lung-function, gas-transfer-dlco, peak-flow, feno, other.';
COMMENT ON COLUMN pulmonary_function_test_result.performed_date IS
    'Date the lung-function test was performed.';
COMMENT ON COLUMN pulmonary_function_test_result.reported_date IS
    'Date the report was authored / signed.';
COMMENT ON COLUMN pulmonary_function_test_result.report_status IS
    'Report lifecycle status: preliminary, final, amended, cancelled.';
COMMENT ON COLUMN pulmonary_function_test_result.test_quality IS
    'ATS/ERS acceptability and repeatability grade for the manoeuvres: acceptable, sub-optimal, unacceptable.';
COMMENT ON COLUMN pulmonary_function_test_result.clinical_history IS
    'Clinical history and the question the test was performed to answer.';
COMMENT ON COLUMN pulmonary_function_test_result.fev1_litres IS
    'Forced expiratory volume in one second (FEV1) in litres (post-bronchodilator where reversibility tested).';
COMMENT ON COLUMN pulmonary_function_test_result.fev1_percent_predicted IS
    'FEV1 as a percentage of the predicted (reference) value.';
COMMENT ON COLUMN pulmonary_function_test_result.fvc_litres IS
    'Forced vital capacity (FVC) in litres.';
COMMENT ON COLUMN pulmonary_function_test_result.fvc_percent_predicted IS
    'FVC as a percentage of the predicted (reference) value.';
COMMENT ON COLUMN pulmonary_function_test_result.fev1_fvc_ratio IS
    'FEV1/FVC ratio (0-1). Post-bronchodilator ratio < 0.70 confirms airflow obstruction (NICE NG115 / GOLD).';
COMMENT ON COLUMN pulmonary_function_test_result.peak_expiratory_flow IS
    'Peak expiratory flow (PEF) in litres per minute.';
COMMENT ON COLUMN pulmonary_function_test_result.dlco_percent_predicted IS
    'Diffusing capacity of the lung for carbon monoxide (DLCO / transfer factor) as a percentage of predicted.';
COMMENT ON COLUMN pulmonary_function_test_result.ventilatory_pattern IS
    'Overall ventilatory pattern: normal, obstructive, restrictive, mixed.';
COMMENT ON COLUMN pulmonary_function_test_result.severity IS
    'Severity of the lung-function impairment: none, mild, moderate, severe, very-severe (ATS/ERS z-score or GOLD percent-predicted banding).';
COMMENT ON COLUMN pulmonary_function_test_result.bronchodilator_reversibility IS
    'Bronchodilator reversibility result: positive, negative, not-tested.';
COMMENT ON COLUMN pulmonary_function_test_result.airflow_obstruction IS
    'Whether airflow obstruction (reduced FEV1/FVC) is present.';
COMMENT ON COLUMN pulmonary_function_test_result.restriction IS
    'Whether a restrictive pattern (reduced FVC / TLC with preserved ratio) is present.';
COMMENT ON COLUMN pulmonary_function_test_result.reduced_gas_transfer IS
    'Whether reduced gas transfer (low DLCO / transfer factor) is present.';
COMMENT ON COLUMN pulmonary_function_test_result.significant_reversibility IS
    'Whether significant bronchodilator reversibility was demonstrated.';
COMMENT ON COLUMN pulmonary_function_test_result.normal_spirometry IS
    'Whether the spirometry is within normal limits.';
COMMENT ON COLUMN pulmonary_function_test_result.findings_narrative IS
    'Narrative description of the lung-function findings (the body of the report).';
COMMENT ON COLUMN pulmonary_function_test_result.comparison_with_previous IS
    'Comparison with relevant previous lung-function studies (e.g. decline in FEV1).';
COMMENT ON COLUMN pulmonary_function_test_result.impression IS
    'Summary impression / conclusion answering the clinical question.';
COMMENT ON COLUMN pulmonary_function_test_result.reporting_category IS
    'Free-text structured-reporting category label (e.g. a GOLD 1-4 or ATS/ERS severity band).';
COMMENT ON COLUMN pulmonary_function_test_result.recommended_follow_up IS
    'Recommended follow-up testing, referral, or management.';
COMMENT ON COLUMN pulmonary_function_test_result.critical_result_communicated IS
    'Whether a critical or unexpected significant result was communicated directly to the referrer.';
COMMENT ON COLUMN pulmonary_function_test_result.reported_to IS
    'Who the critical / urgent result was communicated to, with date and time if applicable.';
