-- Coagulation / haemostasis test result (report) — the source-of-truth record.

CREATE TABLE coagulation_test_result (
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
        CHECK (specimen_condition IN ('satisfactory', 'clotted', 'underfilled', 'haemolysed', 'insufficient', '')),
    clinical_history VARCHAR(1000) NOT NULL DEFAULT '',
    on_anticoagulant BOOLEAN NOT NULL DEFAULT FALSE,
    anticoagulant_agent VARCHAR(255) NOT NULL DEFAULT '',

    -- Result values
    prothrombin_time_seconds NUMERIC(5,1)
        CHECK (prothrombin_time_seconds IS NULL OR prothrombin_time_seconds BETWEEN 0 AND 300),
    inr NUMERIC(4,1)
        CHECK (inr IS NULL OR inr BETWEEN 0 AND 50),
    activated_partial_thromboplastin_time_seconds NUMERIC(5,1)
        CHECK (activated_partial_thromboplastin_time_seconds IS NULL OR activated_partial_thromboplastin_time_seconds BETWEEN 0 AND 300),
    aptt_ratio NUMERIC(4,1)
        CHECK (aptt_ratio IS NULL OR aptt_ratio BETWEEN 0 AND 50),
    fibrinogen_g_l NUMERIC(4,1)
        CHECK (fibrinogen_g_l IS NULL OR fibrinogen_g_l BETWEEN 0 AND 50),
    d_dimer NUMERIC(8,1)
        CHECK (d_dimer IS NULL OR d_dimer BETWEEN 0 AND 1000000),
    thrombin_time_seconds NUMERIC(5,1)
        CHECK (thrombin_time_seconds IS NULL OR thrombin_time_seconds BETWEEN 0 AND 300),
    factor_assays VARCHAR(2000) NOT NULL DEFAULT '',

    -- Interpretation
    overall_result_status VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (overall_result_status IN ('normal', 'abnormal', 'critical', '')),
    critical_value_present BOOLEAN NOT NULL DEFAULT FALSE,
    critical_value_detail VARCHAR(1000) NOT NULL DEFAULT '',
    findings_narrative VARCHAR(2000) NOT NULL DEFAULT '',
    comparison_with_previous VARCHAR(1000) NOT NULL DEFAULT '',
    impression VARCHAR(2000) NOT NULL DEFAULT '',
    reporting_category VARCHAR(50) NOT NULL DEFAULT '',

    -- Follow-up and critical-result communication
    recommended_follow_up VARCHAR(1000) NOT NULL DEFAULT '',
    critical_result_communicated BOOLEAN NOT NULL DEFAULT FALSE,
    reported_to VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX index_coagulation_test_result_patient_id
    ON coagulation_test_result(patient_id);
CREATE INDEX index_coagulation_test_result_clinician_id
    ON coagulation_test_result(clinician_id);

CREATE TRIGGER trigger_coagulation_test_result_updated_at
    BEFORE UPDATE ON coagulation_test_result
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE coagulation_test_result IS
    'Coagulation / haemostasis test result (report). Captures the reported result values (PT/INR, APTT/ratio, fibrinogen, D-dimer, thrombin time, factor assays), the specimen condition, clinical history and anticoagulant status, the narrative and impression, and critical-result communication. This is the source-of-truth record that the four-axis interpretation grade is computed from.';
COMMENT ON COLUMN coagulation_test_result.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN coagulation_test_result.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN coagulation_test_result.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN coagulation_test_result.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN coagulation_test_result.patient_id IS
    'Foreign key to the patient.';
COMMENT ON COLUMN coagulation_test_result.clinician_id IS
    'Foreign key to the reporting clinician (consultant haematologist / biomedical scientist).';
COMMENT ON COLUMN coagulation_test_result.originating_request_reference IS
    'Free-text reference linking this report back to the originating coagulation test request (referral).';
COMMENT ON COLUMN coagulation_test_result.report_status IS
    'Report lifecycle status: preliminary, final, amended, cancelled.';
COMMENT ON COLUMN coagulation_test_result.performed_date IS
    'Date the coagulation analysis was performed.';
COMMENT ON COLUMN coagulation_test_result.reported_date IS
    'Date the report was authored / signed.';
COMMENT ON COLUMN coagulation_test_result.specimen_condition IS
    'Pre-analytical specimen condition: satisfactory, clotted, underfilled, haemolysed, insufficient.';
COMMENT ON COLUMN coagulation_test_result.clinical_history IS
    'Clinical history and the question the test was performed to answer.';
COMMENT ON COLUMN coagulation_test_result.on_anticoagulant IS
    'Whether the patient is on anticoagulant therapy at the time of sampling (affects interpretation of PT/INR/APTT).';
COMMENT ON COLUMN coagulation_test_result.anticoagulant_agent IS
    'Anticoagulant agent, if any (e.g. warfarin, LMWH, apixaban, rivaroxaban, dabigatran).';
COMMENT ON COLUMN coagulation_test_result.prothrombin_time_seconds IS
    'Prothrombin time (PT) in seconds.';
COMMENT ON COLUMN coagulation_test_result.inr IS
    'International normalised ratio (INR) derived from the prothrombin time.';
COMMENT ON COLUMN coagulation_test_result.activated_partial_thromboplastin_time_seconds IS
    'Activated partial thromboplastin time (APTT) in seconds.';
COMMENT ON COLUMN coagulation_test_result.aptt_ratio IS
    'APTT ratio (patient APTT divided by the control / mean normal APTT).';
COMMENT ON COLUMN coagulation_test_result.fibrinogen_g_l IS
    'Fibrinogen (Clauss) concentration in grams per litre (g/L).';
COMMENT ON COLUMN coagulation_test_result.d_dimer IS
    'D-dimer concentration (units as reported by the assay, e.g. ng/mL FEU or mg/L).';
COMMENT ON COLUMN coagulation_test_result.thrombin_time_seconds IS
    'Thrombin time (TT) in seconds.';
COMMENT ON COLUMN coagulation_test_result.factor_assays IS
    'Free-text factor-assay and special-test results (e.g. factor VIII/IX levels, von Willebrand panel, lupus anticoagulant, anti-Xa).';
COMMENT ON COLUMN coagulation_test_result.overall_result_status IS
    'Overall result status: normal, abnormal, critical.';
COMMENT ON COLUMN coagulation_test_result.critical_value_present IS
    'Whether a critical (panic) value is present (e.g. INR > 8, fibrinogen < 1.0 g/L, or a DIC picture) requiring immediate communication.';
COMMENT ON COLUMN coagulation_test_result.critical_value_detail IS
    'Description of the critical value(s) present and the threshold(s) breached.';
COMMENT ON COLUMN coagulation_test_result.findings_narrative IS
    'Narrative description of the coagulation findings (the body of the report).';
COMMENT ON COLUMN coagulation_test_result.comparison_with_previous IS
    'Comparison with relevant previous coagulation results (trend / delta check).';
COMMENT ON COLUMN coagulation_test_result.impression IS
    'Summary impression / conclusion answering the clinical question.';
COMMENT ON COLUMN coagulation_test_result.reporting_category IS
    'Structured-reporting category label (e.g. anticoagulant-effect, DIC-picture, isolated-APTT-prolongation, normal-haemostasis).';
COMMENT ON COLUMN coagulation_test_result.recommended_follow_up IS
    'Recommended follow-up testing, referral, or management.';
COMMENT ON COLUMN coagulation_test_result.critical_result_communicated IS
    'Whether a critical or unexpected significant result was communicated directly to the referrer.';
COMMENT ON COLUMN coagulation_test_result.reported_to IS
    'Who the critical / urgent result was communicated to, with date and time if applicable.';
