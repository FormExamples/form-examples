-- Computed PEWS grading result. Stores the per-parameter 0-3 sub-scores,
-- the aggregate total (0-21), the maximum single-parameter sub-score, the
-- derived escalation (risk) band, the single-parameter-3 and documented-concern
-- override-trigger indicators, and the recommended monitoring frequency. One row
-- per observation record (1:1).

CREATE TABLE paediatric_early_warning_score_grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    paediatric_early_warning_score_id UUID NOT NULL UNIQUE
        REFERENCES paediatric_early_warning_score(id) ON DELETE CASCADE,

    -- Aggregate total across the seven parameter sub-scores
    aggregate_score INTEGER,

    -- Maximum single-parameter sub-score (drives the single-parameter-3 trigger)
    max_parameter_score INTEGER,

    -- Per-parameter sub-scores (0-3 each). NULL when the underlying observation
    -- was not recorded (or the age band was unset for a rate parameter).
    respiratory_rate_score INTEGER,
    respiratory_effort_score INTEGER,
    oxygen_saturation_score INTEGER,
    supplemental_oxygen_score INTEGER,
    heart_rate_score INTEGER,
    capillary_refill_score INTEGER,
    consciousness_score INTEGER,

    -- Derived escalation (risk) band
    risk_band VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (risk_band IN ('routine', 'low', 'medium', 'high', '')),

    -- Override triggers (do not change the aggregate, but raise the escalation)
    single_parameter_trigger VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (single_parameter_trigger IN ('yes', 'no', '')),
    concern_trigger VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (concern_trigger IN ('yes', 'no', '')),

    -- Recommended monitoring frequency / escalation response for the band
    monitoring_frequency TEXT NOT NULL DEFAULT '',

    graded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trigger_paediatric_early_warning_score_grade_updated_at
    BEFORE UPDATE ON paediatric_early_warning_score_grade
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE paediatric_early_warning_score_grade IS
    'Computed PEWS grading result: per-parameter 0-3 sub-scores, aggregate total (0-21), maximum single-parameter sub-score, derived escalation band, single-parameter-3 and documented-concern override triggers, and recommended monitoring frequency. One row per observation record (1:1).';
COMMENT ON COLUMN paediatric_early_warning_score_grade.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN paediatric_early_warning_score_grade.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN paediatric_early_warning_score_grade.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN paediatric_early_warning_score_grade.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN paediatric_early_warning_score_grade.paediatric_early_warning_score_id IS
    'Foreign key to the parent observation record (unique, 1:1).';
COMMENT ON COLUMN paediatric_early_warning_score_grade.aggregate_score IS
    'Aggregate PEWS total (0-21): sum of the seven parameter sub-scores; NULL until computed.';
COMMENT ON COLUMN paediatric_early_warning_score_grade.max_parameter_score IS
    'Maximum of the seven parameter sub-scores (0-3); a value of 3 fires the single-parameter override trigger.';
COMMENT ON COLUMN paediatric_early_warning_score_grade.respiratory_rate_score IS
    'Respiratory-rate sub-score (0-3), scored against the age-band normal range; NULL when not recorded or the age band was unset.';
COMMENT ON COLUMN paediatric_early_warning_score_grade.respiratory_effort_score IS
    'Respiratory-effort / recession sub-score (0-3); NULL when not recorded.';
COMMENT ON COLUMN paediatric_early_warning_score_grade.oxygen_saturation_score IS
    'Oxygen-saturation (SpO2) sub-score (0-3); NULL when not recorded.';
COMMENT ON COLUMN paediatric_early_warning_score_grade.supplemental_oxygen_score IS
    'Supplemental-oxygen sub-score (0, 1, or 3); NULL when not recorded.';
COMMENT ON COLUMN paediatric_early_warning_score_grade.heart_rate_score IS
    'Heart-rate sub-score (0-3), scored against the age-band normal range; NULL when not recorded or the age band was unset.';
COMMENT ON COLUMN paediatric_early_warning_score_grade.capillary_refill_score IS
    'Capillary-refill / colour sub-score (0-3); NULL when not recorded.';
COMMENT ON COLUMN paediatric_early_warning_score_grade.consciousness_score IS
    'Consciousness (ACVPU) sub-score (0-3); NULL when not recorded.';
COMMENT ON COLUMN paediatric_early_warning_score_grade.risk_band IS
    'Derived escalation band from the aggregate total (>=6 high, 4-5 medium, 2-3 low, else routine), raised as needed by the override triggers.';
COMMENT ON COLUMN paediatric_early_warning_score_grade.single_parameter_trigger IS
    'Whether any single parameter scored 3 (max_parameter_score = 3), an independent escalation trigger to at least medium.';
COMMENT ON COLUMN paediatric_early_warning_score_grade.concern_trigger IS
    'Whether a documented nurse / staff or parent / carer concern fired an independent escalation trigger.';
COMMENT ON COLUMN paediatric_early_warning_score_grade.monitoring_frequency IS
    'Recommended monitoring frequency and escalation response for the escalation band (e.g. routine observations, hourly, continuous with immediate senior review).';
COMMENT ON COLUMN paediatric_early_warning_score_grade.graded_at IS
    'Timestamp when the engine last computed the grade.';
