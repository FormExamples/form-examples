-- MRI (magnetic resonance imaging) scan result (report) — the source-of-truth record.

CREATE TABLE mri_scan_test_result (
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
    body_region VARCHAR(30) NOT NULL DEFAULT ''
        CHECK (body_region IN ('brain', 'spine-cervical', 'spine-thoracic', 'spine-lumbar', 'head-neck', 'chest', 'abdomen', 'pelvis', 'cardiac', 'mr-angiogram', 'breast', 'musculoskeletal-joint', 'whole-body', 'other', '')),
    contrast_used VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (contrast_used IN ('none', 'iv-gadolinium', '')),
    sequences_performed VARCHAR(1000) NOT NULL DEFAULT '',
    examination_adequacy VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (examination_adequacy IN ('adequate', 'limited', 'non-diagnostic', '')),

    -- Clinical context
    clinical_history VARCHAR(1000) NOT NULL DEFAULT '',
    comparison_with_previous VARCHAR(1000) NOT NULL DEFAULT '',

    -- Findings
    findings_narrative VARCHAR(2000) NOT NULL DEFAULT '',
    mass_or_lesion BOOLEAN NOT NULL DEFAULT FALSE,
    haemorrhage BOOLEAN NOT NULL DEFAULT FALSE,
    infarct BOOLEAN NOT NULL DEFAULT FALSE,
    demyelination BOOLEAN NOT NULL DEFAULT FALSE,
    disc_herniation BOOLEAN NOT NULL DEFAULT FALSE,
    cord_compression BOOLEAN NOT NULL DEFAULT FALSE,
    infection_inflammation BOOLEAN NOT NULL DEFAULT FALSE,
    incidental_finding BOOLEAN NOT NULL DEFAULT FALSE,

    -- Measurements
    largest_lesion_size_mm NUMERIC(6,1)
        CHECK (largest_lesion_size_mm IS NULL OR largest_lesion_size_mm BETWEEN 0 AND 2000),

    -- Impression and structured reporting
    impression VARCHAR(2000) NOT NULL DEFAULT '',
    reporting_category VARCHAR(50) NOT NULL DEFAULT '',
    recommended_follow_up VARCHAR(1000) NOT NULL DEFAULT '',

    -- Critical-result communication
    critical_result_communicated BOOLEAN NOT NULL DEFAULT FALSE,
    reported_to VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX index_mri_scan_test_result_patient_id
    ON mri_scan_test_result(patient_id);
CREATE INDEX index_mri_scan_test_result_clinician_id
    ON mri_scan_test_result(clinician_id);

CREATE TRIGGER trigger_mri_scan_test_result_updated_at
    BEFORE UPDATE ON mri_scan_test_result
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE mri_scan_test_result IS
    'MRI (magnetic resonance imaging) scan result (report). Captures the performed examination, contrast and pulse sequences, clinical history, the narrative and structured findings, the largest-lesion measurement, the impression and structured-reporting category (e.g. PI-RADS for prostate or BI-RADS for breast MRI), recommended follow-up, and critical-result communication. This is the source-of-truth record that the four-axis interpretation grade is computed from.';
COMMENT ON COLUMN mri_scan_test_result.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN mri_scan_test_result.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN mri_scan_test_result.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN mri_scan_test_result.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN mri_scan_test_result.patient_id IS
    'Foreign key to the patient.';
COMMENT ON COLUMN mri_scan_test_result.clinician_id IS
    'Foreign key to the reporting clinician (radiologist / reporting radiographer).';
COMMENT ON COLUMN mri_scan_test_result.originating_request_reference IS
    'Free-text reference linking this report back to the originating MRI scan request (referral).';
COMMENT ON COLUMN mri_scan_test_result.report_status IS
    'Report lifecycle status: preliminary, final, amended, cancelled.';
COMMENT ON COLUMN mri_scan_test_result.performed_date IS
    'Date the MRI examination was performed.';
COMMENT ON COLUMN mri_scan_test_result.reported_date IS
    'Date the report was authored / signed.';
COMMENT ON COLUMN mri_scan_test_result.body_region IS
    'Examined MRI body region: brain, spine-cervical, spine-thoracic, spine-lumbar, head-neck, chest, abdomen, pelvis, cardiac, mr-angiogram, breast, musculoskeletal-joint, whole-body, other.';
COMMENT ON COLUMN mri_scan_test_result.contrast_used IS
    'Contrast actually administered: none, iv-gadolinium.';
COMMENT ON COLUMN mri_scan_test_result.sequences_performed IS
    'Pulse sequences and protocol performed (e.g. T1, T2, FLAIR, DWI, DCE), with any deviations.';
COMMENT ON COLUMN mri_scan_test_result.examination_adequacy IS
    'Diagnostic adequacy of the examination: adequate, limited, non-diagnostic.';
COMMENT ON COLUMN mri_scan_test_result.clinical_history IS
    'Clinical history and the question the examination was performed to answer.';
COMMENT ON COLUMN mri_scan_test_result.comparison_with_previous IS
    'Comparison with relevant previous imaging studies.';
COMMENT ON COLUMN mri_scan_test_result.findings_narrative IS
    'Narrative description of the imaging findings (the body of the report).';
COMMENT ON COLUMN mri_scan_test_result.mass_or_lesion IS
    'Whether a mass or focal lesion is present.';
COMMENT ON COLUMN mri_scan_test_result.haemorrhage IS
    'Whether haemorrhage is present.';
COMMENT ON COLUMN mri_scan_test_result.infarct IS
    'Whether infarction (e.g. acute ischaemic stroke on diffusion-weighted imaging) is present.';
COMMENT ON COLUMN mri_scan_test_result.demyelination IS
    'Whether demyelinating lesions (e.g. multiple sclerosis plaques) are present.';
COMMENT ON COLUMN mri_scan_test_result.disc_herniation IS
    'Whether intervertebral disc herniation or protrusion is present.';
COMMENT ON COLUMN mri_scan_test_result.cord_compression IS
    'Whether spinal-cord or cauda-equina compression is present (a critical finding).';
COMMENT ON COLUMN mri_scan_test_result.infection_inflammation IS
    'Whether infection or inflammation (e.g. abscess, discitis, collection) is present.';
COMMENT ON COLUMN mri_scan_test_result.incidental_finding IS
    'Whether one or more incidental findings warranting documentation are present.';
COMMENT ON COLUMN mri_scan_test_result.largest_lesion_size_mm IS
    'Largest lesion long-axis size in millimetres, for surveillance and categorisation.';
COMMENT ON COLUMN mri_scan_test_result.impression IS
    'Summary impression / conclusion answering the clinical question.';
COMMENT ON COLUMN mri_scan_test_result.reporting_category IS
    'Structured-reporting score / category label as applicable to the body region, stored as free text (e.g. PI-RADS 1-5 for prostate MRI, BI-RADS 0-6 for breast MRI, or a Likert score).';
COMMENT ON COLUMN mri_scan_test_result.recommended_follow_up IS
    'Recommended follow-up imaging, referral, or management.';
COMMENT ON COLUMN mri_scan_test_result.critical_result_communicated IS
    'Whether a critical or unexpected significant result was communicated directly to the referrer.';
COMMENT ON COLUMN mri_scan_test_result.reported_to IS
    'Who the critical / urgent result was communicated to, with date and time if applicable.';
