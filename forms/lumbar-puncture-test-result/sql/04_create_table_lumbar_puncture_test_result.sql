-- Lumbar puncture (LP) / cerebrospinal-fluid (CSF) analysis result (report)
-- — the source-of-truth record.

CREATE TABLE lumbar_puncture_test_result (
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

    -- Clinical context
    clinical_history VARCHAR(1000) NOT NULL DEFAULT '',

    -- Manometry
    opening_pressure_cmh2o NUMERIC(5,1)
        CHECK (opening_pressure_cmh2o IS NULL OR opening_pressure_cmh2o BETWEEN 0 AND 100),

    -- CSF macroscopic appearance and cell counts
    csf_appearance VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (csf_appearance IN ('clear', 'cloudy', 'turbid', 'blood-stained', 'xanthochromic', '')),
    csf_white_cell_count NUMERIC(8,1)
        CHECK (csf_white_cell_count IS NULL OR csf_white_cell_count BETWEEN 0 AND 1000000),
    csf_red_cell_count NUMERIC(10,1)
        CHECK (csf_red_cell_count IS NULL OR csf_red_cell_count BETWEEN 0 AND 100000000),

    -- CSF biochemistry
    csf_protein_g_l NUMERIC(5,2)
        CHECK (csf_protein_g_l IS NULL OR csf_protein_g_l BETWEEN 0 AND 100),
    csf_glucose_mmol_l NUMERIC(5,2)
        CHECK (csf_glucose_mmol_l IS NULL OR csf_glucose_mmol_l BETWEEN 0 AND 50),
    csf_serum_glucose_ratio NUMERIC(4,2)
        CHECK (csf_serum_glucose_ratio IS NULL OR csf_serum_glucose_ratio BETWEEN 0 AND 2),
    csf_lactate_mmol_l NUMERIC(5,2)
        CHECK (csf_lactate_mmol_l IS NULL OR csf_lactate_mmol_l BETWEEN 0 AND 50),

    -- Microbiology and specialist tests
    gram_stain_result VARCHAR(500) NOT NULL DEFAULT '',
    culture_result VARCHAR(500) NOT NULL DEFAULT '',
    pcr_result VARCHAR(500) NOT NULL DEFAULT '',
    oligoclonal_bands VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (oligoclonal_bands IN ('positive', 'negative', 'not-tested', '')),
    xanthochromia VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (xanthochromia IN ('positive', 'negative', 'not-tested', '')),

    -- Structured interpretive findings
    raised_protein BOOLEAN NOT NULL DEFAULT FALSE,
    pleocytosis BOOLEAN NOT NULL DEFAULT FALSE,
    low_glucose BOOLEAN NOT NULL DEFAULT FALSE,
    bacterial_meningitis_pattern BOOLEAN NOT NULL DEFAULT FALSE,
    viral_pattern BOOLEAN NOT NULL DEFAULT FALSE,
    subarachnoid_haemorrhage_suggested BOOLEAN NOT NULL DEFAULT FALSE,
    normal_csf BOOLEAN NOT NULL DEFAULT FALSE,

    -- Findings, impression and reporting category
    findings_narrative VARCHAR(2000) NOT NULL DEFAULT '',
    impression VARCHAR(2000) NOT NULL DEFAULT '',
    reporting_category VARCHAR(50) NOT NULL DEFAULT '',

    -- Conclusion and follow-up
    recommended_follow_up VARCHAR(1000) NOT NULL DEFAULT '',

    -- Critical-result communication
    critical_result_communicated BOOLEAN NOT NULL DEFAULT FALSE,
    reported_to VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX index_lumbar_puncture_test_result_patient_id
    ON lumbar_puncture_test_result(patient_id);
CREATE INDEX index_lumbar_puncture_test_result_clinician_id
    ON lumbar_puncture_test_result(clinician_id);

CREATE TRIGGER trigger_lumbar_puncture_test_result_updated_at
    BEFORE UPDATE ON lumbar_puncture_test_result
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE lumbar_puncture_test_result IS
    'Lumbar puncture (LP) / cerebrospinal-fluid (CSF) analysis result (report). Captures the manometry opening pressure, CSF macroscopic appearance, cell counts, biochemistry (protein, glucose, CSF:serum glucose ratio, lactate), microbiology (Gram stain, culture, PCR), specialist tests (oligoclonal bands, xanthochromia spectrophotometry), the narrative and structured interpretive findings, the impression, recommended follow-up, and critical-result communication. This is the source-of-truth record that the four-axis interpretation grade is computed from.';
COMMENT ON COLUMN lumbar_puncture_test_result.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN lumbar_puncture_test_result.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN lumbar_puncture_test_result.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN lumbar_puncture_test_result.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN lumbar_puncture_test_result.patient_id IS
    'Foreign key to the patient.';
COMMENT ON COLUMN lumbar_puncture_test_result.clinician_id IS
    'Foreign key to the reporting clinician (neurologist / hospital doctor / microbiologist).';
COMMENT ON COLUMN lumbar_puncture_test_result.originating_request_reference IS
    'Free-text reference linking this report back to the originating lumbar puncture request (referral).';
COMMENT ON COLUMN lumbar_puncture_test_result.report_status IS
    'Report lifecycle status: preliminary, final, amended, cancelled.';
COMMENT ON COLUMN lumbar_puncture_test_result.performed_date IS
    'Date the lumbar puncture was performed.';
COMMENT ON COLUMN lumbar_puncture_test_result.reported_date IS
    'Date the report was authored / signed.';
COMMENT ON COLUMN lumbar_puncture_test_result.clinical_history IS
    'Clinical history and the question the lumbar puncture was performed to answer.';
COMMENT ON COLUMN lumbar_puncture_test_result.opening_pressure_cmh2o IS
    'Manometry opening pressure in cm of CSF (normal adult range approximately 6-25 cmH2O when relaxed and laterally recumbent).';
COMMENT ON COLUMN lumbar_puncture_test_result.csf_appearance IS
    'Macroscopic CSF appearance: clear, cloudy, turbid, blood-stained, xanthochromic.';
COMMENT ON COLUMN lumbar_puncture_test_result.csf_white_cell_count IS
    'CSF white cell count in cells per microlitre (normal adult typically <5/uL; neutrophil predominance suggests bacterial infection).';
COMMENT ON COLUMN lumbar_puncture_test_result.csf_red_cell_count IS
    'CSF red cell count in cells per microlitre (raised in traumatic tap or subarachnoid haemorrhage).';
COMMENT ON COLUMN lumbar_puncture_test_result.csf_protein_g_l IS
    'CSF total protein in g/L (normal adult typically 0.15-0.45 g/L; raised in bacterial meningitis and many other conditions).';
COMMENT ON COLUMN lumbar_puncture_test_result.csf_glucose_mmol_l IS
    'CSF glucose in mmol/L (interpret against paired serum glucose; low in bacterial meningitis).';
COMMENT ON COLUMN lumbar_puncture_test_result.csf_serum_glucose_ratio IS
    'CSF:serum glucose ratio (normal approximately 0.6; <0.4 suggests bacterial meningitis).';
COMMENT ON COLUMN lumbar_puncture_test_result.csf_lactate_mmol_l IS
    'CSF lactate in mmol/L (raised, typically >3.5 mmol/L, supports bacterial meningitis).';
COMMENT ON COLUMN lumbar_puncture_test_result.gram_stain_result IS
    'Free-text Gram stain result and organisms seen.';
COMMENT ON COLUMN lumbar_puncture_test_result.culture_result IS
    'Free-text CSF culture result and organisms grown (a positive culture is a critical result).';
COMMENT ON COLUMN lumbar_puncture_test_result.pcr_result IS
    'Free-text molecular / PCR result (e.g. meningococcal, pneumococcal, herpes simplex, enterovirus).';
COMMENT ON COLUMN lumbar_puncture_test_result.oligoclonal_bands IS
    'CSF oligoclonal bands result: positive, negative, not-tested (supports demyelination / multiple sclerosis when CSF-specific).';
COMMENT ON COLUMN lumbar_puncture_test_result.xanthochromia IS
    'CSF xanthochromia (bilirubin) spectrophotometry result: positive, negative, not-tested (a positive result supports subarachnoid haemorrhage when LP performed >=12 h after headache onset).';
COMMENT ON COLUMN lumbar_puncture_test_result.raised_protein IS
    'Whether the CSF protein is raised.';
COMMENT ON COLUMN lumbar_puncture_test_result.pleocytosis IS
    'Whether a raised CSF white cell count (pleocytosis) is present.';
COMMENT ON COLUMN lumbar_puncture_test_result.low_glucose IS
    'Whether the CSF glucose / CSF:serum glucose ratio is low.';
COMMENT ON COLUMN lumbar_puncture_test_result.bacterial_meningitis_pattern IS
    'Whether the overall CSF profile fits a bacterial meningitis pattern (neutrophil pleocytosis, raised protein, low glucose, raised lactate) — a critical result.';
COMMENT ON COLUMN lumbar_puncture_test_result.viral_pattern IS
    'Whether the overall CSF profile fits a viral / aseptic meningitis pattern (lymphocytic pleocytosis, normal-to-mildly-raised protein, normal glucose).';
COMMENT ON COLUMN lumbar_puncture_test_result.subarachnoid_haemorrhage_suggested IS
    'Whether the result (xanthochromia and/or red-cell pattern) suggests subarachnoid haemorrhage — a critical result.';
COMMENT ON COLUMN lumbar_puncture_test_result.normal_csf IS
    'Whether the CSF analysis is within normal limits across all measured parameters.';
COMMENT ON COLUMN lumbar_puncture_test_result.findings_narrative IS
    'Narrative description of the CSF findings (the body of the report).';
COMMENT ON COLUMN lumbar_puncture_test_result.impression IS
    'Summary impression / conclusion answering the clinical question.';
COMMENT ON COLUMN lumbar_puncture_test_result.reporting_category IS
    'Structured-reporting category / pattern label (e.g. bacterial-pattern, viral-pattern, SAH-pattern, normal, inflammatory-demyelinating).';
COMMENT ON COLUMN lumbar_puncture_test_result.recommended_follow_up IS
    'Recommended follow-up investigation, referral, or management.';
COMMENT ON COLUMN lumbar_puncture_test_result.critical_result_communicated IS
    'Whether a critical or unexpected significant result was communicated directly to the requesting / responsible clinician.';
COMMENT ON COLUMN lumbar_puncture_test_result.reported_to IS
    'Who the critical / urgent result was communicated to, with date and time if applicable.';
