-- Fluoroscopy / contrast-study result (report) — the source-of-truth record.

CREATE TABLE fluoroscopy_test_result (
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
    study_type VARCHAR(40) NOT NULL DEFAULT ''
        CHECK (study_type IN ('barium-swallow', 'barium-meal', 'barium-follow-through', 'barium-enema', 'water-soluble-contrast-swallow', 'defecating-proctogram', 'hysterosalpingogram', 'micturating-cystourethrogram', 'arthrogram', 'fluoroscopy-guided-procedure', 'other', '')),
    contrast_used VARCHAR(25) NOT NULL DEFAULT ''
        CHECK (contrast_used IN ('barium', 'water-soluble-iodinated', 'none', '')),
    examination_adequacy VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (examination_adequacy IN ('adequate', 'limited', 'non-diagnostic', '')),
    screening_time_minutes NUMERIC(6,1)
        CHECK (screening_time_minutes IS NULL OR screening_time_minutes BETWEEN 0 AND 600),

    -- Clinical context
    clinical_history VARCHAR(1000) NOT NULL DEFAULT '',
    comparison_with_previous VARCHAR(1000) NOT NULL DEFAULT '',

    -- Findings
    findings_narrative VARCHAR(2000) NOT NULL DEFAULT '',
    stricture BOOLEAN NOT NULL DEFAULT FALSE,
    reflux BOOLEAN NOT NULL DEFAULT FALSE,
    obstruction BOOLEAN NOT NULL DEFAULT FALSE,
    perforation_or_leak BOOLEAN NOT NULL DEFAULT FALSE,
    fistula BOOLEAN NOT NULL DEFAULT FALSE,
    filling_defect BOOLEAN NOT NULL DEFAULT FALSE,
    dysmotility BOOLEAN NOT NULL DEFAULT FALSE,
    normal_study BOOLEAN NOT NULL DEFAULT FALSE,
    incidental_finding BOOLEAN NOT NULL DEFAULT FALSE,

    -- Impression and follow-up
    impression VARCHAR(2000) NOT NULL DEFAULT '',
    reporting_category VARCHAR(50) NOT NULL DEFAULT '',
    recommended_follow_up VARCHAR(1000) NOT NULL DEFAULT '',

    -- Critical-result communication
    critical_result_communicated BOOLEAN NOT NULL DEFAULT FALSE,
    reported_to VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX index_fluoroscopy_test_result_patient_id
    ON fluoroscopy_test_result(patient_id);
CREATE INDEX index_fluoroscopy_test_result_clinician_id
    ON fluoroscopy_test_result(clinician_id);

CREATE TRIGGER trigger_fluoroscopy_test_result_updated_at
    BEFORE UPDATE ON fluoroscopy_test_result
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE fluoroscopy_test_result IS
    'Fluoroscopy / contrast-study result (report). Captures the performed examination (barium / water-soluble / proctogram / hysterosalpingogram / cystourethrogram / arthrogram / fluoroscopy-guided procedure), the contrast used, screening time, clinical history, the narrative and structured findings, the impression and structured-reporting category, recommended follow-up, and critical-result communication. This is the source-of-truth record that the four-axis interpretation grade is computed from.';
COMMENT ON COLUMN fluoroscopy_test_result.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN fluoroscopy_test_result.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN fluoroscopy_test_result.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN fluoroscopy_test_result.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN fluoroscopy_test_result.patient_id IS
    'Foreign key to the patient.';
COMMENT ON COLUMN fluoroscopy_test_result.clinician_id IS
    'Foreign key to the reporting clinician (radiologist / consultant / reporting radiographer).';
COMMENT ON COLUMN fluoroscopy_test_result.originating_request_reference IS
    'Free-text reference linking this report back to the originating fluoroscopy request (referral).';
COMMENT ON COLUMN fluoroscopy_test_result.report_status IS
    'Report lifecycle status: preliminary, final, amended, cancelled.';
COMMENT ON COLUMN fluoroscopy_test_result.performed_date IS
    'Date the fluoroscopy examination was performed.';
COMMENT ON COLUMN fluoroscopy_test_result.reported_date IS
    'Date the report was authored / signed.';
COMMENT ON COLUMN fluoroscopy_test_result.study_type IS
    'Performed fluoroscopy study type: barium-swallow, barium-meal, barium-follow-through, barium-enema, water-soluble-contrast-swallow, defecating-proctogram, hysterosalpingogram, micturating-cystourethrogram, arthrogram, fluoroscopy-guided-procedure, other.';
COMMENT ON COLUMN fluoroscopy_test_result.contrast_used IS
    'Contrast actually administered: barium, water-soluble-iodinated, none.';
COMMENT ON COLUMN fluoroscopy_test_result.examination_adequacy IS
    'Diagnostic adequacy of the examination: adequate, limited, non-diagnostic.';
COMMENT ON COLUMN fluoroscopy_test_result.screening_time_minutes IS
    'Total fluoroscopy screening time in minutes, for dose audit.';
COMMENT ON COLUMN fluoroscopy_test_result.clinical_history IS
    'Clinical history and the question the examination was performed to answer.';
COMMENT ON COLUMN fluoroscopy_test_result.comparison_with_previous IS
    'Comparison with relevant previous imaging studies.';
COMMENT ON COLUMN fluoroscopy_test_result.findings_narrative IS
    'Narrative description of the imaging findings (the body of the report).';
COMMENT ON COLUMN fluoroscopy_test_result.stricture IS
    'Whether a stricture (luminal narrowing) is present.';
COMMENT ON COLUMN fluoroscopy_test_result.reflux IS
    'Whether reflux (e.g. gastro-oesophageal, vesico-ureteric) is demonstrated.';
COMMENT ON COLUMN fluoroscopy_test_result.obstruction IS
    'Whether an obstruction is present.';
COMMENT ON COLUMN fluoroscopy_test_result.perforation_or_leak IS
    'Whether a perforation or contrast leak / extravasation is present (a critical finding).';
COMMENT ON COLUMN fluoroscopy_test_result.fistula IS
    'Whether a fistulous tract is demonstrated.';
COMMENT ON COLUMN fluoroscopy_test_result.filling_defect IS
    'Whether a filling defect (e.g. mass, polyp, food bolus) is present.';
COMMENT ON COLUMN fluoroscopy_test_result.dysmotility IS
    'Whether abnormal motility (e.g. achalasia, dysmotility) is demonstrated.';
COMMENT ON COLUMN fluoroscopy_test_result.normal_study IS
    'Whether the study is reported as normal (no significant abnormality).';
COMMENT ON COLUMN fluoroscopy_test_result.incidental_finding IS
    'Whether one or more incidental findings warranting documentation are present.';
COMMENT ON COLUMN fluoroscopy_test_result.impression IS
    'Summary impression / conclusion answering the clinical question.';
COMMENT ON COLUMN fluoroscopy_test_result.reporting_category IS
    'Structured-reporting category / label recorded on the report (free text).';
COMMENT ON COLUMN fluoroscopy_test_result.recommended_follow_up IS
    'Recommended follow-up imaging, referral, or management.';
COMMENT ON COLUMN fluoroscopy_test_result.critical_result_communicated IS
    'Whether a critical or unexpected significant result was communicated directly to the referrer.';
COMMENT ON COLUMN fluoroscopy_test_result.reported_to IS
    'Who the critical / urgent result was communicated to, with date and time if applicable.';
