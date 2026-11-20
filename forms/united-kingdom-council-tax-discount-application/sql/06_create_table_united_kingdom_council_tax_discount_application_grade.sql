-- Computed completeness and eligibility result for a Council Tax discount
-- application. The engine classifies the application as likely-eligible,
-- incomplete or likely-ineligible, counts the adults and states the indicative
-- outcome. It is not a decision: eligibility is decided by the billing
-- authority.

CREATE TABLE united_kingdom_council_tax_discount_application.united_kingdom_council_tax_discount_application_grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    united_kingdom_council_tax_discount_application_id UUID NOT NULL UNIQUE REFERENCES united_kingdom_council_tax_discount_application.united_kingdom_council_tax_discount_application(id) ON DELETE CASCADE,
    eligibility_class VARCHAR(20) NOT NULL DEFAULT '' CHECK (eligibility_class IN ('likely-eligible', 'incomplete', 'likely-ineligible', '')),
    counted_adults INTEGER,
    indicative_outcome VARCHAR(30) NOT NULL DEFAULT '' CHECK (indicative_outcome IN ('25-percent-discount', '50-percent-discount', 'full-exemption', 'smi-disregard', 'band-reduction', 'care-leaver-relief', 'means-tested-reduction', 'none', '')),
    graded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trigger_united_kingdom_council_tax_discount_application_grade_updated_at
    BEFORE UPDATE ON united_kingdom_council_tax_discount_application.united_kingdom_council_tax_discount_application_grade
    FOR EACH ROW
    EXECUTE FUNCTION united_kingdom_council_tax_discount_application.set_updated_at();

COMMENT ON TABLE united_kingdom_council_tax_discount_application.united_kingdom_council_tax_discount_application_grade IS
    'Computed completeness and eligibility result for a Council Tax discount application. The engine classifies the application as likely-eligible, incomplete or likely-ineligible, counts the adults and states the indicative outcome. It is not a decision: eligibility is decided by the billing authority.';
COMMENT ON COLUMN united_kingdom_council_tax_discount_application.united_kingdom_council_tax_discount_application_grade.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN united_kingdom_council_tax_discount_application.united_kingdom_council_tax_discount_application_grade.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN united_kingdom_council_tax_discount_application.united_kingdom_council_tax_discount_application_grade.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN united_kingdom_council_tax_discount_application.united_kingdom_council_tax_discount_application_grade.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN united_kingdom_council_tax_discount_application.united_kingdom_council_tax_discount_application_grade.united_kingdom_council_tax_discount_application_id IS
    'Foreign key to the parent application (unique, 1:1).';
COMMENT ON COLUMN united_kingdom_council_tax_discount_application.united_kingdom_council_tax_discount_application_grade.eligibility_class IS
    'Eligibility classification: likely-eligible, incomplete or likely-ineligible (likely-ineligible takes precedence).';
COMMENT ON COLUMN united_kingdom_council_tax_discount_application.united_kingdom_council_tax_discount_application_grade.counted_adults IS
    'Number of counted adults: the applicant and occupants who are not disregarded.';
COMMENT ON COLUMN united_kingdom_council_tax_discount_application.united_kingdom_council_tax_discount_application_grade.indicative_outcome IS
    'Indicative outcome if the authority agrees: 25-percent-discount, 50-percent-discount, full-exemption, smi-disregard, band-reduction, care-leaver-relief, means-tested-reduction or none.';
COMMENT ON COLUMN united_kingdom_council_tax_discount_application.united_kingdom_council_tax_discount_application_grade.graded_at IS
    'Timestamp when the engine last computed the classification.';
