-- Computed MEWS grading result. Stores the five per-parameter
-- sub-scores, the aggregate total (0-14), the single-parameter trigger
-- (any single parameter = 3) indicator, the derived clinical-risk band,
-- and the recommended monitoring frequency. One row per observation
-- record (1:1).

CREATE TABLE modified_early_warning_score_grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    modified_early_warning_score_id UUID NOT NULL UNIQUE
        REFERENCES modified_early_warning_score(id) ON DELETE CASCADE,

    -- Aggregate total across the five parameters (0-14)
    aggregate_score INTEGER,

    -- Per-parameter sub-scores (0-3 each). NULL when the underlying
    -- observation was not recorded.
    systolic_blood_pressure_score INTEGER,
    heart_rate_score INTEGER,
    respiratory_rate_score INTEGER,
    temperature_score INTEGER,
    avpu_score INTEGER,

    -- Single-parameter trigger: whether any single parameter scored 3
    single_parameter_trigger VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (single_parameter_trigger IN ('yes', 'no', '')),

    -- Derived clinical-risk band and response
    risk_band VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (risk_band IN ('low', 'medium', 'high', '')),
    monitoring_frequency TEXT NOT NULL DEFAULT '',

    graded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trigger_modified_early_warning_score_grade_updated_at
    BEFORE UPDATE ON modified_early_warning_score_grade
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE modified_early_warning_score_grade IS
    'Computed MEWS grading result: five per-parameter sub-scores, aggregate total (0-14), single-parameter trigger indicator, derived clinical-risk band, and recommended monitoring frequency. One row per observation record (1:1).';
COMMENT ON COLUMN modified_early_warning_score_grade.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN modified_early_warning_score_grade.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN modified_early_warning_score_grade.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN modified_early_warning_score_grade.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN modified_early_warning_score_grade.modified_early_warning_score_id IS
    'Foreign key to the parent observation record (unique, 1:1).';
COMMENT ON COLUMN modified_early_warning_score_grade.aggregate_score IS
    'Aggregate MEWS total (0-14): sum of the five parameter sub-scores; NULL until computed.';
COMMENT ON COLUMN modified_early_warning_score_grade.systolic_blood_pressure_score IS
    'Systolic-blood-pressure sub-score (0-3); NULL when the observation was not recorded.';
COMMENT ON COLUMN modified_early_warning_score_grade.heart_rate_score IS
    'Heart-rate sub-score (0-3); NULL when not recorded.';
COMMENT ON COLUMN modified_early_warning_score_grade.respiratory_rate_score IS
    'Respiratory-rate sub-score (0-3); NULL when not recorded.';
COMMENT ON COLUMN modified_early_warning_score_grade.temperature_score IS
    'Temperature sub-score (0-3); NULL when not recorded.';
COMMENT ON COLUMN modified_early_warning_score_grade.avpu_score IS
    'Consciousness (AVPU) sub-score (0-3); NULL when not recorded.';
COMMENT ON COLUMN modified_early_warning_score_grade.single_parameter_trigger IS
    'Single-parameter trigger: whether any single parameter scored 3, which warrants urgent review regardless of the aggregate.';
COMMENT ON COLUMN modified_early_warning_score_grade.risk_band IS
    'Derived clinical-risk band: low (0-1), medium (2-4), or high (>= 5).';
COMMENT ON COLUMN modified_early_warning_score_grade.monitoring_frequency IS
    'Recommended monitoring frequency for the risk band (e.g. routine, increased, hourly, continuous).';
COMMENT ON COLUMN modified_early_warning_score_grade.graded_at IS
    'Timestamp when the engine last computed the grade.';
