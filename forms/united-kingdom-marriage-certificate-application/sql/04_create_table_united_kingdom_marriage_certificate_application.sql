-- Main United Kingdom marriage certificate application record: one notice of
-- marriage or civil partnership in England and Wales, with the planned
-- ceremony, both parties' residence, identity, prior-relationship and
-- immigration evidence, the witnesses, and the order for marriage
-- certificate copies from the General Register Office (GRO). The
-- completeness and validity classification, the audit trail of fired rules,
-- and the flagged issues live in dedicated child tables. This record
-- supports preparation of the application; it does not give legal advice and
-- the register office decides each notice.

CREATE TABLE united_kingdom_marriage_certificate_application.united_kingdom_marriage_certificate_application (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    applicant_id UUID NOT NULL REFERENCES united_kingdom_marriage_certificate_application.applicant(id) ON DELETE RESTRICT,
    registrar_id UUID REFERENCES united_kingdom_marriage_certificate_application.registrar(id) ON DELETE RESTRICT,

    notice_type VARCHAR(17) NOT NULL DEFAULT '' CHECK (notice_type IN ('marriage', 'civil-partnership', '')),
    notice_date DATE,
    registration_district TEXT NOT NULL DEFAULT '',
    notice_given_together VARCHAR(3) NOT NULL DEFAULT '' CHECK (notice_given_together IN ('yes', 'no', '')),
    ceremony_type VARCHAR(29) NOT NULL DEFAULT '' CHECK (ceremony_type IN ('civil-register-office', 'civil-approved-premises', 'religious-registered-building', 'anglican', '')),
    ceremony_date DATE,
    venue_name TEXT NOT NULL DEFAULT '',
    venue_confirmed VARCHAR(3) NOT NULL DEFAULT '' CHECK (venue_confirmed IN ('yes', 'no', '')),
    closely_related VARCHAR(3) NOT NULL DEFAULT '' CHECK (closely_related IN ('yes', 'no', '')),
    witness_count INTEGER,
    party_one_name TEXT NOT NULL DEFAULT '',
    party_one_date_of_birth DATE,
    party_one_days_resident_in_district INTEGER,
    party_one_nationality_status VARCHAR(20) NOT NULL DEFAULT '' CHECK (party_one_nationality_status IN ('british-or-irish', 'eu-settlement-scheme', 'other', '')),
    party_one_marital_status VARCHAR(36) NOT NULL DEFAULT '' CHECK (party_one_marital_status IN ('never-married', 'divorced', 'widowed', 'dissolved-civil-partnership', 'annulled', 'currently-married-or-civil-partnered', '')),
    party_one_identity_provided VARCHAR(3) NOT NULL DEFAULT '' CHECK (party_one_identity_provided IN ('yes', 'no', '')),
    party_one_address_proof_provided VARCHAR(3) NOT NULL DEFAULT '' CHECK (party_one_address_proof_provided IN ('yes', 'no', '')),
    party_one_prior_end_evidence_provided VARCHAR(14) NOT NULL DEFAULT '' CHECK (party_one_prior_end_evidence_provided IN ('yes', 'no', 'not-applicable', '')),
    party_one_immigration_evidence_provided VARCHAR(14) NOT NULL DEFAULT '' CHECK (party_one_immigration_evidence_provided IN ('yes', 'no', 'not-applicable', '')),
    party_two_name TEXT NOT NULL DEFAULT '',
    party_two_date_of_birth DATE,
    party_two_days_resident_in_district INTEGER,
    party_two_nationality_status VARCHAR(20) NOT NULL DEFAULT '' CHECK (party_two_nationality_status IN ('british-or-irish', 'eu-settlement-scheme', 'other', '')),
    party_two_marital_status VARCHAR(36) NOT NULL DEFAULT '' CHECK (party_two_marital_status IN ('never-married', 'divorced', 'widowed', 'dissolved-civil-partnership', 'annulled', 'currently-married-or-civil-partnered', '')),
    party_two_identity_provided VARCHAR(3) NOT NULL DEFAULT '' CHECK (party_two_identity_provided IN ('yes', 'no', '')),
    party_two_address_proof_provided VARCHAR(3) NOT NULL DEFAULT '' CHECK (party_two_address_proof_provided IN ('yes', 'no', '')),
    party_two_prior_end_evidence_provided VARCHAR(14) NOT NULL DEFAULT '' CHECK (party_two_prior_end_evidence_provided IN ('yes', 'no', 'not-applicable', '')),
    party_two_immigration_evidence_provided VARCHAR(14) NOT NULL DEFAULT '' CHECK (party_two_immigration_evidence_provided IN ('yes', 'no', 'not-applicable', '')),
    certificate_copies INTEGER,
    certificate_service VARCHAR(8) NOT NULL DEFAULT '' CHECK (certificate_service IN ('standard', 'priority', '')),
    gro_index_reference TEXT NOT NULL DEFAULT '',
    applicant_note TEXT NOT NULL DEFAULT ''
);

