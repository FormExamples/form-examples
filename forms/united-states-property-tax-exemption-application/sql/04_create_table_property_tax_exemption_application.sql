-- Main property tax exemption application: one applicant's claim for a residential
-- homestead exemption and related relief (senior, disability, veteran,
-- circuit-breaker) with assessment-appeal basics. The eligibility result, the
-- audit trail of rules, and the flagged issues live in child tables. This record
-- documents the claim; the county assessor decides it.

CREATE TABLE property_tax_exemption_application (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    applicant_id UUID NOT NULL REFERENCES applicant(id) ON DELETE RESTRICT,
    assessor_id UUID REFERENCES assessor(id) ON DELETE RESTRICT,
    applicant_name TEXT NOT NULL DEFAULT '',
    date_of_birth DATE,
    age_on_assessment_date INTEGER,
    mailing_address TEXT NOT NULL DEFAULT '',
    state VARCHAR(2) NOT NULL DEFAULT '',
    county TEXT NOT NULL DEFAULT '',
    parcel_number VARCHAR(50) NOT NULL DEFAULT '',
    property_address TEXT NOT NULL DEFAULT '',
    property_type VARCHAR(20) NOT NULL DEFAULT '' CHECK (property_type IN ('single-family', 'condominium', 'manufactured-home', 'multi-unit', 'other', '')),
    ownership_type VARCHAR(20) NOT NULL DEFAULT '' CHECK (ownership_type IN ('sole', 'joint', 'trust', 'life-estate', 'contract-buyer', 'other', '')),
    owner_on_assessment_date VARCHAR(5) NOT NULL DEFAULT '' CHECK (owner_on_assessment_date IN ('yes', 'no', '')),
    occupied_as_primary_residence VARCHAR(5) NOT NULL DEFAULT '' CHECK (occupied_as_primary_residence IN ('yes', 'no', '')),
    occupancy_start_date DATE,
    other_homestead_claimed VARCHAR(5) NOT NULL DEFAULT '' CHECK (other_homestead_claimed IN ('yes', 'no', '')),
    claim_homestead VARCHAR(5) NOT NULL DEFAULT '' CHECK (claim_homestead IN ('yes', 'no', '')),
    claim_senior VARCHAR(5) NOT NULL DEFAULT '' CHECK (claim_senior IN ('yes', 'no', '')),
    claim_disability VARCHAR(5) NOT NULL DEFAULT '' CHECK (claim_disability IN ('yes', 'no', '')),
    claim_veteran VARCHAR(5) NOT NULL DEFAULT '' CHECK (claim_veteran IN ('yes', 'no', '')),
    claim_circuit_breaker VARCHAR(5) NOT NULL DEFAULT '' CHECK (claim_circuit_breaker IN ('yes', 'no', '')),
    veteran_disability_percent INTEGER CHECK (veteran_disability_percent IS NULL OR (veteran_disability_percent BETWEEN 0 AND 100)),
    household_income_dollars INTEGER CHECK (household_income_dollars IS NULL OR household_income_dollars >= 0),
    income_tax_year INTEGER,
    assessment_year INTEGER,
    filing_date DATE,
    application_type VARCHAR(10) NOT NULL DEFAULT '' CHECK (application_type IN ('initial', 'renewal', 'late', '')),
    proof_of_ownership VARCHAR(5) NOT NULL DEFAULT '' CHECK (proof_of_ownership IN ('yes', 'no', '')),
    proof_of_residency VARCHAR(5) NOT NULL DEFAULT '' CHECK (proof_of_residency IN ('yes', 'no', '')),
    proof_of_age VARCHAR(5) NOT NULL DEFAULT '' CHECK (proof_of_age IN ('yes', 'no', '')),
    proof_of_income VARCHAR(5) NOT NULL DEFAULT '' CHECK (proof_of_income IN ('yes', 'no', '')),
    proof_of_disability VARCHAR(5) NOT NULL DEFAULT '' CHECK (proof_of_disability IN ('yes', 'no', '')),
    appeal_requested VARCHAR(5) NOT NULL DEFAULT '' CHECK (appeal_requested IN ('yes', 'no', '')),
    notice_of_value_date DATE,
    appeal_filed VARCHAR(5) NOT NULL DEFAULT '' CHECK (appeal_filed IN ('yes', 'no', '')),
    penalty_acknowledged VARCHAR(5) NOT NULL DEFAULT '' CHECK (penalty_acknowledged IN ('yes', 'no', '')),
    signed_by_applicant VARCHAR(5) NOT NULL DEFAULT '' CHECK (signed_by_applicant IN ('yes', 'no', '')),
    signature_date DATE
);

CREATE INDEX property_tax_exemption_application_applicant_id_idx
    ON property_tax_exemption_application (applicant_id);
CREATE INDEX property_tax_exemption_application_assessor_id_idx
    ON property_tax_exemption_application (assessor_id);
CREATE INDEX property_tax_exemption_application_state_idx
    ON property_tax_exemption_application (state);

CREATE TRIGGER trigger_property_tax_exemption_application_updated_at
    BEFORE UPDATE ON property_tax_exemption_application
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE property_tax_exemption_application IS
    'Main United States property tax exemption application: parcel, ownership and occupancy on the assessment date, exemptions claimed, income, proof documents, filing date, appeal basics and the signed declaration.';
