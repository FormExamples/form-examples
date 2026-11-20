-- Computed completeness and eligibility classification for a birth certificate
-- application: ready-to-submit, incomplete, or ineligible-requester. Not legal
-- advice; the issuing agency decides.

CREATE TABLE united_states_birth_certificate_application.united_states_birth_certificate_application_grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    united_states_birth_certificate_application_id UUID NOT NULL UNIQUE REFERENCES united_states_birth_certificate_application.united_states_birth_certificate_application(id) ON DELETE CASCADE,
    application_class VARCHAR(25) NOT NULL DEFAULT '' CHECK (application_class IN ('ready-to-submit', 'incomplete', 'ineligible-requester', '')),
    state_rule_applied VARCHAR(20) NOT NULL DEFAULT '' CHECK (state_rule_applied IN ('state','default','')),
    expected_fee_usd NUMERIC(8,2),
    graded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);


CREATE TRIGGER trigger_united_states_birth_certificate_application_grade_updated_at
    BEFORE UPDATE ON united_states_birth_certificate_application.united_states_birth_certificate_application_grade
    FOR EACH ROW
    EXECUTE FUNCTION united_states_birth_certificate_application.set_updated_at();

COMMENT ON TABLE united_states_birth_certificate_application.united_states_birth_certificate_application_grade IS
    'Computed classification for a birth certificate application: ready-to-submit, incomplete, or ineligible-requester, with the applicable state and expected fee.';
COMMENT ON COLUMN united_states_birth_certificate_application.united_states_birth_certificate_application_grade.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN united_states_birth_certificate_application.united_states_birth_certificate_application_grade.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN united_states_birth_certificate_application.united_states_birth_certificate_application_grade.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN united_states_birth_certificate_application.united_states_birth_certificate_application_grade.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN united_states_birth_certificate_application.united_states_birth_certificate_application_grade.united_states_birth_certificate_application_id IS
    'Foreign key to the parent application (unique, 1:1).';
COMMENT ON COLUMN united_states_birth_certificate_application.united_states_birth_certificate_application_grade.application_class IS
    'Classification: ready-to-submit, incomplete, or ineligible-requester (ineligible-requester takes precedence).';
COMMENT ON COLUMN united_states_birth_certificate_application.united_states_birth_certificate_application_grade.state_rule_applied IS
    'Whether a verified state rule row or the uniform default rule was applied.';
COMMENT ON COLUMN united_states_birth_certificate_application.united_states_birth_certificate_application_grade.expected_fee_usd IS
    'Expected total fee in US dollars under the applied rule; null when the state fee is unknown.';
COMMENT ON COLUMN united_states_birth_certificate_application.united_states_birth_certificate_application_grade.graded_at IS
    'Timestamp when the engine last computed the classification.';
