-- Main United States marriage license application: one application by two
-- people to a state or county clerk for a marriage license and, after the
-- ceremony, the certified marriage certificate. It captures the issuing
-- jurisdiction, both applicants, eligibility (age and consent, prior
-- marriages, relationship, proxy), the ceremony (officiant, witnesses), and the
-- license return. The eligibility classification, the audit trail of fired
-- rules, and the flagged issues live in dedicated child tables. This is
-- documentation support, not legal advice; the issuing clerk or court decides.

CREATE TABLE united_states_marriage_license_application (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    first_applicant_id UUID NOT NULL REFERENCES applicant(id) ON DELETE RESTRICT,
    second_applicant_id UUID NOT NULL REFERENCES applicant(id) ON DELETE RESTRICT,
    county_clerk_id UUID REFERENCES county_clerk(id) ON DELETE RESTRICT,
    state VARCHAR(2) NOT NULL DEFAULT '',
    county TEXT NOT NULL DEFAULT '',
    application_date DATE,
    license_type VARCHAR(12) NOT NULL DEFAULT '' CHECK (license_type IN ('standard', 'confidential', '')),
    first_applicant_name TEXT NOT NULL DEFAULT '',
    first_applicant_sex VARCHAR(9) NOT NULL DEFAULT '' CHECK (first_applicant_sex IN ('female', 'male', 'nonbinary', 'unknown', '')),
    first_applicant_date_of_birth DATE,
    first_applicant_place_of_birth TEXT NOT NULL DEFAULT '',
    first_applicant_residence_state VARCHAR(2) NOT NULL DEFAULT '',
    first_applicant_id_presented VARCHAR(3) NOT NULL DEFAULT '' CHECK (first_applicant_id_presented IN ('yes', 'no', '')),
    first_applicant_ssn_status VARCHAR(11) NOT NULL DEFAULT '' CHECK (first_applicant_ssn_status IN ('provided', 'none-issued', 'declined', '')),
    first_applicant_marital_status VARCHAR(17) NOT NULL DEFAULT '' CHECK (first_applicant_marital_status IN ('never-married', 'divorced', 'widowed', 'annulled', 'currently-married', '')),
    first_applicant_prior_marriage_ended_date DATE,
    second_applicant_name TEXT NOT NULL DEFAULT '',
    second_applicant_sex VARCHAR(9) NOT NULL DEFAULT '' CHECK (second_applicant_sex IN ('female', 'male', 'nonbinary', 'unknown', '')),
    second_applicant_date_of_birth DATE,
    second_applicant_place_of_birth TEXT NOT NULL DEFAULT '',
    second_applicant_residence_state VARCHAR(2) NOT NULL DEFAULT '',
    second_applicant_id_presented VARCHAR(3) NOT NULL DEFAULT '' CHECK (second_applicant_id_presented IN ('yes', 'no', '')),
    second_applicant_ssn_status VARCHAR(11) NOT NULL DEFAULT '' CHECK (second_applicant_ssn_status IN ('provided', 'none-issued', 'declined', '')),
    second_applicant_marital_status VARCHAR(17) NOT NULL DEFAULT '' CHECK (second_applicant_marital_status IN ('never-married', 'divorced', 'widowed', 'annulled', 'currently-married', '')),
    second_applicant_prior_marriage_ended_date DATE,
    relationship_between_applicants VARCHAR(18) NOT NULL DEFAULT '' CHECK (relationship_between_applicants IN ('not-related', 'related-prohibited', '')),
    minor_consent VARCHAR(16) NOT NULL DEFAULT '' CHECK (minor_consent IN ('not-applicable', 'parental-consent', 'court-order', 'none', '')),
    active_duty_military VARCHAR(3) NOT NULL DEFAULT '' CHECK (active_duty_military IN ('yes', 'no', '')),
    appear_in_person VARCHAR(3) NOT NULL DEFAULT '' CHECK (appear_in_person IN ('yes', 'no', '')),
    proxy_requested VARCHAR(3) NOT NULL DEFAULT '' CHECK (proxy_requested IN ('yes', 'no', '')),
    premarital_course_completed VARCHAR(3) NOT NULL DEFAULT '' CHECK (premarital_course_completed IN ('yes', 'no', '')),
    blood_test_evidence VARCHAR(12) NOT NULL DEFAULT '' CHECK (blood_test_evidence IN ('provided', 'not-required', 'not-provided', '')),
    fee_paid_usd NUMERIC(7,2),
    license_issued_date DATE,
    ceremony_date DATE,
    officiant_type VARCHAR(12) NOT NULL DEFAULT '' CHECK (officiant_type IN ('clergy', 'judge', 'clerk', 'notary', 'self-uniting', 'other', '')),
    officiant_name TEXT NOT NULL DEFAULT '',
    officiant_authorized VARCHAR(3) NOT NULL DEFAULT '' CHECK (officiant_authorized IN ('yes', 'no', '')),
    witness_count INTEGER,
    license_returned_date DATE,
    certified_copies_requested INTEGER,
    clerk_note TEXT NOT NULL DEFAULT ''
);

