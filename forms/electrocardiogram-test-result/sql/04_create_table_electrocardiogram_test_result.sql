-- ECG (electrocardiogram) test result (report) — the source-of-truth record.

CREATE TABLE electrocardiogram_test_result (
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
    ecg_type VARCHAR(25) NOT NULL DEFAULT ''
        CHECK (ecg_type IN ('resting-12-lead', 'exercise-stress', 'ambulatory-holter-24h', 'ambulatory-48h', 'event-recorder', 'other', '')),
    performed_date DATE,
    reported_date DATE,
    recording_quality VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (recording_quality IN ('good', 'adequate', 'poor', '')),

    -- Clinical context
    clinical_history VARCHAR(1000) NOT NULL DEFAULT '',

    -- Rate, rhythm, and intervals
    ventricular_rate_bpm INTEGER
        CHECK (ventricular_rate_bpm IS NULL OR ventricular_rate_bpm BETWEEN 0 AND 400),
    rhythm VARCHAR(25) NOT NULL DEFAULT ''
        CHECK (rhythm IN ('sinus', 'atrial-fibrillation', 'atrial-flutter', 'svt', 'ventricular-tachycardia', 'heart-block', 'paced', 'other', '')),
    pr_interval_ms INTEGER
        CHECK (pr_interval_ms IS NULL OR pr_interval_ms BETWEEN 0 AND 1000),
    qrs_duration_ms INTEGER
        CHECK (qrs_duration_ms IS NULL OR qrs_duration_ms BETWEEN 0 AND 1000),
    qt_interval_ms INTEGER
        CHECK (qt_interval_ms IS NULL OR qt_interval_ms BETWEEN 0 AND 1000),
    qtc_ms INTEGER
        CHECK (qtc_ms IS NULL OR qtc_ms BETWEEN 0 AND 1000),
    cardiac_axis VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (cardiac_axis IN ('normal', 'left-deviation', 'right-deviation', '')),

    -- Structured findings
    st_elevation BOOLEAN NOT NULL DEFAULT FALSE,
    st_depression BOOLEAN NOT NULL DEFAULT FALSE,
    t_wave_inversion BOOLEAN NOT NULL DEFAULT FALSE,
    pathological_q_waves BOOLEAN NOT NULL DEFAULT FALSE,
    left_ventricular_hypertrophy BOOLEAN NOT NULL DEFAULT FALSE,
    bundle_branch_block BOOLEAN NOT NULL DEFAULT FALSE,
    ischaemia BOOLEAN NOT NULL DEFAULT FALSE,
    normal_ecg BOOLEAN NOT NULL DEFAULT FALSE,

    -- Interpretation and conclusion
    interpretation VARCHAR(2000) NOT NULL DEFAULT '',
    comparison_with_previous VARCHAR(1000) NOT NULL DEFAULT '',
    impression VARCHAR(2000) NOT NULL DEFAULT '',
    reporting_category VARCHAR(50) NOT NULL DEFAULT '',
    recommended_follow_up VARCHAR(1000) NOT NULL DEFAULT '',

    -- Critical-result communication
    critical_result_communicated BOOLEAN NOT NULL DEFAULT FALSE,
    reported_to VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX index_electrocardiogram_test_result_patient_id
    ON electrocardiogram_test_result(patient_id);
CREATE INDEX index_electrocardiogram_test_result_clinician_id
    ON electrocardiogram_test_result(clinician_id);

CREATE TRIGGER trigger_electrocardiogram_test_result_updated_at
    BEFORE UPDATE ON electrocardiogram_test_result
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE electrocardiogram_test_result IS
    'ECG (electrocardiogram) test result (report). Captures the recorded ECG type and quality, the clinical history, the ventricular rate, rhythm and the PR / QRS / QT / QTc intervals and cardiac axis, the structured electrophysiological findings, the narrative interpretation and impression, recommended follow-up, and critical-result communication. This is the source-of-truth record that the four-axis interpretation grade is computed from.';
COMMENT ON COLUMN electrocardiogram_test_result.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN electrocardiogram_test_result.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN electrocardiogram_test_result.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN electrocardiogram_test_result.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN electrocardiogram_test_result.patient_id IS
    'Foreign key to the patient.';
COMMENT ON COLUMN electrocardiogram_test_result.clinician_id IS
    'Foreign key to the reporting clinician (cardiologist / cardiac physiologist / reporting clinician).';
COMMENT ON COLUMN electrocardiogram_test_result.originating_request_reference IS
    'Free-text reference linking this report back to the originating ECG request (referral).';
COMMENT ON COLUMN electrocardiogram_test_result.report_status IS
    'Report lifecycle status: preliminary, final, amended, cancelled.';
COMMENT ON COLUMN electrocardiogram_test_result.ecg_type IS
    'Recorded ECG type: resting-12-lead, exercise-stress, ambulatory-holter-24h, ambulatory-48h, event-recorder, other.';
COMMENT ON COLUMN electrocardiogram_test_result.performed_date IS
    'Date the ECG examination was recorded.';
COMMENT ON COLUMN electrocardiogram_test_result.reported_date IS
    'Date the report was authored / signed.';
COMMENT ON COLUMN electrocardiogram_test_result.recording_quality IS
    'Technical recording quality of the trace: good, adequate, poor.';
COMMENT ON COLUMN electrocardiogram_test_result.clinical_history IS
    'Clinical history and the question the examination was performed to answer.';
COMMENT ON COLUMN electrocardiogram_test_result.ventricular_rate_bpm IS
    'Ventricular rate in beats per minute (bpm).';
COMMENT ON COLUMN electrocardiogram_test_result.rhythm IS
    'Dominant rhythm: sinus, atrial-fibrillation, atrial-flutter, svt, ventricular-tachycardia, heart-block, paced, other.';
COMMENT ON COLUMN electrocardiogram_test_result.pr_interval_ms IS
    'PR interval in milliseconds (normal ~120-200 ms); prolongation suggests atrioventricular conduction delay / heart block.';
COMMENT ON COLUMN electrocardiogram_test_result.qrs_duration_ms IS
    'QRS duration in milliseconds (normal < 120 ms); widening suggests bundle branch block or ventricular origin.';
COMMENT ON COLUMN electrocardiogram_test_result.qt_interval_ms IS
    'Uncorrected QT interval in milliseconds.';
COMMENT ON COLUMN electrocardiogram_test_result.qtc_ms IS
    'Rate-corrected QT interval (QTc, e.g. Bazett) in milliseconds; >= 500 ms is markedly prolonged and confers torsades-de-pointes risk.';
COMMENT ON COLUMN electrocardiogram_test_result.cardiac_axis IS
    'Frontal-plane cardiac axis: normal, left-deviation, right-deviation.';
COMMENT ON COLUMN electrocardiogram_test_result.st_elevation IS
    'Whether ST-segment elevation (a potential STEMI / acute injury pattern) is present.';
COMMENT ON COLUMN electrocardiogram_test_result.st_depression IS
    'Whether ST-segment depression (an ischaemia pattern) is present.';
COMMENT ON COLUMN electrocardiogram_test_result.t_wave_inversion IS
    'Whether pathological T-wave inversion is present.';
COMMENT ON COLUMN electrocardiogram_test_result.pathological_q_waves IS
    'Whether pathological Q waves (prior infarction) are present.';
COMMENT ON COLUMN electrocardiogram_test_result.left_ventricular_hypertrophy IS
    'Whether voltage criteria for left ventricular hypertrophy (LVH) are met.';
COMMENT ON COLUMN electrocardiogram_test_result.bundle_branch_block IS
    'Whether bundle branch block (left or right) is present.';
COMMENT ON COLUMN electrocardiogram_test_result.ischaemia IS
    'Whether an ischaemic pattern is present.';
COMMENT ON COLUMN electrocardiogram_test_result.normal_ecg IS
    'Whether the ECG is reported as normal.';
COMMENT ON COLUMN electrocardiogram_test_result.interpretation IS
    'Narrative interpretation of the ECG findings (the body of the report).';
COMMENT ON COLUMN electrocardiogram_test_result.comparison_with_previous IS
    'Comparison with relevant previous ECGs.';
COMMENT ON COLUMN electrocardiogram_test_result.impression IS
    'Summary impression / conclusion answering the clinical question.';
COMMENT ON COLUMN electrocardiogram_test_result.reporting_category IS
    'Free-text structured-reporting category or coded label for the dominant interpretation.';
COMMENT ON COLUMN electrocardiogram_test_result.recommended_follow_up IS
    'Recommended follow-up investigation, referral, or management.';
COMMENT ON COLUMN electrocardiogram_test_result.critical_result_communicated IS
    'Whether a critical or unexpected significant result was communicated directly to the referrer / responsible team.';
COMMENT ON COLUMN electrocardiogram_test_result.reported_to IS
    'Who the critical / urgent result was communicated to, with date and time if applicable.';
