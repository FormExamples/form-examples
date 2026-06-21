-- Bronchoscopy (airway endoscopy) result (procedure report) — the source-of-truth record.

CREATE TABLE bronchoscopy_test_result (
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
    procedure VARCHAR(30) NOT NULL DEFAULT ''
        CHECK (procedure IN ('flexible-bronchoscopy', 'ebus', 'rigid-bronchoscopy', 'bronchoalveolar-lavage', 'other', '')),
    sedation_used VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (sedation_used IN ('none', 'local', 'conscious', 'deep', 'general', '')),
    extent_examined VARCHAR(1000) NOT NULL DEFAULT '',

    -- Clinical context
    clinical_history VARCHAR(1000) NOT NULL DEFAULT '',

    -- Structured findings
    endobronchial_lesion BOOLEAN NOT NULL DEFAULT FALSE,
    mucosal_abnormality BOOLEAN NOT NULL DEFAULT FALSE,
    extrinsic_compression BOOLEAN NOT NULL DEFAULT FALSE,
    bleeding BOOLEAN NOT NULL DEFAULT FALSE,
    foreign_body BOOLEAN NOT NULL DEFAULT FALSE,
    secretions_purulent BOOLEAN NOT NULL DEFAULT FALSE,
    normal_examination BOOLEAN NOT NULL DEFAULT FALSE,
    lesion_location VARCHAR(255) NOT NULL DEFAULT '',

    -- Sampling
    samples_taken VARCHAR(1000) NOT NULL DEFAULT '',

    -- Complication
    complication VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (complication IN ('none', 'bleeding', 'pneumothorax', 'hypoxia', 'other', '')),

    -- Findings and impression
    findings_narrative VARCHAR(2000) NOT NULL DEFAULT '',
    impression VARCHAR(2000) NOT NULL DEFAULT '',
    reporting_category VARCHAR(100) NOT NULL DEFAULT '',

    -- Follow-up
    recommended_follow_up VARCHAR(1000) NOT NULL DEFAULT '',

    -- Critical-result communication
    critical_result_communicated BOOLEAN NOT NULL DEFAULT FALSE,
    reported_to VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX index_bronchoscopy_test_result_patient_id
    ON bronchoscopy_test_result(patient_id);
CREATE INDEX index_bronchoscopy_test_result_clinician_id
    ON bronchoscopy_test_result(clinician_id);

CREATE TRIGGER trigger_bronchoscopy_test_result_updated_at
    BEFORE UPDATE ON bronchoscopy_test_result
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE bronchoscopy_test_result IS
    'Bronchoscopy (airway endoscopy) result (procedure report). Captures the performed procedure, sedation and extent examined, the clinical history, the narrative and structured findings, samples taken, any complication, the impression, recommended follow-up, and critical-result communication. This is the source-of-truth record that the four-axis interpretation grade is computed from.';
COMMENT ON COLUMN bronchoscopy_test_result.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN bronchoscopy_test_result.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN bronchoscopy_test_result.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN bronchoscopy_test_result.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN bronchoscopy_test_result.patient_id IS
    'Foreign key to the patient.';
COMMENT ON COLUMN bronchoscopy_test_result.clinician_id IS
    'Foreign key to the operating / reporting clinician (bronchoscopist).';
COMMENT ON COLUMN bronchoscopy_test_result.originating_request_reference IS
    'Free-text reference linking this report back to the originating bronchoscopy request (referral).';
COMMENT ON COLUMN bronchoscopy_test_result.report_status IS
    'Report lifecycle status: preliminary, final, amended, cancelled.';
COMMENT ON COLUMN bronchoscopy_test_result.performed_date IS
    'Date the bronchoscopy procedure was performed.';
COMMENT ON COLUMN bronchoscopy_test_result.reported_date IS
    'Date the report was authored / signed.';
COMMENT ON COLUMN bronchoscopy_test_result.procedure IS
    'Performed procedure: flexible-bronchoscopy, ebus, rigid-bronchoscopy, bronchoalveolar-lavage, other.';
COMMENT ON COLUMN bronchoscopy_test_result.sedation_used IS
    'Sedation actually used: none, local, conscious, deep, general.';
COMMENT ON COLUMN bronchoscopy_test_result.extent_examined IS
    'Extent of the airway examined (e.g. trachea, carina, lobar and segmental bronchi reached).';
COMMENT ON COLUMN bronchoscopy_test_result.clinical_history IS
    'Clinical history and the question the procedure was performed to answer.';
COMMENT ON COLUMN bronchoscopy_test_result.endobronchial_lesion IS
    'Whether an endobronchial lesion (e.g. tumour, mass) is present.';
COMMENT ON COLUMN bronchoscopy_test_result.mucosal_abnormality IS
    'Whether a mucosal abnormality (e.g. erythema, infiltration, nodularity) is present.';
COMMENT ON COLUMN bronchoscopy_test_result.extrinsic_compression IS
    'Whether extrinsic compression of the airway is present.';
COMMENT ON COLUMN bronchoscopy_test_result.bleeding IS
    'Whether active bleeding or haemorrhage was observed.';
COMMENT ON COLUMN bronchoscopy_test_result.foreign_body IS
    'Whether a foreign body is present in the airway.';
COMMENT ON COLUMN bronchoscopy_test_result.secretions_purulent IS
    'Whether purulent secretions are present (suggesting infection).';
COMMENT ON COLUMN bronchoscopy_test_result.normal_examination IS
    'Whether the examination was entirely normal with no abnormal findings.';
COMMENT ON COLUMN bronchoscopy_test_result.lesion_location IS
    'Anatomical location of the lesion or abnormality (e.g. right upper lobe bronchus).';
COMMENT ON COLUMN bronchoscopy_test_result.samples_taken IS
    'Samples taken during the procedure (e.g. biopsy, BAL, brushings, EBUS-TBNA).';
COMMENT ON COLUMN bronchoscopy_test_result.complication IS
    'Procedural complication: none, bleeding, pneumothorax, hypoxia, other.';
COMMENT ON COLUMN bronchoscopy_test_result.findings_narrative IS
    'Narrative description of the procedure findings (the body of the report).';
COMMENT ON COLUMN bronchoscopy_test_result.impression IS
    'Summary impression / conclusion answering the clinical question.';
COMMENT ON COLUMN bronchoscopy_test_result.reporting_category IS
    'Structured-reporting score / category label (e.g. a lung-cancer-pathway or endobronchial-findings category).';
COMMENT ON COLUMN bronchoscopy_test_result.recommended_follow_up IS
    'Recommended follow-up, referral (e.g. lung-cancer MDT), or management.';
COMMENT ON COLUMN bronchoscopy_test_result.critical_result_communicated IS
    'Whether a critical or unexpected significant result was communicated directly to the referrer / team.';
COMMENT ON COLUMN bronchoscopy_test_result.reported_to IS
    'Who the critical / urgent result was communicated to, with date and time if applicable.';
