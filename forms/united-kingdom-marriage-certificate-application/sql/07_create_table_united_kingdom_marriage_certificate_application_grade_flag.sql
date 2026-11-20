-- Flagged issues that fire independently of the application class, with a
-- priority and a suggested action for the applicant or registrar.

CREATE TABLE united_kingdom_marriage_certificate_application_grade_flag (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    united_kingdom_marriage_certificate_application_grade_id UUID NOT NULL
        REFERENCES united_kingdom_marriage_certificate_application_grade(id) ON DELETE CASCADE,

    flag_id VARCHAR(50) NOT NULL,
    category VARCHAR(50) NOT NULL DEFAULT ''
        CHECK (category IN (
            'party-under-18',
            'already-married-or-civil-partnered',
            'closely-related',
            'notice-period-too-short',
            'notice-expires-before-ceremony',
            'prior-relationship-evidence-missing',
            'immigration-status-referral',
            'joint-notice-required',
            'residence-under-7-days',
            'identity-missing',
            'address-proof-missing',
            'venue-not-confirmed',
            'witnesses-insufficient',
            'required-fields-missing',
            'certificate-service-missing',
            'certificate-copies-invalid',
            'gro-index-reference-missing',
            'prior-evidence-check-fee',
            'other',
            ''
        )),
    priority VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (priority IN ('low', 'medium', 'high', '')),
    description VARCHAR(500) NOT NULL DEFAULT '',
    suggested_action VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX united_kingdom_marriage_certificate_application_grade_flag_grade_id_idx
    ON united_kingdom_marriage_certificate_application_grade_flag (united_kingdom_marriage_certificate_application_grade_id);

CREATE TRIGGER trigger_united_kingdom_marriage_certificate_application_grade_flag_updated_at
    BEFORE UPDATE ON united_kingdom_marriage_certificate_application_grade_flag
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE united_kingdom_marriage_certificate_application_grade_flag IS
    'Flagged issues that fire independently of the application class, with priority and a suggested action for the applicant or registrar.';
COMMENT ON COLUMN united_kingdom_marriage_certificate_application_grade_flag.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN united_kingdom_marriage_certificate_application_grade_flag.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN united_kingdom_marriage_certificate_application_grade_flag.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN united_kingdom_marriage_certificate_application_grade_flag.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN united_kingdom_marriage_certificate_application_grade_flag.united_kingdom_marriage_certificate_application_grade_id IS
    'Foreign key to the parent grade.';
COMMENT ON COLUMN united_kingdom_marriage_certificate_application_grade_flag.flag_id IS
    'Stable flag identifier (e.g. F-PARTY-UNDER-18-001).';
COMMENT ON COLUMN united_kingdom_marriage_certificate_application_grade_flag.category IS
    'Flag category: one of the eighteen flag categories (party-under-18, already-married-or-civil-partnered, closely-related, notice-period-too-short, notice-expires-before-ceremony, prior-relationship-evidence-missing, immigration-status-referral, joint-notice-required, residence-under-7-days, identity-missing, address-proof-missing, venue-not-confirmed, witnesses-insufficient, required-fields-missing, certificate-service-missing, certificate-copies-invalid, gro-index-reference-missing, prior-evidence-check-fee), or other.';
COMMENT ON COLUMN united_kingdom_marriage_certificate_application_grade_flag.priority IS
    'Priority: low, medium, high.';
COMMENT ON COLUMN united_kingdom_marriage_certificate_application_grade_flag.description IS
    'Human-readable description of what fired the flag.';
COMMENT ON COLUMN united_kingdom_marriage_certificate_application_grade_flag.suggested_action IS
    'Suggested action for the applicant or registrar (e.g. "bring the original decree absolute", "move the ceremony to the earliest permitted date or later").';