CREATE INDEX united_kingdom_marriage_certificate_application_applicant_id_idx
    ON united_kingdom_marriage_certificate_application.united_kingdom_marriage_certificate_application (applicant_id);
CREATE INDEX united_kingdom_marriage_certificate_application_registrar_id_idx
    ON united_kingdom_marriage_certificate_application.united_kingdom_marriage_certificate_application (registrar_id);

CREATE TRIGGER trigger_united_kingdom_marriage_certificate_application_updated_at
    BEFORE UPDATE ON united_kingdom_marriage_certificate_application.united_kingdom_marriage_certificate_application
    FOR EACH ROW
    EXECUTE FUNCTION united_kingdom_marriage_certificate_application.set_updated_at();

COMMENT ON TABLE united_kingdom_marriage_certificate_application.united_kingdom_marriage_certificate_application IS
    'Main United Kingdom marriage certificate application record: notice of marriage or civil partnership in England and Wales, planned ceremony, both parties'' residence, identity, prior-relationship and immigration evidence, witnesses, and the GRO certificate order. Classification, fired rules, and flags live in child tables.';
COMMENT ON COLUMN united_kingdom_marriage_certificate_application.united_kingdom_marriage_certificate_application.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN united_kingdom_marriage_certificate_application.united_kingdom_marriage_certificate_application.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN united_kingdom_marriage_certificate_application.united_kingdom_marriage_certificate_application.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN united_kingdom_marriage_certificate_application.united_kingdom_marriage_certificate_application.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN united_kingdom_marriage_certificate_application.united_kingdom_marriage_certificate_application.applicant_id IS
    'Foreign key to the applicant who submits this application (restrict delete).';
COMMENT ON COLUMN united_kingdom_marriage_certificate_application.united_kingdom_marriage_certificate_application.registrar_id IS
    'Foreign key to the registrar handling the notice (restrict delete); optional.';
COMMENT ON COLUMN united_kingdom_marriage_certificate_application.united_kingdom_marriage_certificate_application.notice_type IS
    'Whether notice is for a marriage or a civil partnership.';
COMMENT ON COLUMN united_kingdom_marriage_certificate_application.united_kingdom_marriage_certificate_application.notice_date IS
    'Date notice is (or will be) given at the register office.';
COMMENT ON COLUMN united_kingdom_marriage_certificate_application.united_kingdom_marriage_certificate_application.registration_district IS
    'Registration district where notice is given.';
COMMENT ON COLUMN united_kingdom_marriage_certificate_application.united_kingdom_marriage_certificate_application.notice_given_together IS
    'Whether both parties give notice together at one designated register office (yes/no).';
COMMENT ON COLUMN united_kingdom_marriage_certificate_application.united_kingdom_marriage_certificate_application.ceremony_type IS
    'Kind of ceremony planned.';
COMMENT ON COLUMN united_kingdom_marriage_certificate_application.united_kingdom_marriage_certificate_application.ceremony_date IS
    'Planned ceremony date; at least 29 days after notice and within 12 months of it.';
COMMENT ON COLUMN united_kingdom_marriage_certificate_application.united_kingdom_marriage_certificate_application.venue_name IS
    'Name and address of the final ceremony venue.';
COMMENT ON COLUMN united_kingdom_marriage_certificate_application.united_kingdom_marriage_certificate_application.venue_confirmed IS
    'Whether the final venue is confirmed and can be shown at the notice appointment (yes/no).';
COMMENT ON COLUMN united_kingdom_marriage_certificate_application.united_kingdom_marriage_certificate_application.closely_related IS
    'Whether the parties are within the prohibited degrees of relationship (yes/no).';
COMMENT ON COLUMN united_kingdom_marriage_certificate_application.united_kingdom_marriage_certificate_application.witness_count IS
    'Number of witnesses arranged; at least two are required.';
COMMENT ON COLUMN united_kingdom_marriage_certificate_application.united_kingdom_marriage_certificate_application.party_one_name IS
    'Full name of the first party as it will appear on the notice and certificate.';
COMMENT ON COLUMN united_kingdom_marriage_certificate_application.united_kingdom_marriage_certificate_application.party_one_date_of_birth IS
    'Date of birth of the first party; both parties must be 18 or over on the ceremony date.';
COMMENT ON COLUMN united_kingdom_marriage_certificate_application.united_kingdom_marriage_certificate_application.party_one_days_resident_in_district IS
    'Whole days the first party has lived in the registration district where notice is given; at least 7 are required.';
