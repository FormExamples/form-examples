-- Computed NEWS2 grading result. Stores the per-parameter subscores,
-- the aggregate total (0-20+), the red-score (any single parameter = 3)
-- indicator, the derived clinical-risk band, and the RCP-recommended
-- monitoring frequency and escalation response. One row per observation
-- record (1:1).

CREATE TABLE national_early_warning_score_2_grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    national_early_warning_score_2_id UUID NOT NULL UNIQUE
        REFERENCES national_early_warning_score_2(id) ON DELETE CASCADE,

    -- Aggregate total across the six parameters plus the oxygen weighting
    aggregate_score INTEGER,

    -- Per-parameter subscores (0-3 each; oxygen is 0 or 2). NULL when the
    -- underlying observation was not recorded.
    respiratory_rate_score INTEGER,
    spo2_score INTEGER,
    oxygen_score INTEGER,
    blood_pressure_score INTEGER,
    pulse_score INTEGER,
    consciousness_score INTEGER,
    temperature_score INTEGER,

    -- Red score: whether any single parameter scored 3
    any_single_parameter_three VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (any_single_parameter_three IN ('yes', 'no', '')),

    -- Derived clinical-risk band and response
    risk_band VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (risk_band IN ('low', 'low-medium', 'medium', 'high', '')),
    monitoring_frequency TEXT NOT NULL DEFAULT '',
    recommendation TEXT NOT NULL DEFAULT '',

    graded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trigger_national_early_warning_score_2_grade_updated_at
    BEFORE UPDATE ON national_early_warning_score_2_grade
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE national_early_warning_score_2_grade IS
    'Computed NEWS2 grading result: per-parameter subscores, aggregate total (0-20+), red-score indicator, derived clinical-risk band, and RCP-recommended monitoring frequency and escalation response. One row per observation record (1:1).';
COMMENT ON COLUMN national_early_warning_score_2_grade.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN national_early_warning_score_2_grade.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN national_early_warning_score_2_grade.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN national_early_warning_score_2_grade.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN national_early_warning_score_2_grade.national_early_warning_score_2_id IS
    'Foreign key to the parent observation record (unique, 1:1).';
COMMENT ON COLUMN national_early_warning_score_2_grade.aggregate_score IS
    'Aggregate NEWS2 total (0-20+): sum of the six parameter subscores plus the supplemental-oxygen weighting; NULL until computed.';
COMMENT ON COLUMN national_early_warning_score_2_grade.respiratory_rate_score IS
    'Respiration-rate subscore (0-3); NULL when the observation was not recorded.';
COMMENT ON COLUMN national_early_warning_score_2_grade.spo2_score IS
    'Oxygen-saturation subscore (0-3), scored against the selected SpO2 scale; NULL when not recorded.';
COMMENT ON COLUMN national_early_warning_score_2_grade.oxygen_score IS
    'Supplemental-oxygen weighting: 2 when on oxygen, otherwise 0.';
COMMENT ON COLUMN national_early_warning_score_2_grade.blood_pressure_score IS
    'Systolic-blood-pressure subscore (0-3); NULL when not recorded.';
COMMENT ON COLUMN national_early_warning_score_2_grade.pulse_score IS
    'Pulse subscore (0-3); NULL when not recorded.';
COMMENT ON COLUMN national_early_warning_score_2_grade.consciousness_score IS
    'Consciousness (ACVPU) subscore: 3 for any value other than A (alert), otherwise 0; NULL when not recorded.';
COMMENT ON COLUMN national_early_warning_score_2_grade.temperature_score IS
    'Temperature subscore (0-3); NULL when not recorded.';
COMMENT ON COLUMN national_early_warning_score_2_grade.any_single_parameter_three IS
    'Red score: whether any single parameter scored 3, which escalates the band to at least low-medium.';
COMMENT ON COLUMN national_early_warning_score_2_grade.risk_band IS
    'Derived clinical-risk band (worst of aggregate band and red-score band): low, low-medium, medium, or high.';
COMMENT ON COLUMN national_early_warning_score_2_grade.monitoring_frequency IS
    'RCP-recommended monitoring frequency (e.g. 12-hourly, 4-6 hourly, 1-hourly, continuous).';
COMMENT ON COLUMN national_early_warning_score_2_grade.recommendation IS
    'RCP-recommended clinical response and escalation for the risk band.';
COMMENT ON COLUMN national_early_warning_score_2_grade.graded_at IS
    'Timestamp when the engine last computed the grade.';
