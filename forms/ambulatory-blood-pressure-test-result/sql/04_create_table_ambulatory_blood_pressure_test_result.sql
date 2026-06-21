-- Ambulatory blood pressure (ABPM) test result (report) — the source-of-truth record.

CREATE TABLE ambulatory_blood_pressure_test_result (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    patient_id UUID NOT NULL REFERENCES patient(id) ON DELETE CASCADE,
    clinician_id UUID NOT NULL REFERENCES clinician(id) ON DELETE CASCADE,

    -- Report identification
    originating_request_reference VARCHAR(255) NOT NULL DEFAULT '',
    monitoring_type VARCHAR(40) NOT NULL DEFAULT ''
        CHECK (monitoring_type IN ('24-hour-abpm', 'home-blood-pressure-monitoring', 'other', '')),
    report_status VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (report_status IN ('preliminary', 'final', 'amended', 'cancelled', '')),
    performed_date DATE,
    reported_date DATE,

    -- Recording adequacy
    valid_readings_percent NUMERIC(5,1)
        CHECK (valid_readings_percent IS NULL OR valid_readings_percent BETWEEN 0 AND 100),
    recording_adequate BOOLEAN NOT NULL DEFAULT FALSE,

    -- Clinical context
    clinical_history VARCHAR(1000) NOT NULL DEFAULT '',

    -- Averaged measurements (mmHg)
    daytime_average_systolic NUMERIC(5,1)
        CHECK (daytime_average_systolic IS NULL OR daytime_average_systolic BETWEEN 50 AND 300),
    daytime_average_diastolic NUMERIC(5,1)
        CHECK (daytime_average_diastolic IS NULL OR daytime_average_diastolic BETWEEN 20 AND 200),
    nighttime_average_systolic NUMERIC(5,1)
        CHECK (nighttime_average_systolic IS NULL OR nighttime_average_systolic BETWEEN 50 AND 300),
    nighttime_average_diastolic NUMERIC(5,1)
        CHECK (nighttime_average_diastolic IS NULL OR nighttime_average_diastolic BETWEEN 20 AND 200),
    twenty_four_hour_average_systolic NUMERIC(5,1)
        CHECK (twenty_four_hour_average_systolic IS NULL OR twenty_four_hour_average_systolic BETWEEN 50 AND 300),
    twenty_four_hour_average_diastolic NUMERIC(5,1)
        CHECK (twenty_four_hour_average_diastolic IS NULL OR twenty_four_hour_average_diastolic BETWEEN 20 AND 200),

    -- Nocturnal dipping
    nocturnal_dip_percent NUMERIC(5,1)
        CHECK (nocturnal_dip_percent IS NULL OR nocturnal_dip_percent BETWEEN -100 AND 100),
    dipper_status VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (dipper_status IN ('dipper', 'non-dipper', 'reverse-dipper', 'extreme-dipper', '')),

    -- Structured interpretation booleans
    hypertension_confirmed BOOLEAN NOT NULL DEFAULT FALSE,
    white_coat_effect BOOLEAN NOT NULL DEFAULT FALSE,
    masked_hypertension BOOLEAN NOT NULL DEFAULT FALSE,
    severe_hypertension BOOLEAN NOT NULL DEFAULT FALSE,
    nocturnal_hypertension BOOLEAN NOT NULL DEFAULT FALSE,
    normal_study BOOLEAN NOT NULL DEFAULT FALSE,

    -- Findings and conclusion
    findings_narrative VARCHAR(2000) NOT NULL DEFAULT '',
    comparison_with_previous VARCHAR(1000) NOT NULL DEFAULT '',
    impression VARCHAR(2000) NOT NULL DEFAULT '',
    reporting_category VARCHAR(50) NOT NULL DEFAULT '',
    recommended_follow_up VARCHAR(1000) NOT NULL DEFAULT '',

    -- Critical-result communication
    critical_result_communicated BOOLEAN NOT NULL DEFAULT FALSE,
    reported_to VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX index_ambulatory_blood_pressure_test_result_patient_id
    ON ambulatory_blood_pressure_test_result(patient_id);
CREATE INDEX index_ambulatory_blood_pressure_test_result_clinician_id
    ON ambulatory_blood_pressure_test_result(clinician_id);

CREATE TRIGGER trigger_ambulatory_blood_pressure_test_result_updated_at
    BEFORE UPDATE ON ambulatory_blood_pressure_test_result
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE ambulatory_blood_pressure_test_result IS
    'Ambulatory blood pressure monitoring (ABPM) result (report). Captures the monitoring type, recording adequacy, clinical history, the daytime / nighttime / 24-hour averaged blood pressures, the nocturnal dip and dipper status, the narrative and structured interpretation, the impression, and critical-result communication. This is the source-of-truth record that the four-axis interpretation grade is computed from.';
COMMENT ON COLUMN ambulatory_blood_pressure_test_result.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN ambulatory_blood_pressure_test_result.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN ambulatory_blood_pressure_test_result.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN ambulatory_blood_pressure_test_result.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN ambulatory_blood_pressure_test_result.patient_id IS
    'Foreign key to the patient.';
COMMENT ON COLUMN ambulatory_blood_pressure_test_result.clinician_id IS
    'Foreign key to the reporting clinician (report author/signer).';
COMMENT ON COLUMN ambulatory_blood_pressure_test_result.originating_request_reference IS
    'Free-text reference linking this report back to the originating ABPM request (referral).';
COMMENT ON COLUMN ambulatory_blood_pressure_test_result.monitoring_type IS
    'Monitoring modality reported: 24-hour-abpm, home-blood-pressure-monitoring, other.';
COMMENT ON COLUMN ambulatory_blood_pressure_test_result.report_status IS
    'Report lifecycle status: preliminary, final, amended, cancelled.';
COMMENT ON COLUMN ambulatory_blood_pressure_test_result.performed_date IS
    'Date the monitoring period was performed (recording start).';
COMMENT ON COLUMN ambulatory_blood_pressure_test_result.reported_date IS
    'Date the report was authored / signed.';
COMMENT ON COLUMN ambulatory_blood_pressure_test_result.valid_readings_percent IS
    'Percentage of valid (successful) readings captured over the monitoring period; ABPM is generally considered adequate at >= 70% valid readings.';
COMMENT ON COLUMN ambulatory_blood_pressure_test_result.recording_adequate IS
    'Whether the recording met the adequacy threshold for a diagnostic interpretation.';
COMMENT ON COLUMN ambulatory_blood_pressure_test_result.clinical_history IS
    'Clinical history and the question the monitoring was performed to answer.';
COMMENT ON COLUMN ambulatory_blood_pressure_test_result.daytime_average_systolic IS
    'Daytime (waking-hours) average systolic blood pressure in mmHg; ABPM daytime average >= 135/85 confirms hypertension (NICE NG136).';
COMMENT ON COLUMN ambulatory_blood_pressure_test_result.daytime_average_diastolic IS
    'Daytime (waking-hours) average diastolic blood pressure in mmHg; ABPM daytime average >= 135/85 confirms hypertension (NICE NG136).';
COMMENT ON COLUMN ambulatory_blood_pressure_test_result.nighttime_average_systolic IS
    'Nighttime (asleep) average systolic blood pressure in mmHg; nocturnal hypertension is >= 120/70.';
COMMENT ON COLUMN ambulatory_blood_pressure_test_result.nighttime_average_diastolic IS
    'Nighttime (asleep) average diastolic blood pressure in mmHg; nocturnal hypertension is >= 120/70.';
COMMENT ON COLUMN ambulatory_blood_pressure_test_result.twenty_four_hour_average_systolic IS
    'Whole 24-hour average systolic blood pressure in mmHg; 24-hour average >= 130/80 indicates hypertension.';
COMMENT ON COLUMN ambulatory_blood_pressure_test_result.twenty_four_hour_average_diastolic IS
    'Whole 24-hour average diastolic blood pressure in mmHg; 24-hour average >= 130/80 indicates hypertension.';
COMMENT ON COLUMN ambulatory_blood_pressure_test_result.nocturnal_dip_percent IS
    'Percentage fall in average systolic blood pressure from daytime to nighttime; drives dipper status.';
COMMENT ON COLUMN ambulatory_blood_pressure_test_result.dipper_status IS
    'Nocturnal dipping pattern (ESH): dipper (>10-20% fall), non-dipper (>0-10%), reverse-dipper (<= 0%, a nighttime rise), extreme-dipper (>20%).';
COMMENT ON COLUMN ambulatory_blood_pressure_test_result.hypertension_confirmed IS
    'Whether the study confirms a diagnosis of hypertension on ABPM/HBPM averages.';
COMMENT ON COLUMN ambulatory_blood_pressure_test_result.white_coat_effect IS
    'Whether a white-coat effect is present (raised clinic BP but normal ambulatory averages).';
COMMENT ON COLUMN ambulatory_blood_pressure_test_result.masked_hypertension IS
    'Whether masked hypertension is present (normal clinic BP but raised ambulatory averages).';
COMMENT ON COLUMN ambulatory_blood_pressure_test_result.severe_hypertension IS
    'Whether the study shows severe hypertension (ABPM average >= 150/95, equivalent to clinic >= 180/120).';
COMMENT ON COLUMN ambulatory_blood_pressure_test_result.nocturnal_hypertension IS
    'Whether nocturnal hypertension is present (nighttime average >= 120/70).';
COMMENT ON COLUMN ambulatory_blood_pressure_test_result.normal_study IS
    'Whether the study is normal (all averages within normal limits and a normal dipping pattern).';
COMMENT ON COLUMN ambulatory_blood_pressure_test_result.findings_narrative IS
    'Narrative description of the monitoring findings (the body of the report).';
COMMENT ON COLUMN ambulatory_blood_pressure_test_result.comparison_with_previous IS
    'Comparison with relevant previous ambulatory or home monitoring studies.';
COMMENT ON COLUMN ambulatory_blood_pressure_test_result.impression IS
    'Summary impression / conclusion answering the clinical question.';
COMMENT ON COLUMN ambulatory_blood_pressure_test_result.reporting_category IS
    'Free-text structured-reporting category label (e.g. the hypertension stage: normotensive, stage 1, stage 2, severe).';
COMMENT ON COLUMN ambulatory_blood_pressure_test_result.recommended_follow_up IS
    'Recommended follow-up, treatment change, or referral.';
COMMENT ON COLUMN ambulatory_blood_pressure_test_result.critical_result_communicated IS
    'Whether a critical or unexpected significant result was communicated directly to the referrer.';
COMMENT ON COLUMN ambulatory_blood_pressure_test_result.reported_to IS
    'Who the critical / urgent result was communicated to, with date and time if applicable.';
