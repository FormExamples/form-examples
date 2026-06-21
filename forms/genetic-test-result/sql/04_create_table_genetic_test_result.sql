-- Genetic / genomic test result (report) — the source-of-truth record.

CREATE TABLE genetic_test_result (
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

    -- Test details
    test_type VARCHAR(30) NOT NULL DEFAULT ''
        CHECK (test_type IN ('diagnostic-single-gene', 'gene-panel', 'whole-exome', 'whole-genome', 'chromosomal-microarray', 'karyotype', 'predictive-presymptomatic', 'carrier-testing', 'pharmacogenomic', 'prenatal', 'other', '')),
    genes_tested TEXT NOT NULL DEFAULT '',
    sample_type VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (sample_type IN ('blood', 'saliva', 'tissue', 'prenatal', '')),

    -- Clinical context
    clinical_history VARCHAR(1000) NOT NULL DEFAULT '',
    inheritance_pattern VARCHAR(500) NOT NULL DEFAULT '',

    -- Findings
    variants_detected VARCHAR(2000) NOT NULL DEFAULT '',
    variant_classification VARCHAR(30) NOT NULL DEFAULT ''
        CHECK (variant_classification IN ('pathogenic', 'likely-pathogenic', 'variant-uncertain-significance', 'likely-benign', 'benign', 'no-variant-detected', '')),
    zygosity VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (zygosity IN ('heterozygous', 'homozygous', 'hemizygous', 'not-applicable', '')),
    pathogenic_variant_found BOOLEAN NOT NULL DEFAULT FALSE,
    vus_found BOOLEAN NOT NULL DEFAULT FALSE,
    carrier_status_positive BOOLEAN NOT NULL DEFAULT FALSE,
    secondary_finding BOOLEAN NOT NULL DEFAULT FALSE,
    no_clinically_significant_variant BOOLEAN NOT NULL DEFAULT FALSE,

    -- Interpretation and follow-up
    interpretation VARCHAR(2000) NOT NULL DEFAULT '',
    impression VARCHAR(2000) NOT NULL DEFAULT '',
    reporting_category VARCHAR(50) NOT NULL DEFAULT '',
    recommended_cascade_testing BOOLEAN NOT NULL DEFAULT FALSE,
    recommended_follow_up VARCHAR(1000) NOT NULL DEFAULT '',

    -- Critical-result communication
    critical_result_communicated BOOLEAN NOT NULL DEFAULT FALSE,
    reported_to VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX index_genetic_test_result_patient_id
    ON genetic_test_result(patient_id);
CREATE INDEX index_genetic_test_result_clinician_id
    ON genetic_test_result(clinician_id);

CREATE TRIGGER trigger_genetic_test_result_updated_at
    BEFORE UPDATE ON genetic_test_result
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE genetic_test_result IS
    'Genetic / genomic test result (report). Captures the performed test, the genes tested and sample type, clinical history and inheritance pattern, the detected variants and their ACMG/AMP-ACGS classification and zygosity, structured finding booleans, the interpretation and impression, the ACMG reporting category, recommended cascade testing and follow-up, and critical-result communication. This is the source-of-truth record that the four-axis interpretation grade is computed from.';
COMMENT ON COLUMN genetic_test_result.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN genetic_test_result.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN genetic_test_result.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN genetic_test_result.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN genetic_test_result.patient_id IS
    'Foreign key to the patient.';
COMMENT ON COLUMN genetic_test_result.clinician_id IS
    'Foreign key to the reporting clinician (clinical geneticist / genetic counsellor / clinical scientist).';
COMMENT ON COLUMN genetic_test_result.originating_request_reference IS
    'Free-text reference linking this report back to the originating genetic test request (referral).';
COMMENT ON COLUMN genetic_test_result.report_status IS
    'Report lifecycle status: preliminary, final, amended, cancelled.';
COMMENT ON COLUMN genetic_test_result.performed_date IS
    'Date the genetic test / analysis was performed.';
COMMENT ON COLUMN genetic_test_result.reported_date IS
    'Date the report was authored / signed.';
COMMENT ON COLUMN genetic_test_result.test_type IS
    'Type of genomic test performed: diagnostic-single-gene, gene-panel, whole-exome, whole-genome, chromosomal-microarray, karyotype, predictive-presymptomatic, carrier-testing, pharmacogenomic, prenatal, other.';
COMMENT ON COLUMN genetic_test_result.genes_tested IS
    'Genes, panel, or genomic region analysed (free text; gene symbols, panel name, or region).';
COMMENT ON COLUMN genetic_test_result.sample_type IS
    'Sample type analysed: blood, saliva, tissue, prenatal.';
COMMENT ON COLUMN genetic_test_result.clinical_history IS
    'Clinical history, phenotype, and the question the test was performed to answer.';
COMMENT ON COLUMN genetic_test_result.inheritance_pattern IS
    'Inheritance pattern relevant to the result (e.g. autosomal dominant, autosomal recessive, X-linked, mitochondrial).';
COMMENT ON COLUMN genetic_test_result.variants_detected IS
    'Narrative description of the variant(s) detected, with HGVS nomenclature, gene, and transcript where applicable (the body of the report).';
COMMENT ON COLUMN genetic_test_result.variant_classification IS
    'Overall ACMG/AMP (ACGS) five-tier variant classification: pathogenic, likely-pathogenic, variant-uncertain-significance, likely-benign, benign, or no-variant-detected.';
COMMENT ON COLUMN genetic_test_result.zygosity IS
    'Zygosity of the reported variant: heterozygous, homozygous, hemizygous, not-applicable.';
COMMENT ON COLUMN genetic_test_result.pathogenic_variant_found IS
    'Whether a pathogenic or likely-pathogenic variant was found.';
COMMENT ON COLUMN genetic_test_result.vus_found IS
    'Whether a variant of uncertain significance (VUS) was found.';
COMMENT ON COLUMN genetic_test_result.carrier_status_positive IS
    'Whether the patient is a carrier of a recessive / X-linked condition.';
COMMENT ON COLUMN genetic_test_result.secondary_finding IS
    'Whether a secondary / incidental finding (e.g. an actionable finding unrelated to the indication) was identified.';
COMMENT ON COLUMN genetic_test_result.no_clinically_significant_variant IS
    'Whether no clinically significant variant was detected for the indication.';
COMMENT ON COLUMN genetic_test_result.interpretation IS
    'Interpretation of the variant(s) in the context of the patient phenotype and family history.';
COMMENT ON COLUMN genetic_test_result.impression IS
    'Summary impression / conclusion answering the clinical question.';
COMMENT ON COLUMN genetic_test_result.reporting_category IS
    'Structured-reporting category label, free text (e.g. an ACMG/AMP class such as "Class 5 — pathogenic").';
COMMENT ON COLUMN genetic_test_result.recommended_cascade_testing IS
    'Whether cascade (predictive) testing of at-risk relatives is recommended.';
COMMENT ON COLUMN genetic_test_result.recommended_follow_up IS
    'Recommended follow-up: referral, surveillance, genetic counselling, or further testing.';
COMMENT ON COLUMN genetic_test_result.critical_result_communicated IS
    'Whether a critical or actionable result was communicated directly to the referrer / clinical team.';
COMMENT ON COLUMN genetic_test_result.reported_to IS
    'Who the critical / actionable result was communicated to, with date and time if applicable.';