CREATE TRIGGER trigger_united_states_marriage_license_application_updated_at
    BEFORE UPDATE ON united_states_marriage_license_application
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE united_states_marriage_license_application IS
    'One United States marriage license application, covering the issuing jurisdiction, both applicants, eligibility, the ceremony, and the certified marriage certificate. Documentation support, not legal advice.';
COMMENT ON COLUMN united_states_marriage_license_application.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN united_states_marriage_license_application.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN united_states_marriage_license_application.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN united_states_marriage_license_application.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN united_states_marriage_license_application.first_applicant_id IS
    'Foreign key to the first applicant.';
COMMENT ON COLUMN united_states_marriage_license_application.second_applicant_id IS
    'Foreign key to the second applicant.';
COMMENT ON COLUMN united_states_marriage_license_application.county_clerk_id IS
    'Foreign key to the issuing county clerk office, if known.';
COMMENT ON COLUMN united_states_marriage_license_application.state IS
    'Two-letter USPS code of the issuing state; selects the state rule table in the engine.';
COMMENT ON COLUMN united_states_marriage_license_application.county IS
    'County (or issuing clerk jurisdiction) where the application is made.';
COMMENT ON COLUMN united_states_marriage_license_application.application_date IS
    'Date the application is made to the clerk.';
COMMENT ON COLUMN united_states_marriage_license_application.license_type IS
    'License type: standard (public) or confidential (for example California).';
COMMENT ON COLUMN united_states_marriage_license_application.first_applicant_name IS
    'Full legal name of the first applicant as it will appear on the license.';
COMMENT ON COLUMN united_states_marriage_license_application.first_applicant_sex IS
    'Sex or gender recorded for the first applicant: female, male, nonbinary, or unknown. Informational only; it never affects eligibility (Obergefell v. Hodges).';
COMMENT ON COLUMN united_states_marriage_license_application.first_applicant_date_of_birth IS
    'Date of birth of the first applicant.';
COMMENT ON COLUMN united_states_marriage_license_application.first_applicant_place_of_birth IS
    'City, state, and country of birth of the first applicant.';
COMMENT ON COLUMN united_states_marriage_license_application.first_applicant_residence_state IS
    'Two-letter state or territory of residence of the first applicant.';
COMMENT ON COLUMN united_states_marriage_license_application.first_applicant_id_presented IS
    'Whether the first applicant presented acceptable government photo identification (yes/no).';
COMMENT ON COLUMN united_states_marriage_license_application.first_applicant_ssn_status IS
    'Social Security number status of the first applicant: provided, none-issued, or declined. Never stores the number itself.';
COMMENT ON COLUMN united_states_marriage_license_application.first_applicant_marital_status IS
    'Marital status of the first applicant before this marriage: never-married, divorced, widowed, annulled, or currently-married.';
COMMENT ON COLUMN united_states_marriage_license_application.first_applicant_prior_marriage_ended_date IS
    'Date the first applicant''s most recent prior marriage ended by divorce, death, or annulment.';
COMMENT ON COLUMN united_states_marriage_license_application.second_applicant_name IS
    'Full legal name of the second applicant as it will appear on the license.';
