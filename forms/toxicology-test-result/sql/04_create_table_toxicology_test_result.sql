-- Toxicology / poisons / therapeutic-drug-level test result (report) — the source-of-truth record.

CREATE TABLE toxicology_test_result (
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

    -- Specimen and clinical context
    specimen_condition VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (specimen_condition IN ('satisfactory', 'insufficient', 'delayed', '')),
    clinical_history VARCHAR(1000) NOT NULL DEFAULT '',
    suspected_agent VARCHAR(500) NOT NULL DEFAULT '',
    time_since_ingestion_hours NUMERIC(6,1)
        CHECK (time_since_ingestion_hours IS NULL OR time_since_ingestion_hours BETWEEN 0 AND 2000),

    -- Result values (assay levels)
    paracetamol_level_mg_l NUMERIC(8,1)
        CHECK (paracetamol_level_mg_l IS NULL OR paracetamol_level_mg_l BETWEEN 0 AND 10000),
    salicylate_level_mg_l NUMERIC(8,1)
        CHECK (salicylate_level_mg_l IS NULL OR salicylate_level_mg_l BETWEEN 0 AND 10000),
    ethanol_level NUMERIC(8,1)
        CHECK (ethanol_level IS NULL OR ethanol_level BETWEEN 0 AND 100000),
    lithium_level_mmol_l NUMERIC(6,2)
        CHECK (lithium_level_mmol_l IS NULL OR lithium_level_mmol_l BETWEEN 0 AND 100),
    digoxin_level NUMERIC(6,2)
        CHECK (digoxin_level IS NULL OR digoxin_level BETWEEN 0 AND 100),
    carboxyhaemoglobin_percent NUMERIC(5,1)
        CHECK (carboxyhaemoglobin_percent IS NULL OR carboxyhaemoglobin_percent BETWEEN 0 AND 100),
    drugs_of_abuse_screen VARCHAR(1000) NOT NULL DEFAULT '',
    specific_drug_level VARCHAR(1000) NOT NULL DEFAULT '',

    -- Interpretation
    paracetamol_nomogram VARCHAR(25) NOT NULL DEFAULT ''
        CHECK (paracetamol_nomogram IN ('above-treatment-line', 'below-treatment-line', 'not-applicable', '')),
    overall_result_status VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (overall_result_status IN ('normal', 'abnormal', 'critical', '')),
    toxic_level_present BOOLEAN NOT NULL DEFAULT FALSE,
    findings_narrative VARCHAR(2000) NOT NULL DEFAULT '',
    impression VARCHAR(2000) NOT NULL DEFAULT '',
    reporting_category VARCHAR(50) NOT NULL DEFAULT '',
    recommended_follow_up VARCHAR(1000) NOT NULL DEFAULT '',

    -- Critical-result communication
    critical_result_communicated BOOLEAN NOT NULL DEFAULT FALSE,
    reported_to VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX index_toxicology_test_result_patient_id
    ON toxicology_test_result(patient_id);
CREATE INDEX index_toxicology_test_result_clinician_id
    ON toxicology_test_result(clinician_id);

CREATE TRIGGER trigger_toxicology_test_result_updated_at
    BEFORE UPDATE ON toxicology_test_result
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE toxicology_test_result IS
    'Toxicology / poisons / therapeutic-drug-level test result (report). Captures the specimen condition, clinical history and suspected agent, the assay result values (paracetamol, salicylate, ethanol, lithium, digoxin, carboxyhaemoglobin, drugs-of-abuse screen, named specific drug), the paracetamol-nomogram interpretation, the overall result status, the narrative findings and impression, recommended follow-up, and critical-result communication. This is the source-of-truth record that the four-axis interpretation grade is computed from.';
COMMENT ON COLUMN toxicology_test_result.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN toxicology_test_result.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN toxicology_test_result.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN toxicology_test_result.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN toxicology_test_result.patient_id IS
    'Foreign key to the patient.';
COMMENT ON COLUMN toxicology_test_result.clinician_id IS
    'Foreign key to the reporting clinician (clinical biochemist / toxicologist / emergency physician).';
COMMENT ON COLUMN toxicology_test_result.originating_request_reference IS
    'Free-text reference linking this report back to the originating toxicology test request (referral).';
COMMENT ON COLUMN toxicology_test_result.report_status IS
    'Report lifecycle status: preliminary, final, amended, cancelled.';
COMMENT ON COLUMN toxicology_test_result.performed_date IS
    'Date the toxicology assay was performed.';
COMMENT ON COLUMN toxicology_test_result.reported_date IS
    'Date the report was authored / signed.';
COMMENT ON COLUMN toxicology_test_result.specimen_condition IS
    'Condition of the specimen on receipt: satisfactory, insufficient, delayed.';
COMMENT ON COLUMN toxicology_test_result.clinical_history IS
    'Clinical history and the question the assay was performed to answer.';
COMMENT ON COLUMN toxicology_test_result.suspected_agent IS
    'Suspected agent(s) ingested or implicated.';
COMMENT ON COLUMN toxicology_test_result.time_since_ingestion_hours IS
    'Hours elapsed between ingestion and specimen collection, for nomogram and timing interpretation.';
COMMENT ON COLUMN toxicology_test_result.paracetamol_level_mg_l IS
    'Paracetamol (acetaminophen) level in mg/L; interpretable on the UK treatment nomogram only at >= 4 h post-ingestion.';
COMMENT ON COLUMN toxicology_test_result.salicylate_level_mg_l IS
    'Salicylate (aspirin) level in mg/L.';
COMMENT ON COLUMN toxicology_test_result.ethanol_level IS
    'Blood ethanol (alcohol) level in the reporting laboratory units (e.g. mg/dL or mmol/L).';
COMMENT ON COLUMN toxicology_test_result.lithium_level_mmol_l IS
    'Lithium level in mmol/L; therapeutic range is narrow, toxicity at modest elevation.';
COMMENT ON COLUMN toxicology_test_result.digoxin_level IS
    'Digoxin level in the reporting laboratory units (e.g. ng/mL or nmol/L).';
COMMENT ON COLUMN toxicology_test_result.carboxyhaemoglobin_percent IS
    'Carboxyhaemoglobin saturation as a percentage, for carbon-monoxide exposure.';
COMMENT ON COLUMN toxicology_test_result.drugs_of_abuse_screen IS
    'Drugs-of-abuse screen result narrative (opiates, benzodiazepines, cocaine, amphetamines, etc.).';
COMMENT ON COLUMN toxicology_test_result.specific_drug_level IS
    'Named specific drug level result narrative for an agent not captured by a dedicated column.';
COMMENT ON COLUMN toxicology_test_result.paracetamol_nomogram IS
    'Paracetamol treatment-nomogram interpretation: above-treatment-line, below-treatment-line, not-applicable.';
COMMENT ON COLUMN toxicology_test_result.overall_result_status IS
    'Overall result status: normal, abnormal, critical.';
COMMENT ON COLUMN toxicology_test_result.toxic_level_present IS
    'Whether any reported level is in a toxic range requiring action.';
COMMENT ON COLUMN toxicology_test_result.findings_narrative IS
    'Narrative description of the result values and their significance (the body of the report).';
COMMENT ON COLUMN toxicology_test_result.impression IS
    'Summary impression / conclusion answering the clinical question.';
COMMENT ON COLUMN toxicology_test_result.reporting_category IS
    'Structured-reporting category label (e.g. a nomogram band or therapeutic / toxic descriptor).';
COMMENT ON COLUMN toxicology_test_result.recommended_follow_up IS
    'Recommended follow-up assay, antidote, or management.';
COMMENT ON COLUMN toxicology_test_result.critical_result_communicated IS
    'Whether a critical or unexpected significant result was communicated directly to the requester.';
COMMENT ON COLUMN toxicology_test_result.reported_to IS
    'Who the critical / urgent result was communicated to, with date and time if applicable.';
