-- Colonoscopy procedure result (report) — the source-of-truth record.

CREATE TABLE colonoscopy_test_result (
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
    procedure VARCHAR(25) NOT NULL DEFAULT ''
        CHECK (procedure IN ('colonoscopy', 'flexible-sigmoidoscopy', 'ct-colonography', 'other', '')),
    extent_reached VARCHAR(25) NOT NULL DEFAULT ''
        CHECK (extent_reached IN ('caecum', 'terminal-ileum', 'hepatic-flexure', 'splenic-flexure', 'descending-colon', 'rectum-sigmoid', 'incomplete', '')),
    bowel_preparation_quality VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (bowel_preparation_quality IN ('excellent', 'good', 'adequate', 'poor', '')),
    sedation_used BOOLEAN NOT NULL DEFAULT FALSE,

    -- Clinical context
    clinical_history VARCHAR(1000) NOT NULL DEFAULT '',

    -- Structured findings
    polyps_found BOOLEAN NOT NULL DEFAULT FALSE,
    mass_lesion BOOLEAN NOT NULL DEFAULT FALSE,
    diverticulosis BOOLEAN NOT NULL DEFAULT FALSE,
    inflammation_ibd BOOLEAN NOT NULL DEFAULT FALSE,
    angiodysplasia BOOLEAN NOT NULL DEFAULT FALSE,
    bleeding_source_identified BOOLEAN NOT NULL DEFAULT FALSE,
    normal_examination BOOLEAN NOT NULL DEFAULT FALSE,

    -- Polyp / lesion measurements and tissue handling
    polyp_count INTEGER
        CHECK (polyp_count IS NULL OR polyp_count BETWEEN 0 AND 200),
    largest_polyp_mm NUMERIC(5,1)
        CHECK (largest_polyp_mm IS NULL OR largest_polyp_mm BETWEEN 0 AND 200),
    biopsy_taken BOOLEAN NOT NULL DEFAULT FALSE,
    polypectomy_performed BOOLEAN NOT NULL DEFAULT FALSE,

    -- Complication
    complication VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (complication IN ('none', 'bleeding', 'perforation', 'other', '')),

    -- Findings, impression, and structured-reporting label
    findings_narrative VARCHAR(2000) NOT NULL DEFAULT '',
    impression VARCHAR(2000) NOT NULL DEFAULT '',
    reporting_category VARCHAR(50) NOT NULL DEFAULT '',

    -- Follow-up and critical-result communication
    recommended_follow_up VARCHAR(1000) NOT NULL DEFAULT '',
    critical_result_communicated BOOLEAN NOT NULL DEFAULT FALSE,
    reported_to VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX index_colonoscopy_test_result_patient_id
    ON colonoscopy_test_result(patient_id);
CREATE INDEX index_colonoscopy_test_result_clinician_id
    ON colonoscopy_test_result(clinician_id);

CREATE TRIGGER trigger_colonoscopy_test_result_updated_at
    BEFORE UPDATE ON colonoscopy_test_result
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE colonoscopy_test_result IS
    'Colonoscopy procedure result (report). Captures the performed procedure, extent reached, bowel-preparation quality and sedation, clinical history, the narrative and structured findings, polyp count and size, biopsy / polypectomy and any complication, the impression and structured-reporting label, recommended follow-up, and critical-result communication. This is the source-of-truth record that the four-axis interpretation grade is computed from.';
COMMENT ON COLUMN colonoscopy_test_result.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN colonoscopy_test_result.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN colonoscopy_test_result.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN colonoscopy_test_result.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN colonoscopy_test_result.patient_id IS
    'Foreign key to the patient.';
COMMENT ON COLUMN colonoscopy_test_result.clinician_id IS
    'Foreign key to the reporting clinician (endoscopist).';
COMMENT ON COLUMN colonoscopy_test_result.originating_request_reference IS
    'Free-text reference linking this report back to the originating colonoscopy request (referral).';
COMMENT ON COLUMN colonoscopy_test_result.report_status IS
    'Report lifecycle status: preliminary, final, amended, cancelled.';
COMMENT ON COLUMN colonoscopy_test_result.performed_date IS
    'Date the colonoscopy procedure was performed.';
COMMENT ON COLUMN colonoscopy_test_result.reported_date IS
    'Date the report was authored / signed.';
COMMENT ON COLUMN colonoscopy_test_result.procedure IS
    'Performed procedure: colonoscopy, flexible-sigmoidoscopy, ct-colonography, other.';
COMMENT ON COLUMN colonoscopy_test_result.extent_reached IS
    'Most proximal extent reached: caecum, terminal-ileum, hepatic-flexure, splenic-flexure, descending-colon, rectum-sigmoid, incomplete. Caecal / terminal-ileal intubation is the completeness key performance indicator (BSG / JAG target rate 90%).';
COMMENT ON COLUMN colonoscopy_test_result.bowel_preparation_quality IS
    'Bowel-preparation quality (e.g. mapped from a Boston Bowel Preparation Scale assessment): excellent, good, adequate, poor.';
COMMENT ON COLUMN colonoscopy_test_result.sedation_used IS
    'Whether sedation / analgesia was administered for the procedure.';
COMMENT ON COLUMN colonoscopy_test_result.clinical_history IS
    'Clinical history and the question the procedure was performed to answer.';
COMMENT ON COLUMN colonoscopy_test_result.polyps_found IS
    'Whether one or more polyps were found.';
COMMENT ON COLUMN colonoscopy_test_result.mass_lesion IS
    'Whether a mass lesion (suspicious for malignancy) was found.';
COMMENT ON COLUMN colonoscopy_test_result.diverticulosis IS
    'Whether diverticulosis is present.';
COMMENT ON COLUMN colonoscopy_test_result.inflammation_ibd IS
    'Whether mucosal inflammation suggestive of inflammatory bowel disease (IBD) is present.';
COMMENT ON COLUMN colonoscopy_test_result.angiodysplasia IS
    'Whether angiodysplasia (vascular ectasia) is present.';
COMMENT ON COLUMN colonoscopy_test_result.bleeding_source_identified IS
    'Whether a source of lower-GI bleeding was identified.';
COMMENT ON COLUMN colonoscopy_test_result.normal_examination IS
    'Whether the examination was normal (no significant abnormality detected).';
COMMENT ON COLUMN colonoscopy_test_result.polyp_count IS
    'Number of polyps detected, for surveillance interval determination.';
COMMENT ON COLUMN colonoscopy_test_result.largest_polyp_mm IS
    'Largest polyp size in millimetres, for surveillance and categorisation (BSG / ACPGBI / PHE polyp surveillance).';
COMMENT ON COLUMN colonoscopy_test_result.biopsy_taken IS
    'Whether one or more biopsies were taken for histopathology.';
COMMENT ON COLUMN colonoscopy_test_result.polypectomy_performed IS
    'Whether a polypectomy was performed.';
COMMENT ON COLUMN colonoscopy_test_result.complication IS
    'Procedural complication: none, bleeding, perforation, other.';
COMMENT ON COLUMN colonoscopy_test_result.findings_narrative IS
    'Narrative description of the procedure findings (the body of the report).';
COMMENT ON COLUMN colonoscopy_test_result.impression IS
    'Summary impression / conclusion answering the clinical question.';
COMMENT ON COLUMN colonoscopy_test_result.reporting_category IS
    'Free-text structured-reporting category label (e.g. a BSG / ACPGBI / PHE polyp-surveillance risk band, a Paris morphology class, or a histology pending note).';
COMMENT ON COLUMN colonoscopy_test_result.recommended_follow_up IS
    'Recommended follow-up surveillance interval, repeat procedure, referral, or management.';
COMMENT ON COLUMN colonoscopy_test_result.critical_result_communicated IS
    'Whether a critical or unexpected significant result was communicated directly to the referrer / responsible team.';
COMMENT ON COLUMN colonoscopy_test_result.reported_to IS
    'Who the critical / urgent result was communicated to, with date and time if applicable.';
