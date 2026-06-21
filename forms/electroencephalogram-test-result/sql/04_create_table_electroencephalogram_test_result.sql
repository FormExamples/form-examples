-- Electroencephalogram (EEG) test result (report) — the source-of-truth record.

CREATE TABLE electroencephalogram_test_result (
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
    eeg_type VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (eeg_type IN ('routine-awake', 'sleep-deprived', 'ambulatory-24h', 'video-telemetry', 'other', '')),
    recording_duration_minutes NUMERIC(7,1)
        CHECK (recording_duration_minutes IS NULL OR recording_duration_minutes BETWEEN 0 AND 100000),
    recording_quality VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (recording_quality IN ('good', 'adequate', 'limited', '')),

    -- Clinical context
    clinical_history VARCHAR(1000) NOT NULL DEFAULT '',
    comparison_with_previous VARCHAR(1000) NOT NULL DEFAULT '',

    -- Background and structured findings
    background_rhythm VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (background_rhythm IN ('normal', 'excess-slow', 'asymmetric', 'abnormal', '')),
    epileptiform_discharges BOOLEAN NOT NULL DEFAULT FALSE,
    focal_slowing BOOLEAN NOT NULL DEFAULT FALSE,
    generalised_slowing BOOLEAN NOT NULL DEFAULT FALSE,
    seizure_recorded BOOLEAN NOT NULL DEFAULT FALSE,
    status_epilepticus BOOLEAN NOT NULL DEFAULT FALSE,
    photoparoxysmal_response BOOLEAN NOT NULL DEFAULT FALSE,
    normal_eeg BOOLEAN NOT NULL DEFAULT FALSE,

    -- Narrative interpretation
    findings_narrative VARCHAR(2000) NOT NULL DEFAULT '',
    clinical_correlation VARCHAR(2000) NOT NULL DEFAULT '',
    impression VARCHAR(2000) NOT NULL DEFAULT '',
    reporting_category VARCHAR(100) NOT NULL DEFAULT '',

    -- Conclusion and follow-up
    recommended_follow_up VARCHAR(1000) NOT NULL DEFAULT '',

    -- Critical-result communication
    critical_result_communicated BOOLEAN NOT NULL DEFAULT FALSE,
    reported_to VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX index_electroencephalogram_test_result_patient_id
    ON electroencephalogram_test_result(patient_id);
CREATE INDEX index_electroencephalogram_test_result_clinician_id
    ON electroencephalogram_test_result(clinician_id);

CREATE TRIGGER trigger_electroencephalogram_test_result_updated_at
    BEFORE UPDATE ON electroencephalogram_test_result
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE electroencephalogram_test_result IS
    'Electroencephalogram (EEG) test result (report). Captures the performed recording (EEG type, duration, quality), the clinical history, the background rhythm and structured neurophysiological findings, the narrative interpretation and clinical correlation, the impression and structured-reporting category, recommended follow-up, and critical-result communication. This is the source-of-truth record that the four-axis interpretation grade is computed from.';
COMMENT ON COLUMN electroencephalogram_test_result.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN electroencephalogram_test_result.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN electroencephalogram_test_result.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN electroencephalogram_test_result.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN electroencephalogram_test_result.patient_id IS
    'Foreign key to the patient.';
COMMENT ON COLUMN electroencephalogram_test_result.clinician_id IS
    'Foreign key to the reporting clinician (neurologist / clinical neurophysiologist / physiologist).';
COMMENT ON COLUMN electroencephalogram_test_result.originating_request_reference IS
    'Free-text reference linking this report back to the originating EEG request (referral).';
COMMENT ON COLUMN electroencephalogram_test_result.report_status IS
    'Report lifecycle status: preliminary, final, amended, cancelled.';
COMMENT ON COLUMN electroencephalogram_test_result.performed_date IS
    'Date the EEG recording was performed.';
COMMENT ON COLUMN electroencephalogram_test_result.reported_date IS
    'Date the report was authored / signed.';
COMMENT ON COLUMN electroencephalogram_test_result.eeg_type IS
    'Performed EEG type: routine-awake, sleep-deprived, ambulatory-24h, video-telemetry, other.';
COMMENT ON COLUMN electroencephalogram_test_result.recording_duration_minutes IS
    'Total EEG recording duration in minutes.';
COMMENT ON COLUMN electroencephalogram_test_result.recording_quality IS
    'Technical quality / interpretability of the recording: good, adequate, limited.';
COMMENT ON COLUMN electroencephalogram_test_result.clinical_history IS
    'Clinical history and the question the EEG was performed to answer.';
COMMENT ON COLUMN electroencephalogram_test_result.comparison_with_previous IS
    'Comparison with relevant previous EEG studies.';
COMMENT ON COLUMN electroencephalogram_test_result.background_rhythm IS
    'Background EEG rhythm assessment: normal, excess-slow, asymmetric, abnormal.';
COMMENT ON COLUMN electroencephalogram_test_result.epileptiform_discharges IS
    'Whether interictal epileptiform discharges (spikes, sharp waves, spike-and-wave) are present.';
COMMENT ON COLUMN electroencephalogram_test_result.focal_slowing IS
    'Whether focal (localised) slowing is present.';
COMMENT ON COLUMN electroencephalogram_test_result.generalised_slowing IS
    'Whether generalised slowing (diffuse cerebral dysfunction) is present.';
COMMENT ON COLUMN electroencephalogram_test_result.seizure_recorded IS
    'Whether an electrographic and/or clinical seizure was captured during the recording.';
COMMENT ON COLUMN electroencephalogram_test_result.status_epilepticus IS
    'Whether status epilepticus (including non-convulsive status) was recorded — a critical finding.';
COMMENT ON COLUMN electroencephalogram_test_result.photoparoxysmal_response IS
    'Whether a photoparoxysmal response to intermittent photic stimulation is present.';
COMMENT ON COLUMN electroencephalogram_test_result.normal_eeg IS
    'Whether the recording is reported as a normal EEG.';
COMMENT ON COLUMN electroencephalogram_test_result.findings_narrative IS
    'Narrative description of the EEG findings (the body of the report).';
COMMENT ON COLUMN electroencephalogram_test_result.clinical_correlation IS
    'Correlation of the EEG findings with the clinical context and question.';
COMMENT ON COLUMN electroencephalogram_test_result.impression IS
    'Summary impression / conclusion answering the clinical question.';
COMMENT ON COLUMN electroencephalogram_test_result.reporting_category IS
    'Free-text structured-reporting category label (e.g. a SCORE category or local epileptiform-classification label).';
COMMENT ON COLUMN electroencephalogram_test_result.recommended_follow_up IS
    'Recommended follow-up recording, referral, or management.';
COMMENT ON COLUMN electroencephalogram_test_result.critical_result_communicated IS
    'Whether a critical or unexpected significant result was communicated directly to the referrer / clinical team.';
COMMENT ON COLUMN electroencephalogram_test_result.reported_to IS
    'Who the critical / urgent result was communicated to, with date and time if applicable.';
