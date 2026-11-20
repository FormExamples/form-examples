-- Flagged issues that fire independently of the validity class, with a
-- priority and a suggested action for the drafter or supervising
-- attorney.

CREATE TABLE united_states_last_will_and_testament.united_states_last_will_and_testament_grade_flag (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    united_states_last_will_and_testament_grade_id UUID NOT NULL
        REFERENCES united_states_last_will_and_testament.united_states_last_will_and_testament_grade(id) ON DELETE CASCADE,

    flag_id VARCHAR(50) NOT NULL,
    category VARCHAR(50) NOT NULL DEFAULT ''
        CHECK (category IN (
            'capacity',
            'execution-formality',
            'witness',
            'self-proving',
            'bequest-arithmetic',
            'spousal-protection',
            'fiduciary',
            'state-rule',
            'digital-assets',
            'estate-tax',
            'incomplete',
            'other',
            ''
        )),
    priority VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (priority IN ('low', 'medium', 'high', '')),
    description VARCHAR(500) NOT NULL DEFAULT '',
    suggested_action VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX united_states_last_will_and_testament_grade_flag_grade_id_idx
    ON united_states_last_will_and_testament.united_states_last_will_and_testament_grade_flag (united_states_last_will_and_testament_grade_id);

CREATE TRIGGER trigger_united_states_last_will_and_testament_grade_flag_updated_at
    BEFORE UPDATE ON united_states_last_will_and_testament.united_states_last_will_and_testament_grade_flag
    FOR EACH ROW
    EXECUTE FUNCTION united_states_last_will_and_testament.set_updated_at();

COMMENT ON TABLE united_states_last_will_and_testament.united_states_last_will_and_testament_grade_flag IS
    'Flagged issues that fire independently of the validity class, with priority and a suggested action for the drafter or supervising attorney.';
COMMENT ON COLUMN united_states_last_will_and_testament.united_states_last_will_and_testament_grade_flag.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN united_states_last_will_and_testament.united_states_last_will_and_testament_grade_flag.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN united_states_last_will_and_testament.united_states_last_will_and_testament_grade_flag.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN united_states_last_will_and_testament.united_states_last_will_and_testament_grade_flag.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN united_states_last_will_and_testament.united_states_last_will_and_testament_grade_flag.united_states_last_will_and_testament_grade_id IS
    'Foreign key to the parent grade.';
COMMENT ON COLUMN united_states_last_will_and_testament.united_states_last_will_and_testament_grade_flag.flag_id IS
    'Stable flag identifier (e.g. F-WILL-011).';
COMMENT ON COLUMN united_states_last_will_and_testament.united_states_last_will_and_testament_grade_flag.category IS
    'Flag category: capacity, execution-formality, witness, self-proving, bequest-arithmetic, spousal-protection, fiduciary, state-rule, digital-assets, estate-tax, incomplete, or other.';
COMMENT ON COLUMN united_states_last_will_and_testament.united_states_last_will_and_testament_grade_flag.priority IS
    'Priority: low, medium, high.';
COMMENT ON COLUMN united_states_last_will_and_testament.united_states_last_will_and_testament_grade_flag.description IS
    'Human-readable description of what fired the flag.';
COMMENT ON COLUMN united_states_last_will_and_testament.united_states_last_will_and_testament_grade_flag.suggested_action IS
    'Suggested drafting action (e.g. "use two disinterested witnesses", "adjust the residuary percentages so they total 100").';
