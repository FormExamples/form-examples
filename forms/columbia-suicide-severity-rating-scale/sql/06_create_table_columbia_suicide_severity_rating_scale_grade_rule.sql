-- Audit trail of every classification rule that fired during C-SSRS
-- risk-tier computation. Each row records one rule firing with the
-- dimension it belongs to, the risk tier it contributed, a subject
-- category, and a human-readable description.

CREATE TABLE columbia_suicide_severity_rating_scale_grade_rule (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    columbia_suicide_severity_rating_scale_grade_id UUID NOT NULL
        REFERENCES columbia_suicide_severity_rating_scale_grade(id) ON DELETE CASCADE,

    rule_id VARCHAR(40) NOT NULL,
    dimension VARCHAR(20) NOT NULL
        CHECK (dimension IN ('ideation', 'behaviour', 'lethality', 'means', 'tier')),
    tier VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (tier IN ('low', 'moderate', 'high', '')),
    category VARCHAR(50) NOT NULL DEFAULT '',
    description VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX columbia_suicide_severity_rating_scale_grade_rule_grade_id_idx
    ON columbia_suicide_severity_rating_scale_grade_rule (columbia_suicide_severity_rating_scale_grade_id);

CREATE TRIGGER trigger_columbia_suicide_severity_rating_scale_grade_rule_updated_at
    BEFORE UPDATE ON columbia_suicide_severity_rating_scale_grade_rule
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE columbia_suicide_severity_rating_scale_grade_rule IS
    'Audit trail of every classification rule that fired during C-SSRS risk-tier computation: dimension, contributed tier, category, and description.';
COMMENT ON COLUMN columbia_suicide_severity_rating_scale_grade_rule.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN columbia_suicide_severity_rating_scale_grade_rule.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN columbia_suicide_severity_rating_scale_grade_rule.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN columbia_suicide_severity_rating_scale_grade_rule.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN columbia_suicide_severity_rating_scale_grade_rule.columbia_suicide_severity_rating_scale_grade_id IS
    'Foreign key to the parent grade.';
COMMENT ON COLUMN columbia_suicide_severity_rating_scale_grade_rule.rule_id IS
    'Stable rule identifier (e.g. R-IDEATION-LEVEL5-01).';
COMMENT ON COLUMN columbia_suicide_severity_rating_scale_grade_rule.dimension IS
    'Assessment dimension the rule belongs to: ideation, behaviour, lethality, means, or tier.';
COMMENT ON COLUMN columbia_suicide_severity_rating_scale_grade_rule.tier IS
    'Risk tier contributed by this rule: low, moderate, or high.';
COMMENT ON COLUMN columbia_suicide_severity_rating_scale_grade_rule.category IS
    'Subject category (e.g. ideation-level, recent-behaviour, high-lethality).';
COMMENT ON COLUMN columbia_suicide_severity_rating_scale_grade_rule.description IS
    'Human-readable description of why the rule fired.';
