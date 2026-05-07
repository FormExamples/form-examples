CREATE TABLE outpatient_outcome_prom_grc (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    outpatient_outcome_id UUID NOT NULL UNIQUE
        REFERENCES outpatient_outcome(id) ON DELETE CASCADE,

    -- -3 = much worse, 0 = unchanged, +3 = much better
    global_rating_of_change SMALLINT CHECK (global_rating_of_change BETWEEN -3 AND 3),
    self_rated_health VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (self_rated_health IN ('excellent', 'very_good', 'good', 'fair', 'poor', ''))
);

CREATE TRIGGER trigger_assessment_prom_grc_updated_at
    BEFORE UPDATE ON assessment_prom_grc
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE outpatient_outcome_prom_grc IS
    'Global Rating of Change (7-point -3..+3) and self-rated health (5-level) PROM responses. Unlicensed, public-domain instruments.';
COMMENT ON COLUMN outpatient_outcome_prom_grc.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN outpatient_outcome_prom_grc.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN outpatient_outcome_prom_grc.updated_at IS
    'Timestamp when this row was updated most-recently.';
COMMENT ON COLUMN outpatient_outcome_prom_grc.deleted_at IS
    'Timestamp when this row was deleted i.e. soft-removed.';
COMMENT ON COLUMN outpatient_outcome_prom_grc.outpatient_outcome_id IS
    'Foreign key to the parent assessment (unique, enforcing 1:1).';
COMMENT ON COLUMN outpatient_outcome_prom_grc.global_rating_of_change IS
    'GRC 7-point Likert: -3 much worse, 0 unchanged, +3 much better.';
COMMENT ON COLUMN outpatient_outcome_prom_grc.self_rated_health IS
    'Self-rated health: excellent, very_good, good, fair, poor, or empty.';
