-- Angiography result (report) — the source-of-truth record.

CREATE TABLE angiography_test_result (
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
    angiography_type VARCHAR(25) NOT NULL DEFAULT ''
        CHECK (angiography_type IN ('ct-angiography', 'mr-angiography', 'catheter-dsa', 'coronary-angiography', 'peripheral-angiography', 'cerebral-angiography', 'other', '')),
    body_region VARCHAR(25) NOT NULL DEFAULT ''
        CHECK (body_region IN ('coronary', 'cerebral', 'carotid', 'aorta', 'renal', 'peripheral-lower-limb', 'pulmonary', 'mesenteric', 'other', '')),
    contrast_used VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (contrast_used IN ('iodinated', 'gadolinium', 'none', '')),
    examination_adequacy VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (examination_adequacy IN ('adequate', 'limited', 'non-diagnostic', '')),

    -- Clinical context
    clinical_history VARCHAR(1000) NOT NULL DEFAULT '',
    comparison_with_previous VARCHAR(1000) NOT NULL DEFAULT '',

    -- Findings
    findings_narrative VARCHAR(2000) NOT NULL DEFAULT '',
    significant_stenosis BOOLEAN NOT NULL DEFAULT FALSE,
    occlusion BOOLEAN NOT NULL DEFAULT FALSE,
    aneurysm BOOLEAN NOT NULL DEFAULT FALSE,
    dissection BOOLEAN NOT NULL DEFAULT FALSE,
    active_extravasation BOOLEAN NOT NULL DEFAULT FALSE,
    thrombus BOOLEAN NOT NULL DEFAULT FALSE,
    normal_vessels BOOLEAN NOT NULL DEFAULT FALSE,
    incidental_finding BOOLEAN NOT NULL DEFAULT FALSE,

    -- Measurements
    max_stenosis_percent NUMERIC(5,1)
        CHECK (max_stenosis_percent IS NULL OR max_stenosis_percent BETWEEN 0 AND 100),
    intervention_performed BOOLEAN NOT NULL DEFAULT FALSE,

    -- Impression and follow-up
    impression VARCHAR(2000) NOT NULL DEFAULT '',
    reporting_category VARCHAR(50) NOT NULL DEFAULT '',
    recommended_follow_up VARCHAR(1000) NOT NULL DEFAULT '',

    -- Critical-result communication
    critical_result_communicated BOOLEAN NOT NULL DEFAULT FALSE,
    reported_to VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX index_angiography_test_result_patient_id
    ON angiography_test_result(patient_id);
CREATE INDEX index_angiography_test_result_clinician_id
    ON angiography_test_result(clinician_id);

CREATE TRIGGER trigger_angiography_test_result_updated_at
    BEFORE UPDATE ON angiography_test_result
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE angiography_test_result IS
    'Angiography result (report). Captures the performed examination, modality and contrast, clinical history, the narrative and structured vascular findings, the maximum stenosis percentage and whether an intervention was performed, the impression and reporting category, recommended follow-up, and critical-result communication. This is the source-of-truth record that the four-axis interpretation grade is computed from.';
COMMENT ON COLUMN angiography_test_result.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN angiography_test_result.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN angiography_test_result.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN angiography_test_result.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN angiography_test_result.patient_id IS
    'Foreign key to the patient.';
COMMENT ON COLUMN angiography_test_result.clinician_id IS
    'Foreign key to the reporting clinician (interventional radiologist / radiologist / cardiologist / vascular surgeon).';
COMMENT ON COLUMN angiography_test_result.originating_request_reference IS
    'Free-text reference linking this report back to the originating angiography request (referral).';
COMMENT ON COLUMN angiography_test_result.report_status IS
    'Report lifecycle status: preliminary, final, amended, cancelled.';
COMMENT ON COLUMN angiography_test_result.performed_date IS
    'Date the angiographic examination was performed.';
COMMENT ON COLUMN angiography_test_result.reported_date IS
    'Date the report was authored / signed.';
COMMENT ON COLUMN angiography_test_result.angiography_type IS
    'Angiography modality performed: ct-angiography, mr-angiography, catheter-dsa, coronary-angiography, peripheral-angiography, cerebral-angiography, other.';
COMMENT ON COLUMN angiography_test_result.body_region IS
    'Examined arterial territory: coronary, cerebral, carotid, aorta, renal, peripheral-lower-limb, pulmonary, mesenteric, other.';
COMMENT ON COLUMN angiography_test_result.contrast_used IS
    'Contrast actually administered: iodinated, gadolinium, none.';
COMMENT ON COLUMN angiography_test_result.examination_adequacy IS
    'Diagnostic adequacy of the examination: adequate, limited, non-diagnostic.';
COMMENT ON COLUMN angiography_test_result.clinical_history IS
    'Clinical history and the question the examination was performed to answer.';
COMMENT ON COLUMN angiography_test_result.comparison_with_previous IS
    'Comparison with relevant previous imaging studies.';
COMMENT ON COLUMN angiography_test_result.findings_narrative IS
    'Narrative description of the angiographic findings (the body of the report).';
COMMENT ON COLUMN angiography_test_result.significant_stenosis IS
    'Whether a haemodynamically significant arterial stenosis is present.';
COMMENT ON COLUMN angiography_test_result.occlusion IS
    'Whether a vessel occlusion (complete luminal loss) is present.';
COMMENT ON COLUMN angiography_test_result.aneurysm IS
    'Whether an aneurysm or focal aneurysmal dilatation is present.';
COMMENT ON COLUMN angiography_test_result.dissection IS
    'Whether an arterial dissection (intimal flap / false lumen) is present.';
COMMENT ON COLUMN angiography_test_result.active_extravasation IS
    'Whether active contrast extravasation (active bleeding) is present.';
COMMENT ON COLUMN angiography_test_result.thrombus IS
    'Whether intraluminal thrombus or embolus is present.';
COMMENT ON COLUMN angiography_test_result.normal_vessels IS
    'Whether the examined vessels are normal with no significant abnormality.';
COMMENT ON COLUMN angiography_test_result.incidental_finding IS
    'Whether one or more incidental findings warranting documentation are present.';
COMMENT ON COLUMN angiography_test_result.max_stenosis_percent IS
    'Maximum arterial luminal stenosis as a percentage (0-100), e.g. NASCET-style diameter reduction.';
COMMENT ON COLUMN angiography_test_result.intervention_performed IS
    'Whether an angiographic intervention (e.g. angioplasty, stent, embolisation) was performed during the study.';
COMMENT ON COLUMN angiography_test_result.impression IS
    'Summary impression / conclusion answering the clinical question.';
COMMENT ON COLUMN angiography_test_result.reporting_category IS
    'Structured-reporting category label (free text), e.g. a stenosis-severity category such as <50% / 50-69% / 70-99% / near-occlusion / occluded.';
COMMENT ON COLUMN angiography_test_result.recommended_follow_up IS
    'Recommended follow-up imaging, referral, or management.';
COMMENT ON COLUMN angiography_test_result.critical_result_communicated IS
    'Whether a critical or unexpected significant result was communicated directly to the referrer.';
COMMENT ON COLUMN angiography_test_result.reported_to IS
    'Who the critical / urgent result was communicated to, with date and time if applicable.';
