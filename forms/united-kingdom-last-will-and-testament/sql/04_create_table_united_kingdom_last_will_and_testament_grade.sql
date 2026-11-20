-- Computed completeness and validity-classification result for a United
-- Kingdom Last Will and Testament. The engine classifies the will as valid
-- (ready to execute), incomplete, or formality-risk (an invalid-will risk),
-- totals the beneficiary shares, and counts the named witnesses. This is a
-- documentation classification, not a numeric score, and it is not legal
-- advice.

CREATE TABLE united_kingdom_last_will_and_testament.united_kingdom_last_will_and_testament_grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    united_kingdom_last_will_and_testament_id UUID NOT NULL UNIQUE
        REFERENCES united_kingdom_last_will_and_testament.united_kingdom_last_will_and_testament(id) ON DELETE CASCADE,

    validity_class VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (validity_class IN ('valid', 'incomplete', 'formality-risk', '')),
    shares_total_percent NUMERIC(6,2),
    witness_count INTEGER,
    formality_risk VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (formality_risk IN ('yes', 'no', '')),

    graded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trigger_united_kingdom_last_will_and_testament_grade_updated_at
    BEFORE UPDATE ON united_kingdom_last_will_and_testament.united_kingdom_last_will_and_testament_grade
    FOR EACH ROW
    EXECUTE FUNCTION united_kingdom_last_will_and_testament.set_updated_at();

COMMENT ON TABLE united_kingdom_last_will_and_testament.united_kingdom_last_will_and_testament_grade IS
    'Computed completeness and validity-classification result for a United Kingdom Last Will and Testament: validity class (valid/incomplete/formality-risk), total of beneficiary shares, count of named witnesses, and whether a formality risk is indicated.';
COMMENT ON COLUMN united_kingdom_last_will_and_testament.united_kingdom_last_will_and_testament_grade.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN united_kingdom_last_will_and_testament.united_kingdom_last_will_and_testament_grade.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN united_kingdom_last_will_and_testament.united_kingdom_last_will_and_testament_grade.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN united_kingdom_last_will_and_testament.united_kingdom_last_will_and_testament_grade.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN united_kingdom_last_will_and_testament.united_kingdom_last_will_and_testament_grade.united_kingdom_last_will_and_testament_id IS
    'Foreign key to the parent will (unique, 1:1).';
COMMENT ON COLUMN united_kingdom_last_will_and_testament.united_kingdom_last_will_and_testament_grade.validity_class IS
    'Validity classification: valid, incomplete, or formality-risk (formality-risk takes precedence over incomplete).';
COMMENT ON COLUMN united_kingdom_last_will_and_testament.united_kingdom_last_will_and_testament_grade.shares_total_percent IS
    'Sum of the beneficiary percentage shares; 100 when the residuary estate is fully allocated.';
COMMENT ON COLUMN united_kingdom_last_will_and_testament.united_kingdom_last_will_and_testament_grade.witness_count IS
    'Number of witnesses named in the execution section.';
COMMENT ON COLUMN united_kingdom_last_will_and_testament.united_kingdom_last_will_and_testament_grade.formality_risk IS
    'Whether a Wills Act 1837 formality risk is indicated (yes/no).';
COMMENT ON COLUMN united_kingdom_last_will_and_testament.united_kingdom_last_will_and_testament_grade.graded_at IS
    'Timestamp when the engine last computed the classification.';
