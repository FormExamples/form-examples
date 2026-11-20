-- Flagged issues that fire independently of the eligibility class, with a
-- priority and a suggested action for the applicant or the billing authority.

CREATE TABLE united_kingdom_council_tax_discount_application_grade_flag (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    united_kingdom_council_tax_discount_application_grade_id UUID NOT NULL REFERENCES united_kingdom_council_tax_discount_application_grade(id) ON DELETE CASCADE,
    flag_id VARCHAR(50) NOT NULL,
    category VARCHAR(50) NOT NULL DEFAULT '' CHECK (category IN ('adult-count-mismatch', 'not-main-residence', 'student-evidence', 'smi-evidence', 'disability-adaptation', 'disregard-evidence', 'age-status-mismatch', 'backdating', 'care-leaver-age', 'duty-to-report-changes', 'fraud-warning', 'band-a-percentage', 'means-tested', 'incomplete-application', 'other', '')),
    priority VARCHAR(10) NOT NULL DEFAULT '' CHECK (priority IN ('low', 'medium', 'high', '')),
    description VARCHAR(500) NOT NULL DEFAULT '',
    suggested_action VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE TRIGGER trigger_united_kingdom_council_tax_discount_application_grade_flag_updated_at
    BEFORE UPDATE ON united_kingdom_council_tax_discount_application_grade_flag
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE united_kingdom_council_tax_discount_application_grade_flag IS
    'Flagged issues that fire independently of the eligibility class, with a priority and a suggested action for the applicant or the billing authority.';
COMMENT ON COLUMN united_kingdom_council_tax_discount_application_grade_flag.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN united_kingdom_council_tax_discount_application_grade_flag.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN united_kingdom_council_tax_discount_application_grade_flag.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN united_kingdom_council_tax_discount_application_grade_flag.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN united_kingdom_council_tax_discount_application_grade_flag.united_kingdom_council_tax_discount_application_grade_id IS
    'Foreign key to the parent grade.';
COMMENT ON COLUMN united_kingdom_council_tax_discount_application_grade_flag.flag_id IS
    'Stable identifier of the flag.';
COMMENT ON COLUMN united_kingdom_council_tax_discount_application_grade_flag.category IS
    'Flag category.';
COMMENT ON COLUMN united_kingdom_council_tax_discount_application_grade_flag.priority IS
    'Flag priority: low, medium or high.';
COMMENT ON COLUMN united_kingdom_council_tax_discount_application_grade_flag.description IS
    'Human-readable description of the flagged issue.';
COMMENT ON COLUMN united_kingdom_council_tax_discount_application_grade_flag.suggested_action IS
    'Suggested action to resolve the flag.';

CREATE INDEX ukctda_grade_flag_ukctda_grade_id_idx
    ON united_kingdom_council_tax_discount_application_grade_flag (united_kingdom_council_tax_discount_application_grade_id);
