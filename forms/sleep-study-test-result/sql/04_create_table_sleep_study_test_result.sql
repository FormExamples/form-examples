-- Sleep study / polysomnography result (report) — the source-of-truth record.

CREATE TABLE sleep_study_test_result (
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

    -- Study
    study_type VARCHAR(30) NOT NULL DEFAULT ''
        CHECK (study_type IN ('home-sleep-apnoea-test', 'polysomnography', 'overnight-oximetry', 'multiple-sleep-latency-test', 'actigraphy', 'other', '')),
    study_adequacy VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (study_adequacy IN ('adequate', 'limited', 'failed', '')),

    -- Clinical context
    clinical_history VARCHAR(1000) NOT NULL DEFAULT '',
    comparison_with_previous VARCHAR(1000) NOT NULL DEFAULT '',

    -- Quantitative metrics
    total_recording_time_hours NUMERIC(4,1)
        CHECK (total_recording_time_hours IS NULL OR total_recording_time_hours BETWEEN 0 AND 24),
    total_sleep_time_hours NUMERIC(4,1)
        CHECK (total_sleep_time_hours IS NULL OR total_sleep_time_hours BETWEEN 0 AND 24),
    apnoea_hypopnoea_index NUMERIC(5,1)
        CHECK (apnoea_hypopnoea_index IS NULL OR apnoea_hypopnoea_index BETWEEN 0 AND 200),
    oxygen_desaturation_index NUMERIC(5,1)
        CHECK (oxygen_desaturation_index IS NULL OR oxygen_desaturation_index BETWEEN 0 AND 200),
    minimum_spo2_percent NUMERIC(4,1)
        CHECK (minimum_spo2_percent IS NULL OR minimum_spo2_percent BETWEEN 0 AND 100),
    time_below_90_percent_spo2 NUMERIC(5,1)
        CHECK (time_below_90_percent_spo2 IS NULL OR time_below_90_percent_spo2 BETWEEN 0 AND 100),
    mean_heart_rate_bpm INTEGER
        CHECK (mean_heart_rate_bpm IS NULL OR mean_heart_rate_bpm BETWEEN 0 AND 300),

    -- Interpretation
    osa_severity VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (osa_severity IN ('none', 'mild', 'moderate', 'severe', '')),

    -- Structured findings
    obstructive_sleep_apnoea BOOLEAN NOT NULL DEFAULT FALSE,
    central_sleep_apnoea BOOLEAN NOT NULL DEFAULT FALSE,
    periodic_limb_movements BOOLEAN NOT NULL DEFAULT FALSE,
    nocturnal_hypoventilation BOOLEAN NOT NULL DEFAULT FALSE,
    significant_desaturation BOOLEAN NOT NULL DEFAULT FALSE,
    normal_study BOOLEAN NOT NULL DEFAULT FALSE,

    -- Findings and impression
    findings_narrative VARCHAR(2000) NOT NULL DEFAULT '',
    impression VARCHAR(2000) NOT NULL DEFAULT '',
    reporting_category VARCHAR(50) NOT NULL DEFAULT '',
    recommended_follow_up VARCHAR(1000) NOT NULL DEFAULT '',

    -- Critical-result communication
    critical_result_communicated BOOLEAN NOT NULL DEFAULT FALSE,
    reported_to VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX index_sleep_study_test_result_patient_id
    ON sleep_study_test_result(patient_id);
CREATE INDEX index_sleep_study_test_result_clinician_id
    ON sleep_study_test_result(clinician_id);

CREATE TRIGGER trigger_sleep_study_test_result_updated_at
    BEFORE UPDATE ON sleep_study_test_result
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE sleep_study_test_result IS
    'Sleep study / polysomnography result (report). Captures the performed study type and adequacy, clinical history, the key quantitative metrics (recording and sleep time, apnoea-hypopnoea index, oxygen desaturation index, minimum and time-below-90% SpO2, mean heart rate), the OSA severity band, the narrative and structured findings, the impression, recommended follow-up, and critical-result communication. This is the source-of-truth record that the four-axis interpretation grade is computed from.';
COMMENT ON COLUMN sleep_study_test_result.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN sleep_study_test_result.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN sleep_study_test_result.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN sleep_study_test_result.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN sleep_study_test_result.patient_id IS
    'Foreign key to the patient.';
COMMENT ON COLUMN sleep_study_test_result.clinician_id IS
    'Foreign key to the reporting clinician (respiratory / sleep physician or clinical physiologist).';
COMMENT ON COLUMN sleep_study_test_result.originating_request_reference IS
    'Free-text reference linking this report back to the originating sleep study request (referral).';
COMMENT ON COLUMN sleep_study_test_result.report_status IS
    'Report lifecycle status: preliminary, final, amended, cancelled.';
COMMENT ON COLUMN sleep_study_test_result.performed_date IS
    'Date the sleep study was performed (night of recording).';
COMMENT ON COLUMN sleep_study_test_result.reported_date IS
    'Date the report was authored / signed.';
COMMENT ON COLUMN sleep_study_test_result.study_type IS
    'Performed study type: home-sleep-apnoea-test, polysomnography, overnight-oximetry, multiple-sleep-latency-test, actigraphy, other.';
COMMENT ON COLUMN sleep_study_test_result.study_adequacy IS
    'Diagnostic adequacy of the study: adequate, limited, failed (e.g. insufficient recording time or signal loss).';
COMMENT ON COLUMN sleep_study_test_result.clinical_history IS
    'Clinical history and the question the study was performed to answer.';
COMMENT ON COLUMN sleep_study_test_result.comparison_with_previous IS
    'Comparison with relevant previous sleep studies.';
COMMENT ON COLUMN sleep_study_test_result.total_recording_time_hours IS
    'Total recording time in hours.';
COMMENT ON COLUMN sleep_study_test_result.total_sleep_time_hours IS
    'Total sleep time in hours (for attended polysomnography with sleep staging).';
COMMENT ON COLUMN sleep_study_test_result.apnoea_hypopnoea_index IS
    'Apnoea-Hypopnoea Index (AHI): events per hour. AASM bands: normal <5, mild 5 to <15, moderate 15 to <30, severe >=30.';
COMMENT ON COLUMN sleep_study_test_result.oxygen_desaturation_index IS
    'Oxygen Desaturation Index (ODI): >=3% (or >=4%) desaturations per hour.';
COMMENT ON COLUMN sleep_study_test_result.minimum_spo2_percent IS
    'Lowest (nadir) oxygen saturation recorded, as a percentage.';
COMMENT ON COLUMN sleep_study_test_result.time_below_90_percent_spo2 IS
    'Percentage of recording / sleep time spent with SpO2 below 90% (T90).';
COMMENT ON COLUMN sleep_study_test_result.mean_heart_rate_bpm IS
    'Mean heart rate during the study, in beats per minute.';
COMMENT ON COLUMN sleep_study_test_result.osa_severity IS
    'OSA severity band derived from AHI: none, mild, moderate, severe.';
COMMENT ON COLUMN sleep_study_test_result.obstructive_sleep_apnoea IS
    'Whether obstructive sleep apnoea is present.';
COMMENT ON COLUMN sleep_study_test_result.central_sleep_apnoea IS
    'Whether central sleep apnoea (e.g. Cheyne-Stokes respiration) is present.';
COMMENT ON COLUMN sleep_study_test_result.periodic_limb_movements IS
    'Whether periodic limb movements of sleep are present.';
COMMENT ON COLUMN sleep_study_test_result.nocturnal_hypoventilation IS
    'Whether nocturnal hypoventilation (e.g. sustained hypercapnia / obesity hypoventilation) is present.';
COMMENT ON COLUMN sleep_study_test_result.significant_desaturation IS
    'Whether significant oxygen desaturation is present.';
COMMENT ON COLUMN sleep_study_test_result.normal_study IS
    'Whether the study is normal (no significant sleep-disordered breathing).';
COMMENT ON COLUMN sleep_study_test_result.findings_narrative IS
    'Narrative description of the study findings (the body of the report).';
COMMENT ON COLUMN sleep_study_test_result.impression IS
    'Summary impression / conclusion answering the clinical question.';
COMMENT ON COLUMN sleep_study_test_result.reporting_category IS
    'Free-text structured-reporting label for the AHI severity band (e.g. "Severe OSA (AHI >=30)").';
COMMENT ON COLUMN sleep_study_test_result.recommended_follow_up IS
    'Recommended follow-up management (e.g. CPAP titration, ventilation review, sleep-clinic referral).';
COMMENT ON COLUMN sleep_study_test_result.critical_result_communicated IS
    'Whether a critical or unexpected significant result was communicated directly to the referrer.';
COMMENT ON COLUMN sleep_study_test_result.reported_to IS
    'Who the critical / urgent result was communicated to, with date and time if applicable.';