COMMENT ON COLUMN property_tax_exemption_application.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN property_tax_exemption_application.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN property_tax_exemption_application.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN property_tax_exemption_application.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN property_tax_exemption_application.applicant_id IS
    'Foreign key to the applicant.';
COMMENT ON COLUMN property_tax_exemption_application.assessor_id IS
    'Foreign key to the assessing official; null until assigned.';
COMMENT ON COLUMN property_tax_exemption_application.applicant_name IS
    'Applicant name as written on the application.';
COMMENT ON COLUMN property_tax_exemption_application.date_of_birth IS
    'Applicant date of birth; used for the senior age test.';
COMMENT ON COLUMN property_tax_exemption_application.age_on_assessment_date IS
    'Applicant age in whole years on the assessment date.';
COMMENT ON COLUMN property_tax_exemption_application.mailing_address IS
    'Mailing address for notices about the application.';
COMMENT ON COLUMN property_tax_exemption_application.state IS
    'Two-letter code of the state where the property is located; selects the state rule set.';
COMMENT ON COLUMN property_tax_exemption_application.county IS
    'County where the property is located.';
COMMENT ON COLUMN property_tax_exemption_application.parcel_number IS
    'Assessor parcel number (APN) or account number identifying the property.';
COMMENT ON COLUMN property_tax_exemption_application.property_address IS
    'Street address of the property claiming the exemption.';
COMMENT ON COLUMN property_tax_exemption_application.property_type IS
    'Property type: single-family, condominium, manufactured-home, multi-unit, or other.';
COMMENT ON COLUMN property_tax_exemption_application.ownership_type IS
    'How the applicant holds title: sole, joint, trust, life-estate, contract-buyer, or other.';
COMMENT ON COLUMN property_tax_exemption_application.owner_on_assessment_date IS
    'Whether the applicant held title on the assessment (lien) date (yes/no).';
COMMENT ON COLUMN property_tax_exemption_application.occupied_as_primary_residence IS
    'Whether the applicant occupied the property as the primary residence on the assessment date (yes/no).';
COMMENT ON COLUMN property_tax_exemption_application.occupancy_start_date IS
    'Date the applicant began occupying the property as a primary residence.';
COMMENT ON COLUMN property_tax_exemption_application.other_homestead_claimed IS
    'Whether a homestead exemption is already claimed on another property (yes/no); only one is allowed.';
COMMENT ON COLUMN property_tax_exemption_application.claim_homestead IS
    'Whether the general homestead exemption is claimed (yes/no).';
COMMENT ON COLUMN property_tax_exemption_application.claim_senior IS
    'Whether a senior (age-based) exemption or relief is claimed (yes/no).';
COMMENT ON COLUMN property_tax_exemption_application.claim_disability IS
    'Whether a disability exemption is claimed (yes/no).';
COMMENT ON COLUMN property_tax_exemption_application.claim_veteran IS
    'Whether a disabled-veteran exemption is claimed (yes/no).';
COMMENT ON COLUMN property_tax_exemption_application.claim_circuit_breaker IS
    'Whether circuit-breaker (income-based property tax relief) is claimed (yes/no).';
COMMENT ON COLUMN property_tax_exemption_application.veteran_disability_percent IS
    'VA service-connected disability rating percent (0 to 100); null when not applicable.';
COMMENT ON COLUMN property_tax_exemption_application.household_income_dollars IS
    'Total household income in whole US dollars for the income year.';
COMMENT ON COLUMN property_tax_exemption_application.income_tax_year IS
    'Calendar year the reported household income covers.';
COMMENT ON COLUMN property_tax_exemption_application.assessment_year IS
    'Assessment or tax year the exemption is sought for.';
COMMENT ON COLUMN property_tax_exemption_application.filing_date IS
    'Date the application is filed with the assessor.';
COMMENT ON COLUMN property_tax_exemption_application.application_type IS
    'Application type: initial, renewal, or late (late-filing relief requested).';
COMMENT ON COLUMN property_tax_exemption_application.proof_of_ownership IS
    'Whether proof of ownership (deed) is attached (yes/no).';
COMMENT ON COLUMN property_tax_exemption_application.proof_of_residency IS
    'Whether proof of residency (driver licence, voter or vehicle registration) is attached (yes/no).';
COMMENT ON COLUMN property_tax_exemption_application.proof_of_age IS
    'Whether proof of age is attached (yes/no).';
COMMENT ON COLUMN property_tax_exemption_application.proof_of_income IS
    'Whether proof of income (tax return, benefit letter) is attached (yes/no).';
COMMENT ON COLUMN property_tax_exemption_application.proof_of_disability IS
    'Whether proof of disability or VA rating is attached (yes/no).';
COMMENT ON COLUMN property_tax_exemption_application.appeal_requested IS
    'Whether the applicant wants guidance on appealing the assessed value (yes/no).';
COMMENT ON COLUMN property_tax_exemption_application.notice_of_value_date IS
    'Date of the assessment or value notice, which starts the appeal window.';
COMMENT ON COLUMN property_tax_exemption_application.appeal_filed IS
    'Whether an assessment appeal has already been filed (yes/no).';
COMMENT ON COLUMN property_tax_exemption_application.penalty_acknowledged IS
    'Whether the applicant acknowledged the penalty for a false statement (yes/no).';
COMMENT ON COLUMN property_tax_exemption_application.signed_by_applicant IS
    'Whether the applicant signed the declaration (yes/no).';
COMMENT ON COLUMN property_tax_exemption_application.signature_date IS
    'Date the applicant signed the declaration.';
