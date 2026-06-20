-- Microbiology culture test result (report) — the source-of-truth record.

CREATE TABLE microbiology_culture_test_result (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    patient_id UUID NOT NULL REFERENCES patient(id) ON DELETE CASCADE,
    clinician_id UUID NOT NULL REFERENCES clinician(id) ON DELETE CASCADE,

    -- Report identification
    originating_request_reference VARCHAR(255) NOT NULL DEFAULT '',
    report_status VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (report_status IN ('preliminary', 'interim', 'final', 'amended', 'cancelled', '')),
    performed_date DATE,
    reported_date DATE,

    -- Specimen
    specimen_type VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (specimen_type IN ('blood-culture', 'urine', 'wound-swab', 'sputum', 'throat-swab', 'stool', 'csf', 'tissue', 'catheter-tip', 'genital-swab', 'other', '')),
    specimen_site_detail VARCHAR(255) NOT NULL DEFAULT '',
    specimen_condition VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (specimen_condition IN ('satisfactory', 'contaminated', 'insufficient', 'delayed', '')),

    -- Clinical context
    clinical_history VARCHAR(1000) NOT NULL DEFAULT '',

    -- Microscopy and culture
    gram_stain_result VARCHAR(1000) NOT NULL DEFAULT '',
    culture_result VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (culture_result IN ('no-growth', 'mixed-growth', 'significant-growth', 'positive', '')),
    organism_isolated VARCHAR(500) NOT NULL DEFAULT '',
    second_organism_isolated VARCHAR(500) NOT NULL DEFAULT '',
    colony_count VARCHAR(255) NOT NULL DEFAULT '',

    -- Sensitivities and resistance
    antibiotic_sensitivities VARCHAR(2000) NOT NULL DEFAULT '',
    resistance_mrsa BOOLEAN NOT NULL DEFAULT FALSE,
    resistance_esbl BOOLEAN NOT NULL DEFAULT FALSE,
    resistance_cpe BOOLEAN NOT NULL DEFAULT FALSE,

    -- Specialised tests
    c_difficile_toxin VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (c_difficile_toxin IN ('positive', 'negative', 'not-tested', '')),
    acid_fast_bacilli VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (acid_fast_bacilli IN ('positive', 'negative', 'not-tested', '')),
    pcr_result VARCHAR(1000) NOT NULL DEFAULT '',

    -- Findings and interpretation
    critical_organism BOOLEAN NOT NULL DEFAULT FALSE,
    findings_narrative VARCHAR(2000) NOT NULL DEFAULT '',
    impression VARCHAR(2000) NOT NULL DEFAULT '',
    reporting_category VARCHAR(50) NOT NULL DEFAULT '',
    recommended_follow_up VARCHAR(1000) NOT NULL DEFAULT '',

    -- Critical-result communication
    critical_result_communicated BOOLEAN NOT NULL DEFAULT FALSE,
    reported_to VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX index_microbiology_culture_test_result_patient_id
    ON microbiology_culture_test_result(patient_id);
CREATE INDEX index_microbiology_culture_test_result_clinician_id
    ON microbiology_culture_test_result(clinician_id);

CREATE TRIGGER trigger_microbiology_culture_test_result_updated_at
    BEFORE UPDATE ON microbiology_culture_test_result
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE microbiology_culture_test_result IS
    'Microbiology culture test result (report). Captures the specimen and its condition, the clinical history, the Gram-stain and culture results, the organism(s) isolated and colony count, antibiotic sensitivities and key resistance markers (MRSA / ESBL / CPE), specialised tests (C. difficile toxin, acid-fast bacilli, PCR), the narrative findings, impression, recommended follow-up, and critical-result communication. This is the source-of-truth record that the four-axis interpretation grade is computed from.';
COMMENT ON COLUMN microbiology_culture_test_result.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN microbiology_culture_test_result.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN microbiology_culture_test_result.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN microbiology_culture_test_result.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN microbiology_culture_test_result.patient_id IS
    'Foreign key to the patient.';
COMMENT ON COLUMN microbiology_culture_test_result.clinician_id IS
    'Foreign key to the reporting clinician (consultant microbiologist / biomedical scientist).';
COMMENT ON COLUMN microbiology_culture_test_result.originating_request_reference IS
    'Free-text reference linking this report back to the originating microbiology culture request (referral).';
COMMENT ON COLUMN microbiology_culture_test_result.report_status IS
    'Report lifecycle status: preliminary, interim, final, amended, cancelled.';
COMMENT ON COLUMN microbiology_culture_test_result.performed_date IS
    'Date the specimen was processed / the examination was performed.';
COMMENT ON COLUMN microbiology_culture_test_result.reported_date IS
    'Date the report was authored / signed.';
COMMENT ON COLUMN microbiology_culture_test_result.specimen_type IS
    'Specimen type cultured: blood-culture, urine, wound-swab, sputum, throat-swab, stool, csf, tissue, catheter-tip, genital-swab, other.';
COMMENT ON COLUMN microbiology_culture_test_result.specimen_site_detail IS
    'Free-text anatomical site / source detail for the specimen.';
COMMENT ON COLUMN microbiology_culture_test_result.specimen_condition IS
    'Pre-analytical specimen condition on receipt: satisfactory, contaminated, insufficient, delayed.';
COMMENT ON COLUMN microbiology_culture_test_result.clinical_history IS
    'Clinical history / indication that the specimen was taken to investigate.';
COMMENT ON COLUMN microbiology_culture_test_result.gram_stain_result IS
    'Gram-stain microscopy result narrative (e.g. Gram-positive cocci in clusters).';
COMMENT ON COLUMN microbiology_culture_test_result.culture_result IS
    'Overall culture outcome: no-growth, mixed-growth, significant-growth, positive.';
COMMENT ON COLUMN microbiology_culture_test_result.organism_isolated IS
    'Primary organism isolated and identified.';
COMMENT ON COLUMN microbiology_culture_test_result.second_organism_isolated IS
    'Second organism isolated and identified, where applicable.';
COMMENT ON COLUMN microbiology_culture_test_result.colony_count IS
    'Colony count / quantification (e.g. >100,000 CFU/mL for urine).';
COMMENT ON COLUMN microbiology_culture_test_result.antibiotic_sensitivities IS
    'Antibiotic susceptibility results narrative (sensitive / resistant per agent).';
COMMENT ON COLUMN microbiology_culture_test_result.resistance_mrsa IS
    'Whether meticillin-resistant Staphylococcus aureus (MRSA) was identified.';
COMMENT ON COLUMN microbiology_culture_test_result.resistance_esbl IS
    'Whether an extended-spectrum beta-lactamase (ESBL) producer was identified.';
COMMENT ON COLUMN microbiology_culture_test_result.resistance_cpe IS
    'Whether a carbapenemase-producing Enterobacterales (CPE) organism was identified.';
COMMENT ON COLUMN microbiology_culture_test_result.c_difficile_toxin IS
    'Clostridioides difficile toxin result: positive, negative, not-tested.';
COMMENT ON COLUMN microbiology_culture_test_result.acid_fast_bacilli IS
    'Acid-fast bacilli (AFB / TB) microscopy result: positive, negative, not-tested.';
COMMENT ON COLUMN microbiology_culture_test_result.pcr_result IS
    'Molecular / PCR test result narrative.';
COMMENT ON COLUMN microbiology_culture_test_result.critical_organism IS
    'Whether a critical / alert organism (e.g. positive blood culture, CSF isolate, CPE) requiring urgent communication is present.';
COMMENT ON COLUMN microbiology_culture_test_result.findings_narrative IS
    'Narrative description of the microbiology findings (the body of the report).';
COMMENT ON COLUMN microbiology_culture_test_result.impression IS
    'Summary impression / interpretation answering the clinical question.';
COMMENT ON COLUMN microbiology_culture_test_result.reporting_category IS
    'Structured-reporting category / label for the result (free-text, e.g. an infection-significance category).';
COMMENT ON COLUMN microbiology_culture_test_result.recommended_follow_up IS
    'Recommended follow-up testing, antimicrobial advice, or management.';
COMMENT ON COLUMN microbiology_culture_test_result.critical_result_communicated IS
    'Whether a critical or unexpected significant result was communicated directly to the requester / clinical team.';
COMMENT ON COLUMN microbiology_culture_test_result.reported_to IS
    'Who the critical / urgent result was communicated to, with date and time if applicable.';
