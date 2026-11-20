-- Computed eligibility classification for a marriage license application. The
-- engine classifies the application as ready-to-apply, incomplete, or
-- not-eligible, and derives the earliest permitted ceremony date and the
-- license expiry date from the state rule. This is a documentation
-- classification, not legal advice; the issuing clerk or court decides.

CREATE TABLE united_states_marriage_license_application.united_states_marriage_license_application_grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    united_states_marriage_license_application_id UUID NOT NULL UNIQUE
        REFERENCES united_states_marriage_license_application.united_states_marriage_license_application(id) ON DELETE CASCADE,
    application_class VARCHAR(14) NOT NULL DEFAULT '' CHECK (application_class IN ('ready-to-apply', 'incomplete', 'not-eligible', '')),
    earliest_ceremony_date DATE,
    license_expiry_date DATE,
    graded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trigger_united_states_marriage_license_application_grade_updated_at
    BEFORE UPDATE ON united_states_marriage_license_application.united_states_marriage_license_application_grade
    FOR EACH ROW
    EXECUTE FUNCTION united_states_marriage_license_application.set_updated_at();

COMMENT ON TABLE united_states_marriage_license_application.united_states_marriage_license_application_grade IS
    'Computed eligibility classification for a marriage license application: ready-to-apply, incomplete, or not-eligible, plus the derived earliest ceremony date and license expiry date.';
COMMENT ON COLUMN united_states_marriage_license_application.united_states_marriage_license_application_grade.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN united_states_marriage_license_application.united_states_marriage_license_application_grade.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN united_states_marriage_license_application.united_states_marriage_license_application_grade.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN united_states_marriage_license_application.united_states_marriage_license_application_grade.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN united_states_marriage_license_application.united_states_marriage_license_application_grade.united_states_marriage_license_application_id IS
    'Foreign key to the parent application (unique, 1:1).';
COMMENT ON COLUMN united_states_marriage_license_application.united_states_marriage_license_application_grade.application_class IS
    'Eligibility classification: ready-to-apply, incomplete, or not-eligible (not-eligible takes precedence).';
COMMENT ON COLUMN united_states_marriage_license_application.united_states_marriage_license_application_grade.earliest_ceremony_date IS
    'Derived earliest permitted ceremony date: license issue date plus the state waiting period; null when the issue date is unknown.';
COMMENT ON COLUMN united_states_marriage_license_application.united_states_marriage_license_application_grade.license_expiry_date IS
    'Derived last valid ceremony date: license issue date plus the state validity period; null when the issue date is unknown.';
COMMENT ON COLUMN united_states_marriage_license_application.united_states_marriage_license_application_grade.graded_at IS
    'Timestamp when the engine last computed the classification.';
