-- General (non-obstetric) ultrasound result (report) — the source-of-truth record.

CREATE TABLE ultrasound_test_result (
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
    body_region VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (body_region IN ('abdomen', 'pelvis', 'renal-tract', 'liver-biliary', 'thyroid-neck', 'scrotum-testes', 'breast', 'soft-tissue', 'vascular-doppler', 'dvt-leg', 'carotid', 'msk-joint', 'other', '')),
    laterality VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (laterality IN ('left', 'right', 'bilateral', 'not-applicable', '')),
    examination_adequacy VARCHAR(25) NOT NULL DEFAULT ''
        CHECK (examination_adequacy IN ('adequate', 'limited-body-habitus', 'non-diagnostic', '')),

    -- Clinical context
    clinical_history VARCHAR(1000) NOT NULL DEFAULT '',
    comparison_with_previous VARCHAR(1000) NOT NULL DEFAULT '',

    -- Findings
    findings_narrative VARCHAR(2000) NOT NULL DEFAULT '',
    mass_or_lesion BOOLEAN NOT NULL DEFAULT FALSE,
    cyst BOOLEAN NOT NULL DEFAULT FALSE,
    gallstones BOOLEAN NOT NULL DEFAULT FALSE,
    hydronephrosis BOOLEAN NOT NULL DEFAULT FALSE,
    free_fluid BOOLEAN NOT NULL DEFAULT FALSE,
    dvt_present BOOLEAN NOT NULL DEFAULT FALSE,
    aneurysm BOOLEAN NOT NULL DEFAULT FALSE,
    organ_enlargement BOOLEAN NOT NULL DEFAULT FALSE,
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

CREATE INDEX index_ultrasound_test_result_patient_id
    ON ultrasound_test_result(patient_id);
CREATE INDEX index_ultrasound_test_result_clinician_id
    ON ultrasound_test_result(clinician_id);

CREATE TRIGGER trigger_ultrasound_test_result_updated_at
    BEFORE UPDATE ON ultrasound_test_result
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE ultrasound_test_result IS
    'General (non-obstetric) ultrasound result (report). Captures the performed examination (body region, laterality), diagnostic adequacy, clinical history, the narrative and structured findings, the largest lesion measurement, the impression, a free-text structured-reporting category (e.g. TI-RADS for thyroid, U-classification for breast), recommended follow-up, and critical-result communication. This is the source-of-truth record that the four-axis interpretation grade is computed from.';
COMMENT ON COLUMN ultrasound_test_result.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN ultrasound_test_result.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN ultrasound_test_result.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN ultrasound_test_result.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN ultrasound_test_result.patient_id IS
    'Foreign key to the patient.';
COMMENT ON COLUMN ultrasound_test_result.clinician_id IS
    'Foreign key to the reporting clinician (sonographer / radiologist).';
COMMENT ON COLUMN ultrasound_test_result.originating_request_reference IS
    'Free-text reference linking this report back to the originating ultrasound request (referral).';
COMMENT ON COLUMN ultrasound_test_result.report_status IS
    'Report lifecycle status: preliminary, final, amended, cancelled.';
COMMENT ON COLUMN ultrasound_test_result.performed_date IS
    'Date the ultrasound examination was performed.';
COMMENT ON COLUMN ultrasound_test_result.reported_date IS
    'Date the report was authored / signed.';
COMMENT ON COLUMN ultrasound_test_result.body_region IS
    'Examined ultrasound body region: abdomen, pelvis, renal-tract, liver-biliary, thyroid-neck, scrotum-testes, breast, soft-tissue, vascular-doppler, dvt-leg, carotid, msk-joint, other.';
COMMENT ON COLUMN ultrasound_test_result.laterality IS
    'Laterality of the examination: left, right, bilateral, not-applicable.';
COMMENT ON COLUMN ultrasound_test_result.examination_adequacy IS
    'Diagnostic adequacy of the examination: adequate, limited-body-habitus, non-diagnostic.';
COMMENT ON COLUMN ultrasound_test_result.clinical_history IS
    'Clinical history and the question the examination was performed to answer.';
COMMENT ON COLUMN ultrasound_test_result.comparison_with_previous IS
    'Comparison with relevant previous imaging studies.';
COMMENT ON COLUMN ultrasound_test_result.findings_narrative IS
    'Narrative description of the imaging findings (the body of the report).';
COMMENT ON COLUMN ultrasound_test_result.mass_or_lesion IS
    'Whether a mass or focal solid lesion is present.';
COMMENT ON COLUMN ultrasound_test_result.cyst IS
    'Whether a cyst (e.g. simple or complex cystic lesion) is present.';
COMMENT ON COLUMN ultrasound_test_result.gallstones IS
    'Whether gallstones / cholelithiasis are present.';
COMMENT ON COLUMN ultrasound_test_result.hydronephrosis IS
    'Whether hydronephrosis / urinary-tract dilatation is present.';
COMMENT ON COLUMN ultrasound_test_result.free_fluid IS
    'Whether free fluid (e.g. ascites, pelvic free fluid) is present.';
COMMENT ON COLUMN ultrasound_test_result.dvt_present IS
    'Whether deep vein thrombosis (DVT) is present on venous Doppler — a critical finding.';
COMMENT ON COLUMN ultrasound_test_result.aneurysm IS
    'Whether an aneurysm (e.g. abdominal aortic aneurysm) is present; a ruptured / large AAA is a critical finding.';
COMMENT ON COLUMN ultrasound_test_result.organ_enlargement IS
    'Whether organ enlargement (e.g. hepatomegaly, splenomegaly) is present.';
COMMENT ON COLUMN ultrasound_test_result.incidental_finding IS
    'Whether one or more incidental findings warranting documentation are present.';
COMMENT ON COLUMN ultrasound_test_result.largest_lesion_size_mm IS
    'Largest lesion long-axis size in millimetres, for surveillance and categorisation.';
COMMENT ON COLUMN ultrasound_test_result.impression IS
    'Summary impression / conclusion answering the clinical question.';
COMMENT ON COLUMN ultrasound_test_result.reporting_category IS
    'Free-text structured-reporting score / category label where applicable (e.g. an ACR TI-RADS level for thyroid, or a breast U-classification U1-U5).';
COMMENT ON COLUMN ultrasound_test_result.recommended_follow_up IS
    'Recommended follow-up imaging, referral, or management.';
COMMENT ON COLUMN ultrasound_test_result.critical_result_communicated IS
    'Whether a critical or unexpected significant result was communicated directly to the referrer.';
COMMENT ON COLUMN ultrasound_test_result.reported_to IS
    'Who the critical / urgent result was communicated to, with date and time if applicable.';
