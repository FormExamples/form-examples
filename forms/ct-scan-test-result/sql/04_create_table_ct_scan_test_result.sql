-- CT (computed tomography) scan result (report) — the source-of-truth record.

CREATE TABLE ct_scan_test_result (
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
        CHECK (body_region IN ('head', 'neck', 'chest', 'abdomen', 'pelvis', 'abdomen-pelvis', 'spine', 'ct-angiogram', 'ct-colonography', 'whole-body', 'extremity', 'other', '')),
    contrast_used VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (contrast_used IN ('none', 'iv-iodinated', 'oral', 'both', '')),
    technique VARCHAR(1000) NOT NULL DEFAULT '',
    examination_adequacy VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (examination_adequacy IN ('adequate', 'limited', 'non-diagnostic', '')),

    -- Clinical context
    clinical_history VARCHAR(1000) NOT NULL DEFAULT '',
    comparison_with_previous VARCHAR(1000) NOT NULL DEFAULT '',

    -- Findings
    findings_narrative VARCHAR(2000) NOT NULL DEFAULT '',
    acute_finding BOOLEAN NOT NULL DEFAULT FALSE,
    mass_or_lesion BOOLEAN NOT NULL DEFAULT FALSE,
    haemorrhage BOOLEAN NOT NULL DEFAULT FALSE,
    infarct BOOLEAN NOT NULL DEFAULT FALSE,
    fracture BOOLEAN NOT NULL DEFAULT FALSE,
    infection_inflammation BOOLEAN NOT NULL DEFAULT FALSE,
    obstruction BOOLEAN NOT NULL DEFAULT FALSE,
    incidental_finding BOOLEAN NOT NULL DEFAULT FALSE,

    -- Measurements and dose
    largest_lesion_size_mm NUMERIC(6,1)
        CHECK (largest_lesion_size_mm IS NULL OR largest_lesion_size_mm BETWEEN 0 AND 2000),
    radiation_dose_dlp NUMERIC(8,1)
        CHECK (radiation_dose_dlp IS NULL OR radiation_dose_dlp BETWEEN 0 AND 100000),

    -- Impression and follow-up
    impression VARCHAR(2000) NOT NULL DEFAULT '',
    recommended_follow_up VARCHAR(1000) NOT NULL DEFAULT '',

    -- Critical-result communication
    critical_result_communicated BOOLEAN NOT NULL DEFAULT FALSE,
    reported_to VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX index_ct_scan_test_result_patient_id
    ON ct_scan_test_result(patient_id);
CREATE INDEX index_ct_scan_test_result_clinician_id
    ON ct_scan_test_result(clinician_id);

CREATE TRIGGER trigger_ct_scan_test_result_updated_at
    BEFORE UPDATE ON ct_scan_test_result
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE ct_scan_test_result IS
    'CT (computed tomography) scan result (report). Captures the performed examination, contrast and technique, clinical history, the narrative and structured findings, key measurements and radiation dose (DLP), the impression, recommended follow-up, and critical-result communication. This is the source-of-truth record that the four-axis interpretation grade is computed from.';
COMMENT ON COLUMN ct_scan_test_result.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN ct_scan_test_result.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN ct_scan_test_result.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN ct_scan_test_result.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN ct_scan_test_result.patient_id IS
    'Foreign key to the patient.';
COMMENT ON COLUMN ct_scan_test_result.clinician_id IS
    'Foreign key to the reporting clinician (radiologist / reporting radiographer).';
COMMENT ON COLUMN ct_scan_test_result.originating_request_reference IS
    'Free-text reference linking this report back to the originating CT scan request (referral).';
COMMENT ON COLUMN ct_scan_test_result.report_status IS
    'Report lifecycle status: preliminary, final, amended, cancelled.';
COMMENT ON COLUMN ct_scan_test_result.performed_date IS
    'Date the CT examination was performed.';
COMMENT ON COLUMN ct_scan_test_result.reported_date IS
    'Date the report was authored / signed.';
COMMENT ON COLUMN ct_scan_test_result.body_region IS
    'Examined CT body region: head, neck, chest, abdomen, pelvis, abdomen-pelvis, spine, ct-angiogram, ct-colonography, whole-body, extremity, other.';
COMMENT ON COLUMN ct_scan_test_result.contrast_used IS
    'Contrast actually administered: none, iv-iodinated, oral, both.';
COMMENT ON COLUMN ct_scan_test_result.technique IS
    'Technique narrative: phases, scan parameters, reconstructions, and any protocol deviations.';
COMMENT ON COLUMN ct_scan_test_result.examination_adequacy IS
    'Diagnostic adequacy of the examination: adequate, limited, non-diagnostic.';
COMMENT ON COLUMN ct_scan_test_result.clinical_history IS
    'Clinical history and the question the examination was performed to answer.';
COMMENT ON COLUMN ct_scan_test_result.comparison_with_previous IS
    'Comparison with relevant previous imaging studies.';
COMMENT ON COLUMN ct_scan_test_result.findings_narrative IS
    'Narrative description of the imaging findings (the body of the report).';
COMMENT ON COLUMN ct_scan_test_result.acute_finding IS
    'Whether an acute finding requiring timely action is present.';
COMMENT ON COLUMN ct_scan_test_result.mass_or_lesion IS
    'Whether a mass or focal lesion is present.';
COMMENT ON COLUMN ct_scan_test_result.haemorrhage IS
    'Whether haemorrhage is present.';
COMMENT ON COLUMN ct_scan_test_result.infarct IS
    'Whether infarction (e.g. ischaemic stroke, bowel ischaemia) is present.';
COMMENT ON COLUMN ct_scan_test_result.fracture IS
    'Whether a fracture is present.';
COMMENT ON COLUMN ct_scan_test_result.infection_inflammation IS
    'Whether infection or inflammation (e.g. abscess, collection) is present.';
COMMENT ON COLUMN ct_scan_test_result.obstruction IS
    'Whether an obstruction (e.g. bowel, urinary tract) is present.';
COMMENT ON COLUMN ct_scan_test_result.incidental_finding IS
    'Whether one or more incidental findings warranting documentation are present.';
COMMENT ON COLUMN ct_scan_test_result.largest_lesion_size_mm IS
    'Largest lesion long-axis size in millimetres, for surveillance and categorisation.';
COMMENT ON COLUMN ct_scan_test_result.radiation_dose_dlp IS
    'Dose-length product (DLP) in mGy.cm for the examination, for dose audit.';
COMMENT ON COLUMN ct_scan_test_result.impression IS
    'Summary impression / conclusion answering the clinical question.';
COMMENT ON COLUMN ct_scan_test_result.recommended_follow_up IS
    'Recommended follow-up imaging, referral, or management.';
COMMENT ON COLUMN ct_scan_test_result.critical_result_communicated IS
    'Whether a critical or unexpected significant result was communicated directly to the referrer.';
COMMENT ON COLUMN ct_scan_test_result.reported_to IS
    'Who the critical / urgent result was communicated to, with date and time if applicable.';
