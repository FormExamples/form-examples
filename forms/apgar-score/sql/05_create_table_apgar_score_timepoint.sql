-- Repeated per-timepoint five-sign scores for an Apgar assessment. Each row
-- is one timepoint (1, 5, 10 minutes, and beyond) and cascades from the
-- parent apgar_score. The five signs (appearance, pulse, grimace, activity,
-- respiration) are each scored 0, 1, or 2; total and band are the derived
-- per-timepoint result. The 1- and 5-minute timepoints are always present;
-- the 10-minute (and later) timepoint is expected whenever the 5-minute
-- total is below 7.

CREATE TABLE apgar_score_timepoint (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    apgar_score_id UUID NOT NULL REFERENCES apgar_score(id) ON DELETE CASCADE,

    timepoint_minutes INT,

    appearance VARCHAR(1) NOT NULL DEFAULT '' CHECK (appearance IN ('0', '1', '2', '')),
    pulse VARCHAR(1) NOT NULL DEFAULT '' CHECK (pulse IN ('0', '1', '2', '')),
    grimace VARCHAR(1) NOT NULL DEFAULT '' CHECK (grimace IN ('0', '1', '2', '')),
    activity VARCHAR(1) NOT NULL DEFAULT '' CHECK (activity IN ('0', '1', '2', '')),
    respiration VARCHAR(1) NOT NULL DEFAULT '' CHECK (respiration IN ('0', '1', '2', '')),

    total INT,
    band VARCHAR(20) NOT NULL DEFAULT '' CHECK (band IN ('reassuring', 'moderately-low', 'low', ''))
);

CREATE INDEX apgar_score_timepoint_apgar_score_id_idx
    ON apgar_score_timepoint (apgar_score_id);

CREATE TRIGGER trigger_apgar_score_timepoint_updated_at
    BEFORE UPDATE ON apgar_score_timepoint
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE apgar_score_timepoint IS
    'Repeated per-timepoint five-sign Apgar scores (1, 5, 10 minutes, and beyond); cascades from the parent apgar_score.';
COMMENT ON COLUMN apgar_score_timepoint.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN apgar_score_timepoint.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN apgar_score_timepoint.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN apgar_score_timepoint.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN apgar_score_timepoint.apgar_score_id IS
    'Foreign key to the parent Apgar assessment.';
COMMENT ON COLUMN apgar_score_timepoint.timepoint_minutes IS
    'Timepoint in minutes after birth at which this score was recorded (1, 5, 10, ...).';
COMMENT ON COLUMN apgar_score_timepoint.appearance IS
    'Sign A — appearance (skin colour), scored 0, 1, or 2.';
COMMENT ON COLUMN apgar_score_timepoint.pulse IS
    'Sign P — pulse (heart rate), scored 0, 1, or 2.';
COMMENT ON COLUMN apgar_score_timepoint.grimace IS
    'Sign G — grimace (reflex irritability), scored 0, 1, or 2.';
COMMENT ON COLUMN apgar_score_timepoint.activity IS
    'Sign A — activity (muscle tone), scored 0, 1, or 2.';
COMMENT ON COLUMN apgar_score_timepoint.respiration IS
    'Sign R — respiration, scored 0, 1, or 2.';
COMMENT ON COLUMN apgar_score_timepoint.total IS
    'Derived total for this timepoint: sum of the five signs (0-10).';
COMMENT ON COLUMN apgar_score_timepoint.band IS
    'Derived band for this timepoint: reassuring (7-10), moderately-low (4-6), or low (0-3).';