COMMENT ON COLUMN united_kingdom_marriage_certificate_application.united_kingdom_marriage_certificate_application.party_one_nationality_status IS
    'Immigration route of the first party: british-or-irish, eu-settlement-scheme (settled or pre-settled), or other (needs immigration evidence and joint notice).';
COMMENT ON COLUMN united_kingdom_marriage_certificate_application.united_kingdom_marriage_certificate_application.party_one_marital_status IS
    'Marital or civil partnership status of the first party; currently-married-or-civil-partnered bars a new marriage.';
COMMENT ON COLUMN united_kingdom_marriage_certificate_application.united_kingdom_marriage_certificate_application.party_one_identity_provided IS
    'Whether original photographic identity documents are available for the first party (yes/no).';
COMMENT ON COLUMN united_kingdom_marriage_certificate_application.united_kingdom_marriage_certificate_application.party_one_address_proof_provided IS
    'Whether original proof of home address is available for the first party (yes/no).';
COMMENT ON COLUMN united_kingdom_marriage_certificate_application.united_kingdom_marriage_certificate_application.party_one_prior_end_evidence_provided IS
    'Whether the decree absolute, final order, annulment or death certificate ending the first party''s previous marriage or civil partnership is available (yes/no/not-applicable).';
COMMENT ON COLUMN united_kingdom_marriage_certificate_application.united_kingdom_marriage_certificate_application.party_one_immigration_evidence_provided IS
    'Whether acceptable immigration evidence (passport, visa, eVisa share code, EU Settlement Scheme share code) is available for the first party (yes/no/not-applicable).';
COMMENT ON COLUMN united_kingdom_marriage_certificate_application.united_kingdom_marriage_certificate_application.party_two_name IS
    'Full name of the second party as it will appear on the notice and certificate.';
COMMENT ON COLUMN united_kingdom_marriage_certificate_application.united_kingdom_marriage_certificate_application.party_two_date_of_birth IS
    'Date of birth of the second party; both parties must be 18 or over on the ceremony date.';
COMMENT ON COLUMN united_kingdom_marriage_certificate_application.united_kingdom_marriage_certificate_application.party_two_days_resident_in_district IS
    'Whole days the second party has lived in the registration district where notice is given; at least 7 are required.';
COMMENT ON COLUMN united_kingdom_marriage_certificate_application.united_kingdom_marriage_certificate_application.party_two_nationality_status IS
    'Immigration route of the second party: british-or-irish, eu-settlement-scheme (settled or pre-settled), or other (needs immigration evidence and joint notice).';
COMMENT ON COLUMN united_kingdom_marriage_certificate_application.united_kingdom_marriage_certificate_application.party_two_marital_status IS
    'Marital or civil partnership status of the second party; currently-married-or-civil-partnered bars a new marriage.';
COMMENT ON COLUMN united_kingdom_marriage_certificate_application.united_kingdom_marriage_certificate_application.party_two_identity_provided IS
    'Whether original photographic identity documents are available for the second party (yes/no).';
COMMENT ON COLUMN united_kingdom_marriage_certificate_application.united_kingdom_marriage_certificate_application.party_two_address_proof_provided IS
    'Whether original proof of home address is available for the second party (yes/no).';
COMMENT ON COLUMN united_kingdom_marriage_certificate_application.united_kingdom_marriage_certificate_application.party_two_prior_end_evidence_provided IS
    'Whether the decree absolute, final order, annulment or death certificate ending the second party''s previous marriage or civil partnership is available (yes/no/not-applicable).';
COMMENT ON COLUMN united_kingdom_marriage_certificate_application.united_kingdom_marriage_certificate_application.party_two_immigration_evidence_provided IS
    'Whether acceptable immigration evidence (passport, visa, eVisa share code, EU Settlement Scheme share code) is available for the second party (yes/no/not-applicable).';
COMMENT ON COLUMN united_kingdom_marriage_certificate_application.united_kingdom_marriage_certificate_application.certificate_copies IS
    'Number of marriage certificate copies to order from the General Register Office (GRO) after the ceremony.';
COMMENT ON COLUMN united_kingdom_marriage_certificate_application.united_kingdom_marriage_certificate_application.certificate_service IS
    'GRO certificate service: standard or priority (next working day if ordered by 4pm).';
COMMENT ON COLUMN united_kingdom_marriage_certificate_application.united_kingdom_marriage_certificate_application.gro_index_reference IS
    'GRO index reference number, if known, which makes a standard order faster and cheaper.';
COMMENT ON COLUMN united_kingdom_marriage_certificate_application.united_kingdom_marriage_certificate_application.applicant_note IS
    'Free-text note from the applicant.';
