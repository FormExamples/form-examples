-- Main application record: a request to a state or territory vital records office
-- for a certified copy of a US birth certificate. It captures the requester
-- relationship, purpose, the kind and number of copies, delivery and fee, the
-- identity and supporting documents, apostille need, and the signed declaration.
-- The completeness / eligibility classification lives in dedicated child tables.
-- The issuing agency decides; this record is documentation support, not legal advice.

CREATE TABLE united_states_birth_certificate_application (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    applicant_id UUID REFERENCES applicant(id) ON DELETE RESTRICT,
    registrant_id UUID NOT NULL REFERENCES registrant(id) ON DELETE RESTRICT,
    requester_relationship VARCHAR(25) NOT NULL DEFAULT '' CHECK (requester_relationship IN ('self', 'parent', 'legal-guardian', 'legal-representative', 'spouse', 'child', 'sibling', 'grandparent', 'grandchild', 'government-agency', 'other', '')),
    purpose VARCHAR(20) NOT NULL DEFAULT '' CHECK (purpose IN ('passport', 'real-id', 'school', 'employment', 'benefits', 'genealogy', 'foreign-use', 'other', '')),
    needs_apostille VARCHAR(5) NOT NULL DEFAULT '' CHECK (needs_apostille IN ('yes', 'no', '')),
    apostille_country TEXT NOT NULL DEFAULT '',
    certificate_type VARCHAR(25) NOT NULL DEFAULT '' CHECK (certificate_type IN ('certified-long-form', 'certified-short-form', 'informational', '')),
    copies INTEGER CHECK (copies IS NULL OR copies BETWEEN 1 AND 20),
    delivery_method VARCHAR(15) NOT NULL DEFAULT '' CHECK (delivery_method IN ('online', 'mail', 'in-person', '')),
    fee_enclosed_usd NUMERIC(8,2) CHECK (fee_enclosed_usd IS NULL OR fee_enclosed_usd >= 0),
    id_type VARCHAR(25) NOT NULL DEFAULT '' CHECK (id_type IN ('state-driver-license', 'state-id-card', 'us-passport', 'military-id', 'other-photo-id', 'none', '')),
    id_unexpired VARCHAR(5) NOT NULL DEFAULT '' CHECK (id_unexpired IN ('yes', 'no', '')),
    proof_of_relationship VARCHAR(5) NOT NULL DEFAULT '' CHECK (proof_of_relationship IN ('yes', 'no', '')),
    authority_document VARCHAR(5) NOT NULL DEFAULT '' CHECK (authority_document IN ('yes', 'no', '')),
    notarized_sworn_statement VARCHAR(5) NOT NULL DEFAULT '' CHECK (notarized_sworn_statement IN ('yes', 'no', '')),
    declaration_signed VARCHAR(5) NOT NULL DEFAULT '' CHECK (declaration_signed IN ('yes', 'no', '')),
    application_note TEXT NOT NULL DEFAULT ''
);

CREATE INDEX united_states_birth_certificate_application_applicant_id_idx
    ON united_states_birth_certificate_application (applicant_id);
CREATE INDEX united_states_birth_certificate_application_registrant_id_idx
    ON united_states_birth_certificate_application (registrant_id);

CREATE TRIGGER trigger_united_states_birth_certificate_application_updated_at
    BEFORE UPDATE ON united_states_birth_certificate_application
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE united_states_birth_certificate_application IS
    'A request for a certified copy of a US birth certificate from a state or territory vital records office, with eligibility, identification, fee, apostille, and declaration data.';
COMMENT ON COLUMN united_states_birth_certificate_application.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN united_states_birth_certificate_application.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN united_states_birth_certificate_application.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN united_states_birth_certificate_application.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN united_states_birth_certificate_application.applicant_id IS
    'Foreign key to the requester.';
COMMENT ON COLUMN united_states_birth_certificate_application.registrant_id IS
    'Foreign key to the person named on the certificate.';
COMMENT ON COLUMN united_states_birth_certificate_application.requester_relationship IS
    'Relationship of the requester to the registrant, which decides eligibility in restricted-access states.';
COMMENT ON COLUMN united_states_birth_certificate_application.purpose IS
    'Intended use of the certificate (passport, REAL ID, school, employment, benefits, genealogy, foreign use, other).';
COMMENT ON COLUMN united_states_birth_certificate_application.needs_apostille IS
    'Whether the certificate will be used abroad and needs an apostille (yes/no).';
COMMENT ON COLUMN united_states_birth_certificate_application.apostille_country IS
    'Destination country for an apostille or legalization.';
COMMENT ON COLUMN united_states_birth_certificate_application.certificate_type IS
    'Kind of copy requested: certified long form (full image), certified short form (abstract), or informational (not valid for identity).';
COMMENT ON COLUMN united_states_birth_certificate_application.copies IS
    'Number of copies requested (1 to 20).';
COMMENT ON COLUMN united_states_birth_certificate_application.delivery_method IS
    'How the application is submitted: online, mail, or in person.';
COMMENT ON COLUMN united_states_birth_certificate_application.fee_enclosed_usd IS
    'Total fee in US dollars included with the request.';
COMMENT ON COLUMN united_states_birth_certificate_application.id_type IS
    'Type of identification presented by the requester.';
COMMENT ON COLUMN united_states_birth_certificate_application.id_unexpired IS
    'Whether the identification is current and unexpired (yes/no).';
COMMENT ON COLUMN united_states_birth_certificate_application.proof_of_relationship IS
    'Whether documents proving the relationship to the registrant are included (yes/no).';
COMMENT ON COLUMN united_states_birth_certificate_application.authority_document IS
    'Whether a court order, guardianship letters, or legal-representation authority is included (yes/no).';
COMMENT ON COLUMN united_states_birth_certificate_application.notarized_sworn_statement IS
    'Whether a notarized sworn statement of identity is included, required by some states for mail requests (yes/no).';
COMMENT ON COLUMN united_states_birth_certificate_application.declaration_signed IS
    'Whether the applicant has signed the declaration under penalty of perjury (yes/no).';
COMMENT ON COLUMN united_states_birth_certificate_application.application_note IS
    'Free-text note from the applicant.';
