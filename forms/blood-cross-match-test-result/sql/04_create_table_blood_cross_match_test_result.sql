-- Blood cross-match / transfusion compatibility test result (report) — the source-of-truth record.

CREATE TABLE blood_cross_match_test_result (
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

    -- Test requested / context
    request_type VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (request_type IN ('group-and-save', 'crossmatch', 'antibody-screen', 'emergency-issue', '')),
    clinical_history VARCHAR(1000) NOT NULL DEFAULT '',

    -- ABO / Rh grouping
    abo_group VARCHAR(2) NOT NULL DEFAULT ''
        CHECK (abo_group IN ('a', 'b', 'o', 'ab', '')),
    rhd_group VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (rhd_group IN ('positive', 'negative', '')),

    -- Antibody screen / identification
    antibody_screen_result VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (antibody_screen_result IN ('negative', 'positive', '')),
    antibodies_identified VARCHAR(1000) NOT NULL DEFAULT '',

    -- Crossmatch / compatibility
    crossmatch_result VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (crossmatch_result IN ('compatible', 'incompatible', 'electronic-issue', 'not-performed', '')),
    component VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (component IN ('red-cells', 'platelets', 'fresh-frozen-plasma', 'cryoprecipitate', 'none', '')),
    units_crossmatched INTEGER
        CHECK (units_crossmatched IS NULL OR units_crossmatched BETWEEN 0 AND 50),
    units_available INTEGER
        CHECK (units_available IS NULL OR units_available BETWEEN 0 AND 50),

    -- Identity / sample safety
    two_sample_rule_met BOOLEAN NOT NULL DEFAULT FALSE,
    special_requirements VARCHAR(1000) NOT NULL DEFAULT '',
    historical_group_concordant BOOLEAN NOT NULL DEFAULT FALSE,

    -- Overall result and interpretation
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

CREATE INDEX index_blood_cross_match_test_result_patient_id
    ON blood_cross_match_test_result(patient_id);
CREATE INDEX index_blood_cross_match_test_result_clinician_id
    ON blood_cross_match_test_result(clinician_id);

CREATE TRIGGER trigger_blood_cross_match_test_result_updated_at
    BEFORE UPDATE ON blood_cross_match_test_result
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE blood_cross_match_test_result IS
    'Blood cross-match / transfusion compatibility test result (report). Captures the ABO/Rh group, antibody screen and identification, the crossmatch / compatibility outcome and component availability, two-sample-rule and historical-group concordance for identity safety, special component requirements, the overall result status, narrative findings, impression, and critical-result communication. This is the source-of-truth record that the four-axis interpretation grade is computed from.';
COMMENT ON COLUMN blood_cross_match_test_result.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN blood_cross_match_test_result.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN blood_cross_match_test_result.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN blood_cross_match_test_result.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN blood_cross_match_test_result.patient_id IS
    'Foreign key to the patient.';
COMMENT ON COLUMN blood_cross_match_test_result.clinician_id IS
    'Foreign key to the reporting clinician (biomedical scientist / transfusion practitioner / consultant haematologist).';
COMMENT ON COLUMN blood_cross_match_test_result.originating_request_reference IS
    'Free-text reference linking this report back to the originating blood cross-match request (referral).';
COMMENT ON COLUMN blood_cross_match_test_result.report_status IS
    'Report lifecycle status: preliminary, final, amended, cancelled.';
COMMENT ON COLUMN blood_cross_match_test_result.performed_date IS
    'Date the test was performed in the transfusion laboratory.';
COMMENT ON COLUMN blood_cross_match_test_result.reported_date IS
    'Date the report was authored / signed.';
COMMENT ON COLUMN blood_cross_match_test_result.request_type IS
    'Test the result reports against: group-and-save, crossmatch, antibody-screen, emergency-issue.';
COMMENT ON COLUMN blood_cross_match_test_result.clinical_history IS
    'Clinical history / transfusion indication relevant to interpreting the result.';
COMMENT ON COLUMN blood_cross_match_test_result.abo_group IS
    'Determined ABO group: a, b, o, ab.';
COMMENT ON COLUMN blood_cross_match_test_result.rhd_group IS
    'Determined RhD group: positive, negative.';
COMMENT ON COLUMN blood_cross_match_test_result.antibody_screen_result IS
    'Antibody screen result: negative, positive.';
COMMENT ON COLUMN blood_cross_match_test_result.antibodies_identified IS
    'Specificity of any red-cell alloantibodies identified (free text), and antigen-negative requirements arising.';
COMMENT ON COLUMN blood_cross_match_test_result.crossmatch_result IS
    'Crossmatch / compatibility outcome: compatible, incompatible, electronic-issue, not-performed.';
COMMENT ON COLUMN blood_cross_match_test_result.component IS
    'Blood component the result relates to: red-cells, platelets, fresh-frozen-plasma, cryoprecipitate, none.';
COMMENT ON COLUMN blood_cross_match_test_result.units_crossmatched IS
    'Number of units crossmatched / tested (0-50).';
COMMENT ON COLUMN blood_cross_match_test_result.units_available IS
    'Number of compatible units available for issue (0-50).';
COMMENT ON COLUMN blood_cross_match_test_result.two_sample_rule_met IS
    'Whether the BSH/SHOT two-sample (group-check) rule was satisfied for this patient before issue.';
COMMENT ON COLUMN blood_cross_match_test_result.special_requirements IS
    'Special component requirements met or required (e.g. irradiated, CMV-negative, antigen-negative, washed).';
COMMENT ON COLUMN blood_cross_match_test_result.historical_group_concordant IS
    'Whether the current ABO/Rh group is concordant with the patient historical group on record.';
COMMENT ON COLUMN blood_cross_match_test_result.overall_result_status IS
    'Overall result status: normal, abnormal, critical.';
COMMENT ON COLUMN blood_cross_match_test_result.findings_narrative IS
    'Narrative description of the laboratory findings (the body of the report).';
COMMENT ON COLUMN blood_cross_match_test_result.impression IS
    'Summary impression / conclusion answering the compatibility question.';
COMMENT ON COLUMN blood_cross_match_test_result.reporting_category IS
    'Structured reporting category / label (e.g. an antibody-significance or compatibility-status category).';
COMMENT ON COLUMN blood_cross_match_test_result.recommended_follow_up IS
    'Recommended follow-up: repeat sample, further investigation, referral, or issue instructions.';
COMMENT ON COLUMN blood_cross_match_test_result.critical_result_communicated IS
    'Whether a critical or unexpected significant result (e.g. ABO discrepancy, incompatibility) was communicated directly to the requester.';
COMMENT ON COLUMN blood_cross_match_test_result.reported_to IS
    'Who the critical / urgent result was communicated to, with date and time if applicable.';
