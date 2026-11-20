-- Computed completeness and validity-classification result for a United
-- Kingdom marriage certificate application. The engine classifies the
-- application as ready-to-submit, incomplete, needs-evidence, or ineligible,
-- computes the earliest and latest permitted ceremony dates from the notice
-- date, and records whether an immigration referral is indicated. This is a
-- validity classification, not a score, and it does not replace the register
-- office's decision on the notice.

CREATE TABLE united_kingdom_marriage_certificate_application_grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    united_kingdom_marriage_certificate_application_id UUID NOT NULL UNIQUE
        REFERENCES united_kingdom_marriage_certificate_application(id) ON DELETE CASCADE,

    validity_class VARCHAR(15) NOT NULL DEFAULT '' CHECK (validity_class IN ('ready-to-submit', 'incomplete', 'needs-evidence', 'ineligible', '')),
    earliest_ceremony_date DATE,
    latest_ceremony_date DATE,
    immigration_referral_indicated VARCHAR(3) NOT NULL DEFAULT '' CHECK (immigration_referral_indicated IN ('yes', 'no', '')),

    graded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trigger_united_kingdom_marriage_certificate_application_grade_updated_at
    BEFORE UPDATE ON united_kingdom_marriage_certificate_application_grade
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE united_kingdom_marriage_certificate_application_grade IS
    'Computed completeness and validity-classification result for a United Kingdom marriage certificate application: class (ready-to-submit/incomplete/needs-evidence/ineligible), earliest and latest permitted ceremony dates, and whether an immigration referral is indicated.';
COMMENT ON COLUMN united_kingdom_marriage_certificate_application_grade.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN united_kingdom_marriage_certificate_application_grade.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN united_kingdom_marriage_certificate_application_grade.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN united_kingdom_marriage_certificate_application_grade.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN united_kingdom_marriage_certificate_application_grade.united_kingdom_marriage_certificate_application_id IS
    'Foreign key to the parent certificate (unique, 1:1).';
COMMENT ON COLUMN united_kingdom_marriage_certificate_application_grade.validity_class IS
    'Application class: ready-to-submit, incomplete, needs-evidence, or ineligible.';
COMMENT ON COLUMN united_kingdom_marriage_certificate_application_grade.earliest_ceremony_date IS
    'Earliest permitted ceremony date: notice date plus 29 days (a later date when immigration referral applies is not computed).';
COMMENT ON COLUMN united_kingdom_marriage_certificate_application_grade.latest_ceremony_date IS
    'Latest valid ceremony date: 12 months after the notice date.';
COMMENT ON COLUMN united_kingdom_marriage_certificate_application_grade.immigration_referral_indicated IS
    'Whether a party''s immigration status means notice must be given together and may be referred to the Home Office (yes/no).';
COMMENT ON COLUMN united_kingdom_marriage_certificate_application_grade.earliest_ceremony_date IS
    'Earliest permitted ceremony date: notice date plus 29 days (a later date when immigration referral applies is not computed).';
COMMENT ON COLUMN united_kingdom_marriage_certificate_application_grade.latest_ceremony_date IS
    'Latest valid ceremony date: 12 months after the notice date.';
COMMENT ON COLUMN united_kingdom_marriage_certificate_application_grade.immigration_referral_indicated IS
    'Whether a party''s immigration status means notice must be given together and may be referred to the Home Office (yes/no).';
COMMENT ON COLUMN united_kingdom_marriage_certificate_application_grade.graded_at IS
    'Timestamp when the engine last computed the classification.';
