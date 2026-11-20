-- Computed completeness and validity-classification result for a will plan.
-- The engine classifies the plan as valid-ready-to-execute, incomplete, or
-- formality-risk and records the residuary total, the estimated spousal
-- elective share, and whether the will is self-proved. This is a validity
-- classification, not a numeric score, and it does not replace the probate
-- court or a licensed attorney.

CREATE TABLE united_states_last_will_and_testament_grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    united_states_last_will_and_testament_id UUID NOT NULL UNIQUE
        REFERENCES united_states_last_will_and_testament(id) ON DELETE CASCADE,
    validity_class VARCHAR(25) NOT NULL DEFAULT '' CHECK (validity_class IN ('valid-ready-to-execute', 'incomplete', 'formality-risk', '')),
    residuary_percent_total NUMERIC(6,2),
    elective_share_amount NUMERIC(14,2),
    witness_count INTEGER,
    self_proved VARCHAR(3) NOT NULL DEFAULT '' CHECK (self_proved IN ('yes', 'no', '')),
    federal_estate_tax_exposure VARCHAR(3) NOT NULL DEFAULT '' CHECK (federal_estate_tax_exposure IN ('yes', 'no', '')),
    state_rule_source VARCHAR(20) NOT NULL DEFAULT '' CHECK (state_rule_source IN ('state-table', 'uniform-default', '')),
    graded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);


CREATE TRIGGER trigger_united_states_last_will_and_testament_grade_updated_at
    BEFORE UPDATE ON united_states_last_will_and_testament_grade
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE united_states_last_will_and_testament_grade IS
    'Computed completeness and validity-classification result for a will plan: validity class (valid-ready-to-execute/incomplete/formality-risk), residuary total, estimated spousal elective share, witness count, whether self-proved, federal estate-tax exposure, and the source of the state rule.';
COMMENT ON COLUMN united_states_last_will_and_testament_grade.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN united_states_last_will_and_testament_grade.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN united_states_last_will_and_testament_grade.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN united_states_last_will_and_testament_grade.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN united_states_last_will_and_testament_grade.united_states_last_will_and_testament_id IS
    'Foreign key to the parent record (unique, 1:1).';
COMMENT ON COLUMN united_states_last_will_and_testament_grade.validity_class IS
    'Validity classification: valid-ready-to-execute, incomplete, or formality-risk (formality-risk takes precedence).';
COMMENT ON COLUMN united_states_last_will_and_testament_grade.residuary_percent_total IS
    'Sum of the named residuary percentages; must be 100 when a residuary clause is present.';
COMMENT ON COLUMN united_states_last_will_and_testament_grade.elective_share_amount IS
    'Estimated spousal elective share in US dollars; null when not applicable.';
COMMENT ON COLUMN united_states_last_will_and_testament_grade.witness_count IS
    'Number of witnesses named.';
COMMENT ON COLUMN united_states_last_will_and_testament_grade.self_proved IS
    'Whether the will is self-proved under the state rule (yes/no).';
COMMENT ON COLUMN united_states_last_will_and_testament_grade.federal_estate_tax_exposure IS
    'Whether the estimated estate exceeds the 2026 federal basic exclusion of $15,000,000 (yes/no).';
COMMENT ON COLUMN united_states_last_will_and_testament_grade.state_rule_source IS
    'Where the state rule came from: state-table or uniform-default.';
COMMENT ON COLUMN united_states_last_will_and_testament_grade.graded_at IS
    'Timestamp when the engine last computed the classification.';
