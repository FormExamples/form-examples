-- Ambulatory ECG (Holter) monitor result (report) — the source-of-truth record.

CREATE TABLE holter_monitor_test_result (
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
    monitor_type VARCHAR(30) NOT NULL DEFAULT ''
        CHECK (monitor_type IN ('24-hour', '48-hour', '7-day', '14-day', 'event-recorder', 'implantable-loop-recorder', 'other', '')),
    performed_date DATE,
    reported_date DATE,

    -- Recording quality
    recording_duration_hours NUMERIC(7,1)
        CHECK (recording_duration_hours IS NULL OR recording_duration_hours BETWEEN 0 AND 10000),
    analysed_percent NUMERIC(5,1)
        CHECK (analysed_percent IS NULL OR analysed_percent BETWEEN 0 AND 100),

    -- Clinical context
    clinical_history VARCHAR(1000) NOT NULL DEFAULT '',

    -- Rhythm and rate summary
    predominant_rhythm VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (predominant_rhythm IN ('sinus', 'atrial-fibrillation', 'paced', 'other', '')),
    mean_heart_rate_bpm INTEGER
        CHECK (mean_heart_rate_bpm IS NULL OR mean_heart_rate_bpm BETWEEN 0 AND 400),
    minimum_heart_rate_bpm INTEGER
        CHECK (minimum_heart_rate_bpm IS NULL OR minimum_heart_rate_bpm BETWEEN 0 AND 400),
    maximum_heart_rate_bpm INTEGER
        CHECK (maximum_heart_rate_bpm IS NULL OR maximum_heart_rate_bpm BETWEEN 0 AND 400),
    longest_pause_seconds NUMERIC(5,2)
        CHECK (longest_pause_seconds IS NULL OR longest_pause_seconds BETWEEN 0 AND 600),
    ventricular_ectopic_percent NUMERIC(5,2)
        CHECK (ventricular_ectopic_percent IS NULL OR ventricular_ectopic_percent BETWEEN 0 AND 100),
    supraventricular_ectopic_percent NUMERIC(5,2)
        CHECK (supraventricular_ectopic_percent IS NULL OR supraventricular_ectopic_percent BETWEEN 0 AND 100),

    -- Structured findings
    atrial_fibrillation_detected BOOLEAN NOT NULL DEFAULT FALSE,
    significant_pauses BOOLEAN NOT NULL DEFAULT FALSE,
    ventricular_tachycardia BOOLEAN NOT NULL DEFAULT FALSE,
    supraventricular_tachycardia BOOLEAN NOT NULL DEFAULT FALSE,
    high_grade_av_block BOOLEAN NOT NULL DEFAULT FALSE,
    symptom_rhythm_correlation BOOLEAN NOT NULL DEFAULT FALSE,
    normal_study BOOLEAN NOT NULL DEFAULT FALSE,

    -- Findings and impression
    findings_narrative VARCHAR(2000) NOT NULL DEFAULT '',
    comparison_with_previous VARCHAR(1000) NOT NULL DEFAULT '',
    impression VARCHAR(2000) NOT NULL DEFAULT '',
    reporting_category VARCHAR(50) NOT NULL DEFAULT '',

    -- Follow-up
    recommended_follow_up VARCHAR(1000) NOT NULL DEFAULT '',

    -- Critical-result communication
    critical_result_communicated BOOLEAN NOT NULL DEFAULT FALSE,
    reported_to VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX index_holter_monitor_test_result_patient_id
    ON holter_monitor_test_result(patient_id);
CREATE INDEX index_holter_monitor_test_result_clinician_id
    ON holter_monitor_test_result(clinician_id);

CREATE TRIGGER trigger_holter_monitor_test_result_updated_at
    BEFORE UPDATE ON holter_monitor_test_result
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE holter_monitor_test_result IS
    'Ambulatory ECG (Holter) monitor result (report). Captures the monitor type and recording quality, clinical history, the rhythm and rate summary (mean / minimum / maximum heart rate, longest pause, ectopy burden), structured findings (AF, significant pauses, VT, SVT, high-grade AV block, symptom-rhythm correlation, normal study), the narrative and impression, recommended follow-up, and critical-result communication. This is the source-of-truth record that the four-axis interpretation grade is computed from.';
COMMENT ON COLUMN holter_monitor_test_result.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN holter_monitor_test_result.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN holter_monitor_test_result.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN holter_monitor_test_result.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN holter_monitor_test_result.patient_id IS
    'Foreign key to the patient.';
COMMENT ON COLUMN holter_monitor_test_result.clinician_id IS
    'Foreign key to the reporting clinician (cardiologist / cardiac physiologist).';
COMMENT ON COLUMN holter_monitor_test_result.originating_request_reference IS
    'Free-text reference linking this report back to the originating Holter monitor request (referral).';
COMMENT ON COLUMN holter_monitor_test_result.report_status IS
    'Report lifecycle status: preliminary, final, amended, cancelled.';
COMMENT ON COLUMN holter_monitor_test_result.monitor_type IS
    'Monitor type actually used: 24-hour, 48-hour, 7-day, 14-day, event-recorder, implantable-loop-recorder, other.';
COMMENT ON COLUMN holter_monitor_test_result.performed_date IS
    'Date the Holter recording was performed (recording start / hook-up).';
COMMENT ON COLUMN holter_monitor_test_result.reported_date IS
    'Date the report was authored / signed.';
COMMENT ON COLUMN holter_monitor_test_result.recording_duration_hours IS
    'Total analysable recording duration in hours, for recording-quality assessment.';
COMMENT ON COLUMN holter_monitor_test_result.analysed_percent IS
    'Percentage of the recording that was analysable / interpretable (0-100), for recording-quality assessment.';
COMMENT ON COLUMN holter_monitor_test_result.clinical_history IS
    'Clinical history and the question the monitoring was performed to answer.';
COMMENT ON COLUMN holter_monitor_test_result.predominant_rhythm IS
    'Predominant underlying rhythm: sinus, atrial-fibrillation, paced, other.';
COMMENT ON COLUMN holter_monitor_test_result.mean_heart_rate_bpm IS
    'Mean (24-hour average) heart rate in beats per minute.';
COMMENT ON COLUMN holter_monitor_test_result.minimum_heart_rate_bpm IS
    'Minimum heart rate in beats per minute (bradycardia screen).';
COMMENT ON COLUMN holter_monitor_test_result.maximum_heart_rate_bpm IS
    'Maximum heart rate in beats per minute (tachycardia screen).';
COMMENT ON COLUMN holter_monitor_test_result.longest_pause_seconds IS
    'Longest R-R pause in seconds; pauses > 3 seconds are clinically significant.';
COMMENT ON COLUMN holter_monitor_test_result.ventricular_ectopic_percent IS
    'Ventricular ectopic (VE / PVC) burden as a percentage of total beats.';
COMMENT ON COLUMN holter_monitor_test_result.supraventricular_ectopic_percent IS
    'Supraventricular ectopic (SVE / PAC) burden as a percentage of total beats.';
COMMENT ON COLUMN holter_monitor_test_result.atrial_fibrillation_detected IS
    'Whether atrial fibrillation (or flutter) was detected during the recording.';
COMMENT ON COLUMN holter_monitor_test_result.significant_pauses IS
    'Whether significant pauses (> 3 seconds) were recorded.';
COMMENT ON COLUMN holter_monitor_test_result.ventricular_tachycardia IS
    'Whether ventricular tachycardia (sustained or non-sustained) was recorded (critical finding).';
COMMENT ON COLUMN holter_monitor_test_result.supraventricular_tachycardia IS
    'Whether supraventricular tachycardia (SVT) was recorded.';
COMMENT ON COLUMN holter_monitor_test_result.high_grade_av_block IS
    'Whether high-grade AV block (Mobitz II or third-degree) was recorded (critical finding).';
COMMENT ON COLUMN holter_monitor_test_result.symptom_rhythm_correlation IS
    'Whether reported symptoms correlated with a recorded rhythm abnormality (diary correlation).';
COMMENT ON COLUMN holter_monitor_test_result.normal_study IS
    'Whether the study is normal (no significant arrhythmia, conduction abnormality, or pause).';
COMMENT ON COLUMN holter_monitor_test_result.findings_narrative IS
    'Narrative description of the rhythm findings (the body of the report).';
COMMENT ON COLUMN holter_monitor_test_result.comparison_with_previous IS
    'Comparison with relevant previous ambulatory ECG studies.';
COMMENT ON COLUMN holter_monitor_test_result.impression IS
    'Summary impression / conclusion answering the clinical question.';
COMMENT ON COLUMN holter_monitor_test_result.reporting_category IS
    'Free-text structured-reporting category label (e.g. a rhythm or AF-burden category).';
COMMENT ON COLUMN holter_monitor_test_result.recommended_follow_up IS
    'Recommended follow-up monitoring, referral, or management.';
COMMENT ON COLUMN holter_monitor_test_result.critical_result_communicated IS
    'Whether a critical or unexpected significant result was communicated directly to the referrer.';
COMMENT ON COLUMN holter_monitor_test_result.reported_to IS
    'Who the critical / urgent result was communicated to, with date and time if applicable.';
