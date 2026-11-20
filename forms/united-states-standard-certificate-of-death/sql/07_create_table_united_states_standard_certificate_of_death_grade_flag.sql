-- Prioritized flagged issues for one certificate.

CREATE TABLE united_states_standard_certificate_of_death.united_states_standard_certificate_of_death_grade_flag (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    united_states_standard_certificate_of_death_grade_id UUID NOT NULL
        REFERENCES united_states_standard_certificate_of_death.united_states_standard_certificate_of_death_grade(id) ON DELETE CASCADE,
    flag_id VARCHAR(50) NOT NULL,
    category VARCHAR(50) NOT NULL DEFAULT ''
        CHECK (category IN ('medical-examiner-referral-required', 'mechanism-of-death', 'missing-part-i', 'missing-manner', 'illogical-sequence', 'abbreviation-used', 'nonspecific-cause', 'missing-interval', 'pregnancy-item', 'tobacco-item', 'injury-items', 'manner-mismatch', 'pending-determination', 'incomplete-certifier', 'incomplete-decedent', 'incomplete-funeral-director', 'date-inconsistency', 'filing-deadline', 'disposition', 'certified-copies', 'verify-state-rule', 'other', '')),
    priority VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (priority IN ('low', 'medium', 'high', '')),
    description VARCHAR(500) NOT NULL DEFAULT '',
    suggested_action VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX usscd_grade_flag_grade_id_idx
    ON united_states_standard_certificate_of_death.united_states_standard_certificate_of_death_grade_flag (united_states_standard_certificate_of_death_grade_id);

CREATE TRIGGER trigger_united_states_standard_certificate_of_death_grade_flag_updated_at
    BEFORE UPDATE ON united_states_standard_certificate_of_death.united_states_standard_certificate_of_death_grade_flag
    FOR EACH ROW
    EXECUTE FUNCTION united_states_standard_certificate_of_death.set_updated_at();

COMMENT ON TABLE united_states_standard_certificate_of_death.united_states_standard_certificate_of_death_grade_flag IS
    'Flagged issues raised for a certificate, with category, priority, description, and suggested action.';
COMMENT ON COLUMN united_states_standard_certificate_of_death.united_states_standard_certificate_of_death_grade_flag.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN united_states_standard_certificate_of_death.united_states_standard_certificate_of_death_grade_flag.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN united_states_standard_certificate_of_death.united_states_standard_certificate_of_death_grade_flag.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN united_states_standard_certificate_of_death.united_states_standard_certificate_of_death_grade_flag.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN united_states_standard_certificate_of_death.united_states_standard_certificate_of_death_grade_flag.united_states_standard_certificate_of_death_grade_id IS
    'Foreign key to the parent grade.';
COMMENT ON COLUMN united_states_standard_certificate_of_death.united_states_standard_certificate_of_death_grade_flag.flag_id IS
    'Stable flag identifier (e.g. F-ME-REFERRAL-001).';
COMMENT ON COLUMN united_states_standard_certificate_of_death.united_states_standard_certificate_of_death_grade_flag.category IS
    'Flag category.';
COMMENT ON COLUMN united_states_standard_certificate_of_death.united_states_standard_certificate_of_death_grade_flag.priority IS
    'Flag priority: low, medium, or high.';
COMMENT ON COLUMN united_states_standard_certificate_of_death.united_states_standard_certificate_of_death_grade_flag.description IS
    'Human-readable description of the flagged issue.';
COMMENT ON COLUMN united_states_standard_certificate_of_death.united_states_standard_certificate_of_death_grade_flag.suggested_action IS
    'Suggested corrective action.';
