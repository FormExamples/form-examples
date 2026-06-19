-- PET-CT (positron emission tomography) scan result (report) — the source-of-truth record.

CREATE TABLE pet_scan_test_result (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    patient_id UUID NOT NULL REFERENCES patient(id) ON DELETE CASCADE,
    clinician_id UUID NOT NULL REFERENCES clinician(id) ON DELETE CASCADE,

    -- Report identification
    originating_request_reference VARCHAR(255) NOT NULL DEFAULT '',
    scan_type VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (scan_type IN ('fdg-pet-ct', 'psma-pet', 'dotatate-pet', 'amyloid-pet', 'cardiac-pet', 'other', '')),
    report_status VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (report_status IN ('preliminary', 'final', 'amended', 'cancelled', '')),
    performed_date DATE,
    reported_date DATE,

    -- Clinical context and acquisition
    clinical_history VARCHAR(1000) NOT NULL DEFAULT '',
    blood_glucose_mmol_l NUMERIC(4,1)
        CHECK (blood_glucose_mmol_l IS NULL OR blood_glucose_mmol_l BETWEEN 0 AND 60),
    injected_activity_mbq NUMERIC(7,1)
        CHECK (injected_activity_mbq IS NULL OR injected_activity_mbq BETWEEN 0 AND 100000),
    examination_adequacy VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (examination_adequacy IN ('adequate', 'limited', 'non-diagnostic', '')),

    -- Findings
    findings_narrative VARCHAR(2000) NOT NULL DEFAULT '',
    hypermetabolic_lesion BOOLEAN NOT NULL DEFAULT FALSE,
    nodal_uptake BOOLEAN NOT NULL DEFAULT FALSE,
    distant_metastasis BOOLEAN NOT NULL DEFAULT FALSE,
    no_abnormal_uptake BOOLEAN NOT NULL DEFAULT FALSE,
    physiological_uptake_only BOOLEAN NOT NULL DEFAULT FALSE,
    incidental_finding BOOLEAN NOT NULL DEFAULT FALSE,

    -- Measurements
    suv_max NUMERIC(6,1)
        CHECK (suv_max IS NULL OR suv_max BETWEEN 0 AND 1000),
    largest_lesion_size_mm NUMERIC(6,1)
        CHECK (largest_lesion_size_mm IS NULL OR largest_lesion_size_mm BETWEEN 0 AND 2000),
    comparison_with_previous VARCHAR(1000) NOT NULL DEFAULT '',
    treatment_response VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (treatment_response IN ('complete', 'partial', 'stable', 'progressive', 'not-applicable', '')),

    -- Impression and structured reporting
    impression VARCHAR(2000) NOT NULL DEFAULT '',
    reporting_category VARCHAR(50) NOT NULL DEFAULT '',
    recommended_follow_up VARCHAR(1000) NOT NULL DEFAULT '',

    -- Critical-result communication
    critical_result_communicated BOOLEAN NOT NULL DEFAULT FALSE,
    reported_to VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX index_pet_scan_test_result_patient_id
    ON pet_scan_test_result(patient_id);
CREATE INDEX index_pet_scan_test_result_clinician_id
    ON pet_scan_test_result(clinician_id);

CREATE TRIGGER trigger_pet_scan_test_result_updated_at
    BEFORE UPDATE ON pet_scan_test_result
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE pet_scan_test_result IS
    'PET-CT (positron emission tomography) scan result (report). Captures the tracer / scan type, the clinical history and acquisition data (blood glucose, injected activity), the narrative and structured metabolic findings, key measurements (SUVmax, largest lesion size), comparison and treatment response, the impression, the structured reporting category (e.g. Deauville score or PERCIST category), recommended follow-up, and critical-result communication. This is the source-of-truth record that the four-axis interpretation grade is computed from.';
COMMENT ON COLUMN pet_scan_test_result.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN pet_scan_test_result.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN pet_scan_test_result.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN pet_scan_test_result.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN pet_scan_test_result.patient_id IS
    'Foreign key to the patient.';
COMMENT ON COLUMN pet_scan_test_result.clinician_id IS
    'Foreign key to the reporting clinician (nuclear-medicine physician / radiologist).';
COMMENT ON COLUMN pet_scan_test_result.originating_request_reference IS
    'Free-text reference linking this report back to the originating PET-CT scan request (referral).';
COMMENT ON COLUMN pet_scan_test_result.scan_type IS
    'PET tracer / scan type reported: fdg-pet-ct, psma-pet, dotatate-pet, amyloid-pet, cardiac-pet, other.';
COMMENT ON COLUMN pet_scan_test_result.report_status IS
    'Report lifecycle status: preliminary, final, amended, cancelled.';
COMMENT ON COLUMN pet_scan_test_result.performed_date IS
    'Date the PET-CT examination was performed.';
COMMENT ON COLUMN pet_scan_test_result.reported_date IS
    'Date the report was authored / signed.';
COMMENT ON COLUMN pet_scan_test_result.clinical_history IS
    'Clinical history and the question the examination was performed to answer.';
COMMENT ON COLUMN pet_scan_test_result.blood_glucose_mmol_l IS
    'Pre-injection blood glucose in mmol/L; FDG uptake quality depends on glucose control, typically below 11 mmol/L.';
COMMENT ON COLUMN pet_scan_test_result.injected_activity_mbq IS
    'Administered radiopharmaceutical activity in megabecquerels (MBq), for dose audit.';
COMMENT ON COLUMN pet_scan_test_result.examination_adequacy IS
    'Diagnostic adequacy of the examination: adequate, limited, non-diagnostic.';
COMMENT ON COLUMN pet_scan_test_result.findings_narrative IS
    'Narrative description of the metabolic and CT findings (the body of the report).';
COMMENT ON COLUMN pet_scan_test_result.hypermetabolic_lesion IS
    'Whether one or more abnormally hypermetabolic (FDG / tracer-avid) lesions are present.';
COMMENT ON COLUMN pet_scan_test_result.nodal_uptake IS
    'Whether abnormal nodal (lymph-node) tracer uptake is present.';
COMMENT ON COLUMN pet_scan_test_result.distant_metastasis IS
    'Whether distant metastatic tracer-avid disease is present.';
COMMENT ON COLUMN pet_scan_test_result.no_abnormal_uptake IS
    'Whether the study shows no abnormal tracer uptake (negative / complete metabolic response).';
COMMENT ON COLUMN pet_scan_test_result.physiological_uptake_only IS
    'Whether only normal physiological tracer uptake is present (e.g. brain, myocardium, bowel, urinary tract).';
COMMENT ON COLUMN pet_scan_test_result.incidental_finding IS
    'Whether one or more incidental findings warranting documentation are present.';
COMMENT ON COLUMN pet_scan_test_result.suv_max IS
    'Maximum standardised uptake value (SUVmax) of the most-avid reference lesion.';
COMMENT ON COLUMN pet_scan_test_result.largest_lesion_size_mm IS
    'Largest lesion long-axis size in millimetres, for surveillance and categorisation.';
COMMENT ON COLUMN pet_scan_test_result.comparison_with_previous IS
    'Comparison with relevant previous PET-CT or other imaging studies.';
COMMENT ON COLUMN pet_scan_test_result.treatment_response IS
    'Metabolic treatment-response category: complete, partial, stable, progressive, not-applicable.';
COMMENT ON COLUMN pet_scan_test_result.impression IS
    'Summary impression / conclusion answering the clinical question.';
COMMENT ON COLUMN pet_scan_test_result.reporting_category IS
    'Free-text structured-reporting label, e.g. a Deauville score (1-5) for lymphoma or a PERCIST response category.';
COMMENT ON COLUMN pet_scan_test_result.recommended_follow_up IS
    'Recommended follow-up imaging, referral, or management.';
COMMENT ON COLUMN pet_scan_test_result.critical_result_communicated IS
    'Whether a critical or unexpected significant result was communicated directly to the referrer.';
COMMENT ON COLUMN pet_scan_test_result.reported_to IS
    'Who the critical / urgent result was communicated to, with date and time if applicable.';