COMMENT ON COLUMN united_states_marriage_license_application.second_applicant_sex IS
    'Sex or gender recorded for the second applicant: female, male, nonbinary, or unknown. Informational only; it never affects eligibility (Obergefell v. Hodges).';
COMMENT ON COLUMN united_states_marriage_license_application.second_applicant_date_of_birth IS
    'Date of birth of the second applicant.';
COMMENT ON COLUMN united_states_marriage_license_application.second_applicant_place_of_birth IS
    'City, state, and country of birth of the second applicant.';
COMMENT ON COLUMN united_states_marriage_license_application.second_applicant_residence_state IS
    'Two-letter state or territory of residence of the second applicant.';
COMMENT ON COLUMN united_states_marriage_license_application.second_applicant_id_presented IS
    'Whether the second applicant presented acceptable government photo identification (yes/no).';
COMMENT ON COLUMN united_states_marriage_license_application.second_applicant_ssn_status IS
    'Social Security number status of the second applicant: provided, none-issued, or declined. Never stores the number itself.';
COMMENT ON COLUMN united_states_marriage_license_application.second_applicant_marital_status IS
    'Marital status of the second applicant before this marriage: never-married, divorced, widowed, annulled, or currently-married.';
COMMENT ON COLUMN united_states_marriage_license_application.second_applicant_prior_marriage_ended_date IS
    'Date the second applicant''s most recent prior marriage ended by divorce, death, or annulment.';
COMMENT ON COLUMN united_states_marriage_license_application.relationship_between_applicants IS
    'Whether the applicants are related within a degree the state prohibits: not-related or related-prohibited.';
COMMENT ON COLUMN united_states_marriage_license_application.minor_consent IS
    'Consent for an applicant under 18: not-applicable, parental-consent, court-order, or none.';
COMMENT ON COLUMN united_states_marriage_license_application.active_duty_military IS
    'Whether either applicant is on active military duty (a waiting-period waiver in some states and the basis for proxy marriage).';
COMMENT ON COLUMN united_states_marriage_license_application.appear_in_person IS
    'Whether both applicants will appear in person before the clerk (yes/no).';
COMMENT ON COLUMN united_states_marriage_license_application.proxy_requested IS
    'Whether a proxy marriage is requested because one applicant cannot attend (yes/no).';
COMMENT ON COLUMN united_states_marriage_license_application.premarital_course_completed IS
    'Whether the couple completed a state-approved premarital education course (yes/no); waives the waiting period and reduces the fee in some states.';
COMMENT ON COLUMN united_states_marriage_license_application.blood_test_evidence IS
    'Premarital blood-test evidence: provided, not-required, or not-provided. No US state currently requires a test.';
COMMENT ON COLUMN united_states_marriage_license_application.fee_paid_usd IS
    'License fee paid, in US dollars; null when not yet paid.';
COMMENT ON COLUMN united_states_marriage_license_application.license_issued_date IS
    'Date the clerk issued the license; the waiting period and validity period run from here.';
COMMENT ON COLUMN united_states_marriage_license_application.ceremony_date IS
    'Date of the marriage ceremony.';
COMMENT ON COLUMN united_states_marriage_license_application.officiant_type IS
    'Who solemnizes the marriage: clergy, judge, clerk, notary, self-uniting, or other.';
COMMENT ON COLUMN united_states_marriage_license_application.officiant_name IS
    'Name of the person who solemnized the marriage.';
COMMENT ON COLUMN united_states_marriage_license_application.officiant_authorized IS
    'Whether the officiant is authorized to solemnize marriages in the state (yes/no).';
COMMENT ON COLUMN united_states_marriage_license_application.witness_count IS
    'Number of witnesses present at the ceremony; null when unanswered.';
COMMENT ON COLUMN united_states_marriage_license_application.license_returned_date IS
    'Date the signed license was returned to the clerk for recording; starts the certified marriage certificate.';
COMMENT ON COLUMN united_states_marriage_license_application.certified_copies_requested IS
    'Number of certified copies of the marriage certificate requested; null when unanswered.';
COMMENT ON COLUMN united_states_marriage_license_application.clerk_note IS
    'Free-text note from the applicants or the clerk.';

CREATE INDEX united_states_marriage_license_application_state_idx
    ON united_states_marriage_license_application (state);
