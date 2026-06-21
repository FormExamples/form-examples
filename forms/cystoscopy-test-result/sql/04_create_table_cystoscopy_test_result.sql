-- Cystoscopy (bladder endoscopy) result (report) — the source-of-truth record.

CREATE TABLE cystoscopy_test_result (
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

    -- Procedure
    procedure VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (procedure IN ('flexible-cystoscopy', 'rigid-cystoscopy', 'other', '')),
    anaesthesia VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (anaesthesia IN ('local', 'sedation', 'general', '')),

    -- Clinical context
    clinical_history VARCHAR(1000) NOT NULL DEFAULT '',

    -- Structured findings
    bladder_tumour BOOLEAN NOT NULL DEFAULT FALSE,
    inflammation_cystitis BOOLEAN NOT NULL DEFAULT FALSE,
    bladder_stones BOOLEAN NOT NULL DEFAULT FALSE,
    urethral_stricture BOOLEAN NOT NULL DEFAULT FALSE,
    trabeculation BOOLEAN NOT NULL DEFAULT FALSE,
    prostatic_enlargement BOOLEAN NOT NULL DEFAULT FALSE,
    normal_examination BOOLEAN NOT NULL DEFAULT FALSE,

    -- Tumour / lesion detail
    tumour_size_mm NUMERIC(6,1)
        CHECK (tumour_size_mm IS NULL OR tumour_size_mm BETWEEN 0 AND 500),
    tumour_appearance VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (tumour_appearance IN ('papillary', 'solid', 'flat', 'not-applicable', '')),
    biopsy_taken BOOLEAN NOT NULL DEFAULT FALSE,

    -- Complication
    complication VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (complication IN ('none', 'bleeding', 'perforation', 'uti', 'other', '')),

    -- Narrative and conclusion
    findings_narrative VARCHAR(2000) NOT NULL DEFAULT '',
    impression VARCHAR(2000) NOT NULL DEFAULT '',
    reporting_category VARCHAR(50) NOT NULL DEFAULT '',
    recommended_follow_up VARCHAR(1000) NOT NULL DEFAULT '',

    -- Critical-result communication
    critical_result_communicated BOOLEAN NOT NULL DEFAULT FALSE,
    reported_to VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX index_cystoscopy_test_result_patient_id
    ON cystoscopy_test_result(patient_id);
CREATE INDEX index_cystoscopy_test_result_clinician_id
    ON cystoscopy_test_result(clinician_id);

CREATE TRIGGER trigger_cystoscopy_test_result_updated_at
    BEFORE UPDATE ON cystoscopy_test_result
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE cystoscopy_test_result IS
    'Cystoscopy (bladder endoscopy) result (report). Captures the performed procedure and anaesthesia, the clinical history, the narrative and structured endoscopic findings, tumour / lesion detail, any complication, the impression, recommended follow-up, and critical-result communication. This is the source-of-truth record that the four-axis interpretation grade is computed from.';
COMMENT ON COLUMN cystoscopy_test_result.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN cystoscopy_test_result.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN cystoscopy_test_result.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN cystoscopy_test_result.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN cystoscopy_test_result.patient_id IS
    'Foreign key to the patient.';
COMMENT ON COLUMN cystoscopy_test_result.clinician_id IS
    'Foreign key to the operating / reporting clinician (cystoscopy operator).';
COMMENT ON COLUMN cystoscopy_test_result.originating_request_reference IS
    'Free-text reference linking this report back to the originating cystoscopy request (referral).';
COMMENT ON COLUMN cystoscopy_test_result.report_status IS
    'Report lifecycle status: preliminary, final, amended, cancelled.';
COMMENT ON COLUMN cystoscopy_test_result.performed_date IS
    'Date the cystoscopy was performed.';
COMMENT ON COLUMN cystoscopy_test_result.reported_date IS
    'Date the report was authored / signed.';
COMMENT ON COLUMN cystoscopy_test_result.procedure IS
    'Performed procedure: flexible-cystoscopy, rigid-cystoscopy, other.';
COMMENT ON COLUMN cystoscopy_test_result.anaesthesia IS
    'Anaesthesia used: local, sedation, general.';
COMMENT ON COLUMN cystoscopy_test_result.clinical_history IS
    'Clinical history and the question the examination was performed to answer.';
COMMENT ON COLUMN cystoscopy_test_result.bladder_tumour IS
    'Whether a bladder tumour or suspicious lesion was seen.';
COMMENT ON COLUMN cystoscopy_test_result.inflammation_cystitis IS
    'Whether inflammation / cystitis was seen.';
COMMENT ON COLUMN cystoscopy_test_result.bladder_stones IS
    'Whether bladder stones (calculi) were seen.';
COMMENT ON COLUMN cystoscopy_test_result.urethral_stricture IS
    'Whether a urethral stricture was seen.';
COMMENT ON COLUMN cystoscopy_test_result.trabeculation IS
    'Whether bladder-wall trabeculation was seen.';
COMMENT ON COLUMN cystoscopy_test_result.prostatic_enlargement IS
    'Whether prostatic enlargement / obstruction was seen.';
COMMENT ON COLUMN cystoscopy_test_result.normal_examination IS
    'Whether the examination was entirely normal with no abnormality seen.';
COMMENT ON COLUMN cystoscopy_test_result.tumour_size_mm IS
    'Largest tumour / lesion size in millimetres, for categorisation and surveillance.';
COMMENT ON COLUMN cystoscopy_test_result.tumour_appearance IS
    'Tumour appearance: papillary, solid, flat, not-applicable.';
COMMENT ON COLUMN cystoscopy_test_result.biopsy_taken IS
    'Whether a biopsy / sample was taken at the time of the procedure.';
COMMENT ON COLUMN cystoscopy_test_result.complication IS
    'Procedure complication: none, bleeding, perforation, uti, other.';
COMMENT ON COLUMN cystoscopy_test_result.findings_narrative IS
    'Narrative description of the endoscopic findings (the body of the report).';
COMMENT ON COLUMN cystoscopy_test_result.impression IS
    'Summary impression / conclusion answering the clinical question.';
COMMENT ON COLUMN cystoscopy_test_result.reporting_category IS
    'Free-text structured-reporting category label (e.g. an EAU NMIBC risk group or a suspected-tumour category).';
COMMENT ON COLUMN cystoscopy_test_result.recommended_follow_up IS
    'Recommended follow-up: surveillance cystoscopy interval, referral, or further management.';
COMMENT ON COLUMN cystoscopy_test_result.critical_result_communicated IS
    'Whether a critical or unexpected significant result (e.g. suspected bladder tumour) was communicated directly to the referrer / patient.';
COMMENT ON COLUMN cystoscopy_test_result.reported_to IS
    'Who the critical / urgent result was communicated to, with date and time if applicable.';
