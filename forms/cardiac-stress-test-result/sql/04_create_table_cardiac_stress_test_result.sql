-- Cardiac stress / exercise test result (report) — the source-of-truth record.

CREATE TABLE cardiac_stress_test_result (
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
    test_type VARCHAR(40) NOT NULL DEFAULT ''
        CHECK (test_type IN ('exercise-treadmill-ecg', 'stress-echo', 'dobutamine-stress-echo', 'myocardial-perfusion-spect', 'stress-cardiac-mri', 'other', '')),
    protocol VARCHAR(255) NOT NULL DEFAULT '',

    -- Clinical context
    clinical_history VARCHAR(1000) NOT NULL DEFAULT '',
    comparison_with_previous VARCHAR(1000) NOT NULL DEFAULT '',

    -- Haemodynamic and exercise response
    maximum_heart_rate_bpm INTEGER
        CHECK (maximum_heart_rate_bpm IS NULL OR maximum_heart_rate_bpm BETWEEN 0 AND 300),
    percent_predicted_heart_rate NUMERIC(5,1)
        CHECK (percent_predicted_heart_rate IS NULL OR percent_predicted_heart_rate BETWEEN 0 AND 200),
    exercise_duration_minutes NUMERIC(5,1)
        CHECK (exercise_duration_minutes IS NULL OR exercise_duration_minutes BETWEEN 0 AND 120),
    mets_achieved NUMERIC(4,1)
        CHECK (mets_achieved IS NULL OR mets_achieved BETWEEN 0 AND 30),
    peak_blood_pressure VARCHAR(20) NOT NULL DEFAULT '',
    blood_pressure_response VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (blood_pressure_response IN ('normal', 'hypertensive', 'hypotensive', 'flat', '')),

    -- Structured findings
    ischaemic_st_changes BOOLEAN NOT NULL DEFAULT FALSE,
    chest_pain_induced BOOLEAN NOT NULL DEFAULT FALSE,
    arrhythmia_induced BOOLEAN NOT NULL DEFAULT FALSE,
    terminated_early BOOLEAN NOT NULL DEFAULT FALSE,
    test_positive BOOLEAN NOT NULL DEFAULT FALSE,
    test_negative BOOLEAN NOT NULL DEFAULT FALSE,
    test_inconclusive BOOLEAN NOT NULL DEFAULT FALSE,
    reason_for_termination VARCHAR(1000) NOT NULL DEFAULT '',

    -- Prognostic score
    duke_treadmill_score NUMERIC(5,1)
        CHECK (duke_treadmill_score IS NULL OR duke_treadmill_score BETWEEN -25 AND 15),

    -- Impression and follow-up
    impression VARCHAR(2000) NOT NULL DEFAULT '',
    reporting_category VARCHAR(50) NOT NULL DEFAULT '',
    recommended_follow_up VARCHAR(1000) NOT NULL DEFAULT '',

    -- Critical-result communication
    critical_result_communicated BOOLEAN NOT NULL DEFAULT FALSE,
    reported_to VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX index_cardiac_stress_test_result_patient_id
    ON cardiac_stress_test_result(patient_id);
CREATE INDEX index_cardiac_stress_test_result_clinician_id
    ON cardiac_stress_test_result(clinician_id);

CREATE TRIGGER trigger_cardiac_stress_test_result_updated_at
    BEFORE UPDATE ON cardiac_stress_test_result
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE cardiac_stress_test_result IS
    'Cardiac stress / exercise test result (report). Captures the performed test type and protocol, the clinical history, the haemodynamic and exercise response (peak heart rate, percent-predicted heart rate, exercise duration, METs, blood-pressure response), the structured ECG / symptom / arrhythmia findings, the overall positive / negative / inconclusive conclusion, the Duke treadmill prognostic score, the impression and recommended follow-up, and critical-result communication. This is the source-of-truth record that the four-axis interpretation grade is computed from.';
COMMENT ON COLUMN cardiac_stress_test_result.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN cardiac_stress_test_result.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN cardiac_stress_test_result.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN cardiac_stress_test_result.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN cardiac_stress_test_result.patient_id IS
    'Foreign key to the patient.';
COMMENT ON COLUMN cardiac_stress_test_result.clinician_id IS
    'Foreign key to the reporting clinician (cardiologist / cardiac physiologist).';
COMMENT ON COLUMN cardiac_stress_test_result.originating_request_reference IS
    'Free-text reference linking this report back to the originating cardiac stress test request (referral).';
COMMENT ON COLUMN cardiac_stress_test_result.report_status IS
    'Report lifecycle status: preliminary, final, amended, cancelled.';
COMMENT ON COLUMN cardiac_stress_test_result.performed_date IS
    'Date the stress test was performed.';
COMMENT ON COLUMN cardiac_stress_test_result.reported_date IS
    'Date the report was authored / signed.';
COMMENT ON COLUMN cardiac_stress_test_result.test_type IS
    'Performed stress-test modality: exercise-treadmill-ecg, stress-echo, dobutamine-stress-echo, myocardial-perfusion-spect, stress-cardiac-mri, other.';
COMMENT ON COLUMN cardiac_stress_test_result.protocol IS
    'Exercise / stress protocol used (e.g. Bruce, modified Bruce, dobutamine infusion, vasodilator).';
COMMENT ON COLUMN cardiac_stress_test_result.clinical_history IS
    'Clinical history and the question the test was performed to answer.';
COMMENT ON COLUMN cardiac_stress_test_result.comparison_with_previous IS
    'Comparison with relevant previous stress tests or imaging.';
COMMENT ON COLUMN cardiac_stress_test_result.maximum_heart_rate_bpm IS
    'Maximum heart rate achieved during the test, in beats per minute.';
COMMENT ON COLUMN cardiac_stress_test_result.percent_predicted_heart_rate IS
    'Percentage of the age-predicted maximum heart rate achieved (target ≥85% for an adequate exercise test).';
COMMENT ON COLUMN cardiac_stress_test_result.exercise_duration_minutes IS
    'Total exercise duration in minutes (a term in the Duke treadmill score).';
COMMENT ON COLUMN cardiac_stress_test_result.mets_achieved IS
    'Peak metabolic equivalents (METs) achieved, a measure of functional capacity.';
COMMENT ON COLUMN cardiac_stress_test_result.peak_blood_pressure IS
    'Peak blood pressure recorded during the test (free text, e.g. "180/90").';
COMMENT ON COLUMN cardiac_stress_test_result.blood_pressure_response IS
    'Blood-pressure response to exercise: normal, hypertensive, hypotensive (exertional hypotension), flat.';
COMMENT ON COLUMN cardiac_stress_test_result.ischaemic_st_changes IS
    'Whether ischaemic ST-segment changes (depression or elevation) were induced.';
COMMENT ON COLUMN cardiac_stress_test_result.chest_pain_induced IS
    'Whether typical / limiting chest pain (angina) was induced during the test.';
COMMENT ON COLUMN cardiac_stress_test_result.arrhythmia_induced IS
    'Whether a significant arrhythmia was induced during the test.';
COMMENT ON COLUMN cardiac_stress_test_result.terminated_early IS
    'Whether the test was terminated early before the target endpoint was reached.';
COMMENT ON COLUMN cardiac_stress_test_result.test_positive IS
    'Whether the overall conclusion is positive (evidence of inducible ischaemia).';
COMMENT ON COLUMN cardiac_stress_test_result.test_negative IS
    'Whether the overall conclusion is negative (no evidence of inducible ischaemia).';
COMMENT ON COLUMN cardiac_stress_test_result.test_inconclusive IS
    'Whether the overall conclusion is inconclusive / non-diagnostic (e.g. submaximal, uninterpretable ECG).';
COMMENT ON COLUMN cardiac_stress_test_result.reason_for_termination IS
    'Reason the test was stopped (target heart rate reached, fatigue, chest pain, ST changes, arrhythmia, exertional hypotension, etc.).';
COMMENT ON COLUMN cardiac_stress_test_result.duke_treadmill_score IS
    'Duke treadmill score = exercise minutes − (5 × ST deviation mm) − (4 × angina index); range about −25 (highest risk) to +15 (lowest risk). ≥+5 low risk, −10 to +4 intermediate risk, ≤−11 high risk.';
COMMENT ON COLUMN cardiac_stress_test_result.impression IS
    'Summary impression / conclusion answering the clinical question.';
COMMENT ON COLUMN cardiac_stress_test_result.reporting_category IS
    'Free-text structured risk category label derived from the result (e.g. "low risk", "high-risk Duke score", "non-diagnostic").';
COMMENT ON COLUMN cardiac_stress_test_result.recommended_follow_up IS
    'Recommended follow-up: further imaging, coronary angiography, optimise medical therapy, referral, or routine.';
COMMENT ON COLUMN cardiac_stress_test_result.critical_result_communicated IS
    'Whether a critical or unexpected significant result was communicated directly to the referrer / responsible team.';
COMMENT ON COLUMN cardiac_stress_test_result.reported_to IS
    'Who the critical / urgent result was communicated to, with date and time if applicable.';
