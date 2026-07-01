-- Computed Apgar grading result (1:1 with the parent assessment). Stores a
-- snapshot of the derived per-timepoint totals and bands for the canonical
-- 1-, 5-, and 10-minute timepoints, an overall summary band (the worst band
-- observed), and the trend across scored timepoints. The per-timepoint input
-- signs live in the apgar_score_timepoint child table; this table is the
-- computed summary the engine emits.

CREATE TABLE apgar_score_grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    apgar_score_id UUID NOT NULL UNIQUE
        REFERENCES apgar_score(id) ON DELETE CASCADE,

    -- Per-timepoint totals (0-10) for the canonical 1/5/10-minute timepoints
    total_one_minute INT,
    total_five_minute INT,
    total_ten_minute INT,

    -- Per-timepoint bands for the canonical 1/5/10-minute timepoints
    band_one_minute VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (band_one_minute IN ('reassuring', 'moderately-low', 'low', '')),
    band_five_minute VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (band_five_minute IN ('reassuring', 'moderately-low', 'low', '')),
    band_ten_minute VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (band_ten_minute IN ('reassuring', 'moderately-low', 'low', '')),

    -- Overall summary band (the worst band across scored timepoints)
    summary_band VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (summary_band IN ('reassuring', 'moderately-low', 'low', '')),

    -- Trend across consecutive scored timepoints
    trend VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (trend IN ('improving', 'static', 'falling', 'insufficient', '')),

    graded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trigger_apgar_score_grade_updated_at
    BEFORE UPDATE ON apgar_score_grade
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE apgar_score_grade IS
    'Computed Apgar grading result (1:1): per-timepoint totals and bands for the canonical 1/5/10-minute timepoints, an overall summary band, and the trend across scored timepoints.';
COMMENT ON COLUMN apgar_score_grade.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN apgar_score_grade.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN apgar_score_grade.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN apgar_score_grade.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN apgar_score_grade.apgar_score_id IS
    'Foreign key to the parent assessment (unique, 1:1).';
COMMENT ON COLUMN apgar_score_grade.total_one_minute IS
    'Derived total (0-10) at the 1-minute timepoint, when scored.';
COMMENT ON COLUMN apgar_score_grade.total_five_minute IS
    'Derived total (0-10) at the 5-minute timepoint, when scored.';
COMMENT ON COLUMN apgar_score_grade.total_ten_minute IS
    'Derived total (0-10) at the 10-minute timepoint, when scored (expected whenever the 5-minute total is below 7).';
COMMENT ON COLUMN apgar_score_grade.band_one_minute IS
    'Derived band at the 1-minute timepoint: reassuring (7-10), moderately-low (4-6), or low (0-3).';
COMMENT ON COLUMN apgar_score_grade.band_five_minute IS
    'Derived band at the 5-minute timepoint: reassuring (7-10), moderately-low (4-6), or low (0-3).';
COMMENT ON COLUMN apgar_score_grade.band_ten_minute IS
    'Derived band at the 10-minute timepoint: reassuring (7-10), moderately-low (4-6), or low (0-3).';
COMMENT ON COLUMN apgar_score_grade.summary_band IS
    'Overall summary band: the worst (lowest) band observed across scored timepoints.';
COMMENT ON COLUMN apgar_score_grade.trend IS
    'Trend across consecutive scored timepoints: improving, static, falling, or insufficient (fewer than two scored timepoints).';
COMMENT ON COLUMN apgar_score_grade.graded_at IS
    'Timestamp when the engine last computed the grade.';
