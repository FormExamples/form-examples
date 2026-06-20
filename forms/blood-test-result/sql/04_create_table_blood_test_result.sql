-- Blood / pathology test result (report) — the source-of-truth record.

CREATE TABLE blood_test_result (
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

    -- Specimen
    specimen_type VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (specimen_type IN ('serum', 'plasma', 'whole-blood', '')),
    specimen_condition VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (specimen_condition IN ('satisfactory', 'haemolysed', 'lipaemic', 'clotted', 'insufficient', '')),

    -- Clinical context
    clinical_history VARCHAR(1000) NOT NULL DEFAULT '',

    -- Result values — full blood count (FBC)
    haemoglobin_g_l NUMERIC(6,1)
        CHECK (haemoglobin_g_l IS NULL OR haemoglobin_g_l BETWEEN 0 AND 300),
    white_cell_count NUMERIC(6,2)
        CHECK (white_cell_count IS NULL OR white_cell_count BETWEEN 0 AND 500),
    platelets NUMERIC(6,0)
        CHECK (platelets IS NULL OR platelets BETWEEN 0 AND 5000),
    neutrophils NUMERIC(6,2)
        CHECK (neutrophils IS NULL OR neutrophils BETWEEN 0 AND 500),

    -- Result values — urea and electrolytes (U&E) / renal
    sodium_mmol_l NUMERIC(5,1)
        CHECK (sodium_mmol_l IS NULL OR sodium_mmol_l BETWEEN 0 AND 250),
    potassium_mmol_l NUMERIC(4,1)
        CHECK (potassium_mmol_l IS NULL OR potassium_mmol_l BETWEEN 0 AND 20),
    urea_mmol_l NUMERIC(5,1)
        CHECK (urea_mmol_l IS NULL OR urea_mmol_l BETWEEN 0 AND 200),
    creatinine_umol_l NUMERIC(6,0)
        CHECK (creatinine_umol_l IS NULL OR creatinine_umol_l BETWEEN 0 AND 5000),
    egfr NUMERIC(5,0)
        CHECK (egfr IS NULL OR egfr BETWEEN 0 AND 200),

    -- Result values — liver function tests (LFT)
    alt_u_l NUMERIC(6,0)
        CHECK (alt_u_l IS NULL OR alt_u_l BETWEEN 0 AND 20000),
    alkaline_phosphatase NUMERIC(6,0)
        CHECK (alkaline_phosphatase IS NULL OR alkaline_phosphatase BETWEEN 0 AND 20000),
    bilirubin_umol_l NUMERIC(6,0)
        CHECK (bilirubin_umol_l IS NULL OR bilirubin_umol_l BETWEEN 0 AND 2000),
    albumin_g_l NUMERIC(4,0)
        CHECK (albumin_g_l IS NULL OR albumin_g_l BETWEEN 0 AND 100),

    -- Result values — inflammation, glycaemic, endocrine, haematinics, coagulation
    c_reactive_protein NUMERIC(6,1)
        CHECK (c_reactive_protein IS NULL OR c_reactive_protein BETWEEN 0 AND 1000),
    hba1c_mmol_mol NUMERIC(5,0)
        CHECK (hba1c_mmol_mol IS NULL OR hba1c_mmol_mol BETWEEN 0 AND 250),
    glucose_mmol_l NUMERIC(5,1)
        CHECK (glucose_mmol_l IS NULL OR glucose_mmol_l BETWEEN 0 AND 100),
    tsh NUMERIC(7,2)
        CHECK (tsh IS NULL OR tsh BETWEEN 0 AND 1000),
    ferritin NUMERIC(7,0)
        CHECK (ferritin IS NULL OR ferritin BETWEEN 0 AND 100000),
    inr NUMERIC(4,1)
        CHECK (inr IS NULL OR inr BETWEEN 0 AND 30),

    -- Overall interpretation summary
    overall_result_status VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (overall_result_status IN ('normal', 'abnormal', 'critical', '')),
    abnormal_results_present BOOLEAN NOT NULL DEFAULT FALSE,
    critical_value_present BOOLEAN NOT NULL DEFAULT FALSE,
    critical_value_detail VARCHAR(1000) NOT NULL DEFAULT '',
    findings_narrative VARCHAR(2000) NOT NULL DEFAULT '',
    comparison_with_previous VARCHAR(1000) NOT NULL DEFAULT '',
    impression VARCHAR(2000) NOT NULL DEFAULT '',
    reporting_category VARCHAR(50) NOT NULL DEFAULT '',
    recommended_follow_up VARCHAR(1000) NOT NULL DEFAULT '',

    -- Critical-result communication
    critical_result_communicated BOOLEAN NOT NULL DEFAULT FALSE,
    reported_to VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX index_blood_test_result_patient_id
    ON blood_test_result(patient_id);
CREATE INDEX index_blood_test_result_clinician_id
    ON blood_test_result(clinician_id);

CREATE TRIGGER trigger_blood_test_result_updated_at
    BEFORE UPDATE ON blood_test_result
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE blood_test_result IS
    'Blood / pathology test result (report). Captures the specimen, clinical history, the quantitative analyte result values (full blood count, urea & electrolytes / renal, liver function, inflammation, glycaemic, endocrine, haematinics, and coagulation), the overall interpretation summary with abnormal- and critical-value flags, the narrative and impression, recommended follow-up, and critical-result communication. This is the source-of-truth record that the four-axis interpretation grade is computed from.';
COMMENT ON COLUMN blood_test_result.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN blood_test_result.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN blood_test_result.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN blood_test_result.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN blood_test_result.patient_id IS
    'Foreign key to the patient.';
COMMENT ON COLUMN blood_test_result.clinician_id IS
    'Foreign key to the reporting clinician (pathologist / reporting biomedical or clinical scientist / authorising clinician).';
COMMENT ON COLUMN blood_test_result.originating_request_reference IS
    'Free-text reference linking this report back to the originating blood-test request (referral / test order).';
COMMENT ON COLUMN blood_test_result.report_status IS
    'Report lifecycle status: preliminary, final, amended, cancelled.';
COMMENT ON COLUMN blood_test_result.performed_date IS
    'Date the specimen was collected / the test was performed.';
COMMENT ON COLUMN blood_test_result.reported_date IS
    'Date the report was authored / authorised.';
COMMENT ON COLUMN blood_test_result.specimen_type IS
    'Specimen type analysed: serum, plasma, whole-blood.';
COMMENT ON COLUMN blood_test_result.specimen_condition IS
    'Specimen condition / quality: satisfactory, haemolysed, lipaemic, clotted, insufficient.';
COMMENT ON COLUMN blood_test_result.clinical_history IS
    'Clinical history and the question the test was performed to answer.';
COMMENT ON COLUMN blood_test_result.haemoglobin_g_l IS
    'Haemoglobin concentration in g/L (FBC). Adult reference approx. 130-180 (male) / 115-160 (female) g/L.';
COMMENT ON COLUMN blood_test_result.white_cell_count IS
    'Total white cell count in x10^9/L (FBC). Adult reference approx. 4.0-11.0.';
COMMENT ON COLUMN blood_test_result.platelets IS
    'Platelet count in x10^9/L (FBC). Adult reference approx. 150-400.';
COMMENT ON COLUMN blood_test_result.neutrophils IS
    'Absolute neutrophil count in x10^9/L (FBC). Adult reference approx. 2.0-7.5.';
COMMENT ON COLUMN blood_test_result.sodium_mmol_l IS
    'Serum / plasma sodium in mmol/L (U&E). Adult reference approx. 133-146.';
COMMENT ON COLUMN blood_test_result.potassium_mmol_l IS
    'Serum / plasma potassium in mmol/L (U&E). Adult reference approx. 3.5-5.3.';
COMMENT ON COLUMN blood_test_result.urea_mmol_l IS
    'Serum / plasma urea in mmol/L (U&E). Adult reference approx. 2.5-7.8.';
COMMENT ON COLUMN blood_test_result.creatinine_umol_l IS
    'Serum / plasma creatinine in umol/L (renal). Adult reference approx. 60-110.';
COMMENT ON COLUMN blood_test_result.egfr IS
    'Estimated glomerular filtration rate in mL/min/1.73m^2 (renal). >=90 normal; <60 indicates reduced function.';
COMMENT ON COLUMN blood_test_result.alt_u_l IS
    'Alanine aminotransferase in U/L (LFT). Adult reference approx. <=40-50.';
COMMENT ON COLUMN blood_test_result.alkaline_phosphatase IS
    'Alkaline phosphatase in U/L (LFT). Adult reference approx. 30-130.';
COMMENT ON COLUMN blood_test_result.bilirubin_umol_l IS
    'Total bilirubin in umol/L (LFT). Adult reference approx. <=21.';
COMMENT ON COLUMN blood_test_result.albumin_g_l IS
    'Serum albumin in g/L (LFT). Adult reference approx. 35-50.';
COMMENT ON COLUMN blood_test_result.c_reactive_protein IS
    'C-reactive protein in mg/L (inflammation). Adult reference approx. <5.';
COMMENT ON COLUMN blood_test_result.hba1c_mmol_mol IS
    'Glycated haemoglobin (HbA1c) in mmol/mol (IFCC). <42 normal; 42-47 prediabetes; >=48 diabetes range.';
COMMENT ON COLUMN blood_test_result.glucose_mmol_l IS
    'Plasma glucose in mmol/L. Fasting reference approx. 3.9-5.5.';
COMMENT ON COLUMN blood_test_result.tsh IS
    'Thyroid-stimulating hormone in mU/L (endocrine). Adult reference approx. 0.3-4.2.';
COMMENT ON COLUMN blood_test_result.ferritin IS
    'Serum ferritin in ug/L (haematinics). Adult reference approx. 15-300 (varies by sex).';
COMMENT ON COLUMN blood_test_result.inr IS
    'International normalised ratio (coagulation). Reference approx. 0.8-1.2 when not anticoagulated.';
COMMENT ON COLUMN blood_test_result.overall_result_status IS
    'Overall result status summarised by the reporter: normal, abnormal, critical.';
COMMENT ON COLUMN blood_test_result.abnormal_results_present IS
    'Whether one or more analyte results fall outside their reference range.';
COMMENT ON COLUMN blood_test_result.critical_value_present IS
    'Whether one or more analyte results breach a critical (panic) value requiring urgent communication.';
COMMENT ON COLUMN blood_test_result.critical_value_detail IS
    'Free-text detail of which critical (panic) value(s) were breached.';
COMMENT ON COLUMN blood_test_result.findings_narrative IS
    'Narrative description of the result findings (the body of the report).';
COMMENT ON COLUMN blood_test_result.comparison_with_previous IS
    'Comparison with relevant previous results (trend / delta).';
COMMENT ON COLUMN blood_test_result.impression IS
    'Summary impression / conclusion answering the clinical question.';
COMMENT ON COLUMN blood_test_result.reporting_category IS
    'Structured-reporting category label (e.g. an eGFR CKD stage or a diabetes glycaemic band).';
COMMENT ON COLUMN blood_test_result.recommended_follow_up IS
    'Recommended follow-up testing, referral, or management.';
COMMENT ON COLUMN blood_test_result.critical_result_communicated IS
    'Whether a critical / urgent / unexpected significant result was communicated directly to the requester.';
COMMENT ON COLUMN blood_test_result.reported_to IS
    'Who the critical / urgent result was communicated to, with date and time if applicable.';
