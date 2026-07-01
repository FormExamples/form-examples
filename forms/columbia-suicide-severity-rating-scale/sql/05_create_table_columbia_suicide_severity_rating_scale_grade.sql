-- Computed C-SSRS risk classification result. Stores the derived ordinal
-- ideation level (0-5), whether any suicidal behaviour is present and
-- whether it is recent, the Low / Moderate / High risk tier, a summary of
-- the positive features that drove the tier, and the management
-- recommendation. The fired rules and flags live in dedicated child tables.

CREATE TABLE columbia_suicide_severity_rating_scale_grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    columbia_suicide_severity_rating_scale_id UUID NOT NULL UNIQUE
        REFERENCES columbia_suicide_severity_rating_scale(id) ON DELETE CASCADE,

    ideation_level INT CHECK (ideation_level BETWEEN 0 AND 5),
    any_behaviour VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (any_behaviour IN ('yes', 'no', '')),
    recent_behaviour VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (recent_behaviour IN ('yes', 'no', '')),
    risk_tier VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (risk_tier IN ('low', 'moderate', 'high', '')),

    positive_features TEXT NOT NULL DEFAULT '',
    management_recommendation TEXT NOT NULL DEFAULT '',

    graded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trigger_columbia_suicide_severity_rating_scale_grade_updated_at
    BEFORE UPDATE ON columbia_suicide_severity_rating_scale_grade
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE columbia_suicide_severity_rating_scale_grade IS
    'Computed C-SSRS risk classification result: derived ideation level (0-5), behaviour-present and recent-behaviour flags, Low / Moderate / High risk tier, positive-features summary, and management recommendation.';
COMMENT ON COLUMN columbia_suicide_severity_rating_scale_grade.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN columbia_suicide_severity_rating_scale_grade.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN columbia_suicide_severity_rating_scale_grade.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN columbia_suicide_severity_rating_scale_grade.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN columbia_suicide_severity_rating_scale_grade.columbia_suicide_severity_rating_scale_id IS
    'Foreign key to the parent assessment (unique, 1:1).';
COMMENT ON COLUMN columbia_suicide_severity_rating_scale_grade.ideation_level IS
    'Derived ordinal ideation level 0-5: the highest affirmative ideation item (0 when none present).';
COMMENT ON COLUMN columbia_suicide_severity_rating_scale_grade.any_behaviour IS
    'Whether any suicidal behaviour is present (actual, interrupted, aborted attempt, or preparatory acts; NSSI excluded).';
COMMENT ON COLUMN columbia_suicide_severity_rating_scale_grade.recent_behaviour IS
    'Whether suicidal behaviour is present and occurred within the past 3 months.';
COMMENT ON COLUMN columbia_suicide_severity_rating_scale_grade.risk_tier IS
    'Derived risk tier: low, moderate, or high.';
COMMENT ON COLUMN columbia_suicide_severity_rating_scale_grade.positive_features IS
    'Human-readable summary of the positive features (fired criteria) that drove the risk tier.';
COMMENT ON COLUMN columbia_suicide_severity_rating_scale_grade.management_recommendation IS
    'Proportionate management recommendation for the derived risk tier.';
COMMENT ON COLUMN columbia_suicide_severity_rating_scale_grade.graded_at IS
    'Timestamp when the engine last computed the classification.';
