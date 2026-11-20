-- Computed completeness and evidence classification for a Social Security
-- card application (Form SS-5). The engine classifies the application as
-- ready-to-submit, incomplete, evidence-missing, or not-eligible, counts the
-- missing or unacceptable evidence items, and records whether a replacement
-- card limit (3 per calendar year, 10 per lifetime) is reached. This is a
-- completeness classification, not a decision: the Social Security
-- Administration decides every application.

CREATE TABLE united_states_social_security_card_application.ss5_application_grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    ss5_application_id UUID NOT NULL UNIQUE
        REFERENCES united_states_social_security_card_application.ss5_application(id) ON DELETE CASCADE,

    application_class VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (application_class IN ('ready-to-submit', 'incomplete', 'evidence-missing', 'not-eligible', '')),
    missing_evidence_count INTEGER NOT NULL DEFAULT 0 CHECK (missing_evidence_count >= 0),
    replacement_limit_reached VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (replacement_limit_reached IN ('yes', 'no', '')),

    graded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trigger_ss5_application_grade_updated_at
    BEFORE UPDATE ON united_states_social_security_card_application.ss5_application_grade
    FOR EACH ROW
    EXECUTE FUNCTION united_states_social_security_card_application.set_updated_at();

COMMENT ON TABLE united_states_social_security_card_application.ss5_application_grade IS
    'Computed completeness and evidence classification for a Social Security card application: class (ready-to-submit/incomplete/evidence-missing/not-eligible), count of missing evidence items, and whether a replacement limit is reached.';
COMMENT ON COLUMN united_states_social_security_card_application.ss5_application_grade.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN united_states_social_security_card_application.ss5_application_grade.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN united_states_social_security_card_application.ss5_application_grade.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN united_states_social_security_card_application.ss5_application_grade.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN united_states_social_security_card_application.ss5_application_grade.ss5_application_id IS
    'Foreign key to the parent application (unique, 1:1).';
COMMENT ON COLUMN united_states_social_security_card_application.ss5_application_grade.application_class IS
    'Application class: ready-to-submit, incomplete, evidence-missing, or not-eligible (not-eligible takes precedence, then incomplete, then evidence-missing).';
COMMENT ON COLUMN united_states_social_security_card_application.ss5_application_grade.missing_evidence_count IS
    'Number of required evidence items that are missing, expired, or not acceptable.';
COMMENT ON COLUMN united_states_social_security_card_application.ss5_application_grade.replacement_limit_reached IS
    'Whether a replacement card limit (3 per year or 10 per lifetime) is already reached (yes/no).';
COMMENT ON COLUMN united_states_social_security_card_application.ss5_application_grade.graded_at IS
    'Timestamp when the engine last computed the classification.';
