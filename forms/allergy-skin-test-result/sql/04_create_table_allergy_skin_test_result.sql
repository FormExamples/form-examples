-- Allergy skin test result (report) — the source-of-truth record.

CREATE TABLE allergy_skin_test_result (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    patient_id UUID NOT NULL REFERENCES patient(id) ON DELETE CASCADE,
    clinician_id UUID NOT NULL REFERENCES clinician(id) ON DELETE CASCADE,

    -- Report identification
    originating_request_reference VARCHAR(255) NOT NULL DEFAULT '',
    test_type VARCHAR(30) NOT NULL DEFAULT ''
        CHECK (test_type IN ('skin-prick-test', 'intradermal-test', 'patch-test', 'specific-ige-blood', 'drug-provocation-challenge', 'other', '')),
    report_status VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (report_status IN ('preliminary', 'final', 'amended', 'cancelled', '')),
    performed_date DATE,
    reported_date DATE,

    -- Clinical context
    clinical_history VARCHAR(2000) NOT NULL DEFAULT '',

    -- Test validity controls
    antihistamines_withheld BOOLEAN NOT NULL DEFAULT FALSE,
    positive_control_valid BOOLEAN NOT NULL DEFAULT FALSE,

    -- Allergens and measured reactions
    allergens_tested VARCHAR(2000) NOT NULL DEFAULT '',
    wheal_sizes VARCHAR(2000) NOT NULL DEFAULT '',
    specific_ige_results VARCHAR(2000) NOT NULL DEFAULT '',
    sensitised_allergens VARCHAR(2000) NOT NULL DEFAULT '',

    -- Structured reaction summary
    positive_reactions BOOLEAN NOT NULL DEFAULT FALSE,
    sensitisation_confirmed BOOLEAN NOT NULL DEFAULT FALSE,
    anaphylaxis_during_test BOOLEAN NOT NULL DEFAULT FALSE,
    all_negative BOOLEAN NOT NULL DEFAULT FALSE,
    test_invalid BOOLEAN NOT NULL DEFAULT FALSE,

    -- Interpretation and impression
    interpretation VARCHAR(2000) NOT NULL DEFAULT '',
    impression VARCHAR(2000) NOT NULL DEFAULT '',
    reporting_category VARCHAR(50) NOT NULL DEFAULT '',

    -- Follow-up
    recommended_follow_up VARCHAR(1000) NOT NULL DEFAULT '',

    -- Critical-result communication
    critical_result_communicated BOOLEAN NOT NULL DEFAULT FALSE,
    reported_to VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX index_allergy_skin_test_result_patient_id
    ON allergy_skin_test_result(patient_id);
CREATE INDEX index_allergy_skin_test_result_clinician_id
    ON allergy_skin_test_result(clinician_id);

CREATE TRIGGER trigger_allergy_skin_test_result_updated_at
    BEFORE UPDATE ON allergy_skin_test_result
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE allergy_skin_test_result IS
    'Allergy skin test result (report). Captures the performed test type, clinical history, the pre-analytic validity controls (antihistamine washout, positive histamine control), the allergens tested and their measured weal sizes / specific-IgE results, the sensitised allergens and structured reaction summary, the clinical interpretation and impression, recommended follow-up, and critical-result communication. This is the source-of-truth record that the four-axis interpretation grade is computed from.';
COMMENT ON COLUMN allergy_skin_test_result.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN allergy_skin_test_result.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN allergy_skin_test_result.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN allergy_skin_test_result.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN allergy_skin_test_result.patient_id IS
    'Foreign key to the patient.';
COMMENT ON COLUMN allergy_skin_test_result.clinician_id IS
    'Foreign key to the reporting clinician (allergist-immunologist / dermatologist / nurse).';
COMMENT ON COLUMN allergy_skin_test_result.originating_request_reference IS
    'Free-text reference linking this report back to the originating allergy skin test request (referral).';
COMMENT ON COLUMN allergy_skin_test_result.test_type IS
    'Performed test type: skin-prick-test, intradermal-test, patch-test, specific-ige-blood, drug-provocation-challenge, other.';
COMMENT ON COLUMN allergy_skin_test_result.report_status IS
    'Report lifecycle status: preliminary, final, amended, cancelled.';
COMMENT ON COLUMN allergy_skin_test_result.performed_date IS
    'Date the allergy test was performed.';
COMMENT ON COLUMN allergy_skin_test_result.reported_date IS
    'Date the report was authored / signed.';
COMMENT ON COLUMN allergy_skin_test_result.clinical_history IS
    'Clinical history and the question the test was performed to answer.';
COMMENT ON COLUMN allergy_skin_test_result.antihistamines_withheld IS
    'Whether antihistamines were withheld for an adequate washout before testing (skin-prick / intradermal validity precondition).';
COMMENT ON COLUMN allergy_skin_test_result.positive_control_valid IS
    'Whether the positive histamine control produced an adequate weal, confirming skin reactivity (test-validity control).';
COMMENT ON COLUMN allergy_skin_test_result.allergens_tested IS
    'Free-text list of allergens tested (e.g. house dust mite, peanut, amoxicillin).';
COMMENT ON COLUMN allergy_skin_test_result.wheal_sizes IS
    'Free-text record of measured weal sizes per allergen in millimetres (with positive / negative controls).';
COMMENT ON COLUMN allergy_skin_test_result.specific_ige_results IS
    'Free-text record of specific-IgE blood (sIgE) results per allergen in kUA/L, where performed.';
COMMENT ON COLUMN allergy_skin_test_result.sensitised_allergens IS
    'Free-text list of allergens to which sensitisation was demonstrated.';
COMMENT ON COLUMN allergy_skin_test_result.positive_reactions IS
    'Whether one or more positive reactions (weal >=3 mm over negative control, or raised sIgE) were recorded.';
COMMENT ON COLUMN allergy_skin_test_result.sensitisation_confirmed IS
    'Whether clinically relevant sensitisation was confirmed (positive result concordant with the clinical history).';
COMMENT ON COLUMN allergy_skin_test_result.anaphylaxis_during_test IS
    'Whether a systemic / anaphylactic reaction occurred during testing (critical safety event).';
COMMENT ON COLUMN allergy_skin_test_result.all_negative IS
    'Whether all tested allergens were negative.';
COMMENT ON COLUMN allergy_skin_test_result.test_invalid IS
    'Whether the test was invalid / non-interpretable (e.g. antihistamines not withheld, absent positive control, dermographism).';
COMMENT ON COLUMN allergy_skin_test_result.interpretation IS
    'Clinical interpretation of the reactions in the context of the history (sensitisation vs clinically relevant allergy).';
COMMENT ON COLUMN allergy_skin_test_result.impression IS
    'Summary impression / conclusion answering the clinical question.';
COMMENT ON COLUMN allergy_skin_test_result.reporting_category IS
    'Free-text structured-reporting category label (e.g. a sensitisation pattern or component-resolved diagnostics summary).';
COMMENT ON COLUMN allergy_skin_test_result.recommended_follow_up IS
    'Recommended follow-up: allergen avoidance advice, oral food / drug challenge, immunotherapy referral, or further testing.';
COMMENT ON COLUMN allergy_skin_test_result.critical_result_communicated IS
    'Whether a critical result (e.g. anaphylaxis during test, clinically significant new allergy) was communicated directly to the referrer / patient.';
COMMENT ON COLUMN allergy_skin_test_result.reported_to IS
    'Who the critical / urgent result was communicated to, with date and time if applicable.';
