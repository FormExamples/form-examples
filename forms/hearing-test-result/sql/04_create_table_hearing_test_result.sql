-- Audiology / hearing test result (report) — the source-of-truth record.

CREATE TABLE hearing_test_result (
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
        CHECK (test_type IN ('pure-tone-audiometry', 'tympanometry', 'speech-audiometry', 'otoacoustic-emissions', 'auditory-brainstem-response', 'newborn-hearing-screen', 'other', '')),
    test_reliability VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (test_reliability IN ('good', 'fair', 'poor', '')),

    -- Clinical context
    clinical_history VARCHAR(1000) NOT NULL DEFAULT '',

    -- Pure-tone audiometry summary
    pure_tone_average_right_db NUMERIC(5,1)
        CHECK (pure_tone_average_right_db IS NULL OR pure_tone_average_right_db BETWEEN -10 AND 130),
    pure_tone_average_left_db NUMERIC(5,1)
        CHECK (pure_tone_average_left_db IS NULL OR pure_tone_average_left_db BETWEEN -10 AND 130),

    -- Interpretation: hearing-loss type per ear
    hearing_loss_type_right VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (hearing_loss_type_right IN ('none', 'conductive', 'sensorineural', 'mixed', '')),
    hearing_loss_type_left VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (hearing_loss_type_left IN ('none', 'conductive', 'sensorineural', 'mixed', '')),

    -- Interpretation: hearing-loss severity per ear (BSA descriptors)
    hearing_loss_severity_right VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (hearing_loss_severity_right IN ('normal', 'mild', 'moderate', 'moderately-severe', 'severe', 'profound', '')),
    hearing_loss_severity_left VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (hearing_loss_severity_left IN ('normal', 'mild', 'moderate', 'moderately-severe', 'severe', 'profound', '')),

    -- Tympanometry type per ear (Jerger classification)
    tympanometry_type_right VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (tympanometry_type_right IN ('A', 'As', 'Ad', 'B', 'C', '')),
    tympanometry_type_left VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (tympanometry_type_left IN ('A', 'As', 'Ad', 'B', 'C', '')),

    -- Structured findings
    hearing_loss_present BOOLEAN NOT NULL DEFAULT FALSE,
    asymmetric_loss BOOLEAN NOT NULL DEFAULT FALSE,
    sudden_sensorineural_loss BOOLEAN NOT NULL DEFAULT FALSE,
    conductive_component BOOLEAN NOT NULL DEFAULT FALSE,
    normal_hearing BOOLEAN NOT NULL DEFAULT FALSE,

    -- Narrative and impression
    findings_narrative VARCHAR(2000) NOT NULL DEFAULT '',
    impression VARCHAR(2000) NOT NULL DEFAULT '',
    reporting_category VARCHAR(50) NOT NULL DEFAULT '',

    -- Follow-up
    recommended_follow_up VARCHAR(1000) NOT NULL DEFAULT '',

    -- Critical-result communication
    critical_result_communicated BOOLEAN NOT NULL DEFAULT FALSE,
    reported_to VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX index_hearing_test_result_patient_id
    ON hearing_test_result(patient_id);
CREATE INDEX index_hearing_test_result_clinician_id
    ON hearing_test_result(clinician_id);

CREATE TRIGGER trigger_hearing_test_result_updated_at
    BEFORE UPDATE ON hearing_test_result
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE hearing_test_result IS
    'Audiology / hearing test result (report). Captures the performed test, test reliability, clinical history, the pure-tone averages and per-ear interpretation (loss type and severity), tympanometry types, the narrative and structured findings, the impression, recommended follow-up, and critical-result communication. This is the source-of-truth record that the four-axis interpretation grade is computed from.';
COMMENT ON COLUMN hearing_test_result.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN hearing_test_result.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN hearing_test_result.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN hearing_test_result.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN hearing_test_result.patient_id IS
    'Foreign key to the patient.';
COMMENT ON COLUMN hearing_test_result.clinician_id IS
    'Foreign key to the reporting clinician (audiologist / ENT surgeon / hearing therapist).';
COMMENT ON COLUMN hearing_test_result.originating_request_reference IS
    'Free-text reference linking this report back to the originating hearing test request (referral).';
COMMENT ON COLUMN hearing_test_result.report_status IS
    'Report lifecycle status: preliminary, final, amended, cancelled.';
COMMENT ON COLUMN hearing_test_result.performed_date IS
    'Date the hearing test was performed.';
COMMENT ON COLUMN hearing_test_result.reported_date IS
    'Date the report was authored / signed.';
COMMENT ON COLUMN hearing_test_result.test_type IS
    'Performed audiology test type: pure-tone-audiometry, tympanometry, speech-audiometry, otoacoustic-emissions, auditory-brainstem-response, newborn-hearing-screen, other.';
COMMENT ON COLUMN hearing_test_result.test_reliability IS
    'Reliability / validity of the test result: good, fair, poor (e.g. patient cooperation, masking, test conditions).';
COMMENT ON COLUMN hearing_test_result.clinical_history IS
    'Clinical history and the question the test was performed to answer.';
COMMENT ON COLUMN hearing_test_result.pure_tone_average_right_db IS
    'Right-ear pure-tone average (PTA) in dB HL (BSA: mean of thresholds across the standard frequencies; no-response frequencies counted at 130 dB HL).';
COMMENT ON COLUMN hearing_test_result.pure_tone_average_left_db IS
    'Left-ear pure-tone average (PTA) in dB HL (BSA: mean of thresholds across the standard frequencies; no-response frequencies counted at 130 dB HL).';
COMMENT ON COLUMN hearing_test_result.hearing_loss_type_right IS
    'Right-ear hearing-loss type: none, conductive, sensorineural, mixed.';
COMMENT ON COLUMN hearing_test_result.hearing_loss_type_left IS
    'Left-ear hearing-loss type: none, conductive, sensorineural, mixed.';
COMMENT ON COLUMN hearing_test_result.hearing_loss_severity_right IS
    'Right-ear hearing-loss severity (BSA descriptors): normal, mild, moderate, moderately-severe, severe, profound.';
COMMENT ON COLUMN hearing_test_result.hearing_loss_severity_left IS
    'Left-ear hearing-loss severity (BSA descriptors): normal, mild, moderate, moderately-severe, severe, profound.';
COMMENT ON COLUMN hearing_test_result.tympanometry_type_right IS
    'Right-ear tympanogram type (Jerger): A, As, Ad, B, C.';
COMMENT ON COLUMN hearing_test_result.tympanometry_type_left IS
    'Left-ear tympanogram type (Jerger): A, As, Ad, B, C.';
COMMENT ON COLUMN hearing_test_result.hearing_loss_present IS
    'Whether any hearing loss is present on this test.';
COMMENT ON COLUMN hearing_test_result.asymmetric_loss IS
    'Whether there is a marked asymmetry between ears (red flag for retrocochlear pathology).';
COMMENT ON COLUMN hearing_test_result.sudden_sensorineural_loss IS
    'Whether the result is consistent with sudden sensorineural hearing loss (otological emergency).';
COMMENT ON COLUMN hearing_test_result.conductive_component IS
    'Whether a conductive component is present (e.g. air-bone gap, abnormal tympanometry).';
COMMENT ON COLUMN hearing_test_result.normal_hearing IS
    'Whether the test demonstrates normal hearing bilaterally.';
COMMENT ON COLUMN hearing_test_result.findings_narrative IS
    'Narrative description of the audiometric findings (the body of the report).';
COMMENT ON COLUMN hearing_test_result.impression IS
    'Summary impression / conclusion answering the clinical question.';
COMMENT ON COLUMN hearing_test_result.reporting_category IS
    'Free-text structured-reporting category label (e.g. a configuration or audiometric descriptor).';
COMMENT ON COLUMN hearing_test_result.recommended_follow_up IS
    'Recommended follow-up testing, referral, or management (e.g. hearing-aid fitting, ENT referral, MRI IAM).';
COMMENT ON COLUMN hearing_test_result.critical_result_communicated IS
    'Whether a critical or unexpected significant result was communicated directly to the referrer.';
COMMENT ON COLUMN hearing_test_result.reported_to IS
    'Who the critical / urgent result was communicated to, with date and time if applicable.';
