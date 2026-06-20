-- Urinalysis result (report) — the source-of-truth record.

CREATE TABLE urinalysis_test_result (
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
        CHECK (specimen_type IN ('midstream', 'catheter', 'clean-catch', '24h', 'random', '')),
    specimen_condition VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (specimen_condition IN ('satisfactory', 'contaminated', 'insufficient', 'delayed', '')),

    -- Clinical context
    clinical_history VARCHAR(1000) NOT NULL DEFAULT '',

    -- Dipstick (reagent strip) results
    leucocytes VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (leucocytes IN ('negative', 'trace', 'plus-one', 'plus-two', 'plus-three', '')),
    nitrites VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (nitrites IN ('negative', 'positive', '')),
    protein VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (protein IN ('negative', 'trace', 'plus-one', 'plus-two', 'plus-three', '')),
    blood VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (blood IN ('negative', 'trace', 'plus-one', 'plus-two', 'plus-three', '')),
    glucose VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (glucose IN ('negative', 'trace', 'plus-one', 'plus-two', 'plus-three', '')),
    ketones VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (ketones IN ('negative', 'trace', 'plus-one', 'plus-two', 'plus-three', '')),
    bilirubin VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (bilirubin IN ('negative', 'trace', 'plus-one', 'plus-two', 'plus-three', '')),
    ph NUMERIC(3,1)
        CHECK (ph IS NULL OR ph BETWEEN 4.0 AND 9.0),
    specific_gravity NUMERIC(4,3)
        CHECK (specific_gravity IS NULL OR specific_gravity BETWEEN 1.000 AND 1.060),

    -- Microscopy
    red_cell_count VARCHAR(50) NOT NULL DEFAULT '',
    white_cell_count VARCHAR(50) NOT NULL DEFAULT '',
    epithelial_cells VARCHAR(50) NOT NULL DEFAULT '',
    casts VARCHAR(255) NOT NULL DEFAULT '',
    organisms_seen BOOLEAN NOT NULL DEFAULT FALSE,
    crystals VARCHAR(255) NOT NULL DEFAULT '',

    -- Culture
    culture_result VARCHAR(35) NOT NULL DEFAULT ''
        CHECK (culture_result IN ('no-growth', 'mixed-growth-likely-contaminant', 'significant-growth', '')),
    organism_isolated VARCHAR(255) NOT NULL DEFAULT '',
    colony_count_cfu_ml VARCHAR(50) NOT NULL DEFAULT '',
    antibiotic_sensitivities VARCHAR(1000) NOT NULL DEFAULT '',

    -- Interpretation
    overall_result_status VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (overall_result_status IN ('normal', 'abnormal', 'critical', '')),
    findings_narrative VARCHAR(2000) NOT NULL DEFAULT '',
    impression VARCHAR(2000) NOT NULL DEFAULT '',
    reporting_category VARCHAR(50) NOT NULL DEFAULT '',
    recommended_follow_up VARCHAR(1000) NOT NULL DEFAULT '',

    -- Critical-result communication
    critical_result_communicated BOOLEAN NOT NULL DEFAULT FALSE,
    reported_to VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX index_urinalysis_test_result_patient_id
    ON urinalysis_test_result(patient_id);
CREATE INDEX index_urinalysis_test_result_clinician_id
    ON urinalysis_test_result(clinician_id);

CREATE TRIGGER trigger_urinalysis_test_result_updated_at
    BEFORE UPDATE ON urinalysis_test_result
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE urinalysis_test_result IS
    'Urinalysis result (report). Captures the specimen and its condition, clinical history, the dipstick (reagent strip) reagent results, microscopy, culture and antibiotic sensitivities, the narrative and structured interpretation, the impression, recommended follow-up, and critical-result communication. This is the source-of-truth record that the four-axis interpretation grade is computed from.';
COMMENT ON COLUMN urinalysis_test_result.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN urinalysis_test_result.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN urinalysis_test_result.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN urinalysis_test_result.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN urinalysis_test_result.patient_id IS
    'Foreign key to the patient.';
COMMENT ON COLUMN urinalysis_test_result.clinician_id IS
    'Foreign key to the reporting clinician (biomedical scientist / microbiologist / reporting clinician).';
COMMENT ON COLUMN urinalysis_test_result.originating_request_reference IS
    'Free-text reference linking this report back to the originating urinalysis request (order).';
COMMENT ON COLUMN urinalysis_test_result.report_status IS
    'Report lifecycle status: preliminary, final, amended, cancelled.';
COMMENT ON COLUMN urinalysis_test_result.performed_date IS
    'Date the urinalysis was performed in the laboratory.';
COMMENT ON COLUMN urinalysis_test_result.reported_date IS
    'Date the report was authored / signed.';
COMMENT ON COLUMN urinalysis_test_result.specimen_type IS
    'Specimen type: midstream, catheter, clean-catch, 24h (24-hour collection), random.';
COMMENT ON COLUMN urinalysis_test_result.specimen_condition IS
    'Specimen condition on receipt / analysis: satisfactory, contaminated, insufficient, delayed.';
COMMENT ON COLUMN urinalysis_test_result.clinical_history IS
    'Clinical history and the question the investigation was performed to answer.';
COMMENT ON COLUMN urinalysis_test_result.leucocytes IS
    'Dipstick leucocyte esterase: negative, trace, plus-one (1+), plus-two (2+), plus-three (3+).';
COMMENT ON COLUMN urinalysis_test_result.nitrites IS
    'Dipstick nitrite: negative or positive (suggests Gram-negative bacteriuria).';
COMMENT ON COLUMN urinalysis_test_result.protein IS
    'Dipstick protein: negative, trace, plus-one (1+), plus-two (2+), plus-three (3+).';
COMMENT ON COLUMN urinalysis_test_result.blood IS
    'Dipstick blood (haemoglobin): negative, trace, plus-one (1+), plus-two (2+), plus-three (3+).';
COMMENT ON COLUMN urinalysis_test_result.glucose IS
    'Dipstick glucose: negative, trace, plus-one (1+), plus-two (2+), plus-three (3+).';
COMMENT ON COLUMN urinalysis_test_result.ketones IS
    'Dipstick ketones: negative, trace, plus-one (1+), plus-two (2+), plus-three (3+).';
COMMENT ON COLUMN urinalysis_test_result.bilirubin IS
    'Dipstick bilirubin: negative, trace, plus-one (1+), plus-two (2+), plus-three (3+).';
COMMENT ON COLUMN urinalysis_test_result.ph IS
    'Dipstick / measured urine pH (approximately 4.0-9.0).';
COMMENT ON COLUMN urinalysis_test_result.specific_gravity IS
    'Urine specific gravity (approximately 1.000-1.060).';
COMMENT ON COLUMN urinalysis_test_result.red_cell_count IS
    'Microscopy red blood cell count / range as reported text (e.g. "<10 x10^6/L", ">50/hpf").';
COMMENT ON COLUMN urinalysis_test_result.white_cell_count IS
    'Microscopy white blood cell count / range as reported text (pyuria when raised).';
COMMENT ON COLUMN urinalysis_test_result.epithelial_cells IS
    'Microscopy epithelial cell count / grade as reported text (raised suggests contamination).';
COMMENT ON COLUMN urinalysis_test_result.casts IS
    'Microscopy casts described as reported text (e.g. hyaline, granular, red-cell casts).';
COMMENT ON COLUMN urinalysis_test_result.organisms_seen IS
    'Whether organisms (bacteria) were seen on microscopy.';
COMMENT ON COLUMN urinalysis_test_result.crystals IS
    'Microscopy crystals described as reported text (e.g. calcium oxalate, urate).';
COMMENT ON COLUMN urinalysis_test_result.culture_result IS
    'Culture outcome: no-growth, mixed-growth-likely-contaminant, significant-growth.';
COMMENT ON COLUMN urinalysis_test_result.organism_isolated IS
    'Organism(s) isolated on significant growth, as reported text (e.g. "Escherichia coli").';
COMMENT ON COLUMN urinalysis_test_result.colony_count_cfu_ml IS
    'Colony count as reported text (e.g. ">10^5 cfu/mL"), supporting the significance interpretation.';
COMMENT ON COLUMN urinalysis_test_result.antibiotic_sensitivities IS
    'Antibiotic susceptibility results as reported text (e.g. "Trimethoprim R, Nitrofurantoin S").';
COMMENT ON COLUMN urinalysis_test_result.overall_result_status IS
    'Overall result status: normal, abnormal, critical.';
COMMENT ON COLUMN urinalysis_test_result.findings_narrative IS
    'Narrative description of the urinalysis findings (the body of the report).';
COMMENT ON COLUMN urinalysis_test_result.impression IS
    'Summary impression / conclusion answering the clinical question.';
COMMENT ON COLUMN urinalysis_test_result.reporting_category IS
    'Free-text structured-reporting category label (e.g. "significant E. coli bacteriuria", "asymptomatic bacteriuria in pregnancy").';
COMMENT ON COLUMN urinalysis_test_result.recommended_follow_up IS
    'Recommended follow-up testing, referral, or management.';
COMMENT ON COLUMN urinalysis_test_result.critical_result_communicated IS
    'Whether a critical or unexpected significant result was communicated directly to the requester.';
COMMENT ON COLUMN urinalysis_test_result.reported_to IS
    'Who the critical / urgent result was communicated to, with date and time if applicable.';
