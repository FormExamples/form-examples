-- Audit trail of every decision-rule criterion that fired during the Ottawa
-- Ankle Rules computation. Each row records one criterion or precondition
-- firing with the instrument that produced it, the imaging region it informs,
-- and a human-readable description. Because this is a boolean decision rule
-- there are no points.

CREATE TABLE ottawa_ankle_rules_grade_rule (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    ottawa_ankle_rules_grade_id UUID NOT NULL
        REFERENCES ottawa_ankle_rules_grade(id) ON DELETE CASCADE,

    rule_id VARCHAR(40) NOT NULL,
    instrument VARCHAR(20) NOT NULL
        CHECK (instrument IN ('precondition', 'ankle-criterion', 'foot-criterion', 'weight-bearing', 'decision')),
    region VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (region IN ('ankle', 'foot', 'both', '')),
    category VARCHAR(50) NOT NULL DEFAULT '',
    description VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX ottawa_ankle_rules_grade_rule_grade_id_idx
    ON ottawa_ankle_rules_grade_rule (ottawa_ankle_rules_grade_id);

CREATE TRIGGER trigger_ottawa_ankle_rules_grade_rule_updated_at
    BEFORE UPDATE ON ottawa_ankle_rules_grade_rule
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE ottawa_ankle_rules_grade_rule IS
    'Audit trail of every decision-rule criterion that fired during the Ottawa Ankle Rules computation: instrument, imaging region, category, and description.';
COMMENT ON COLUMN ottawa_ankle_rules_grade_rule.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN ottawa_ankle_rules_grade_rule.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN ottawa_ankle_rules_grade_rule.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN ottawa_ankle_rules_grade_rule.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN ottawa_ankle_rules_grade_rule.ottawa_ankle_rules_grade_id IS
    'Foreign key to the parent grade.';
COMMENT ON COLUMN ottawa_ankle_rules_grade_rule.rule_id IS
    'Stable rule identifier (e.g. R-ANKLE-A1-LATERAL-MALLEOLUS-01).';
COMMENT ON COLUMN ottawa_ankle_rules_grade_rule.instrument IS
    'Decision instrument the criterion belongs to: precondition, ankle-criterion, foot-criterion, weight-bearing, or decision.';
COMMENT ON COLUMN ottawa_ankle_rules_grade_rule.region IS
    'Imaging region the criterion informs: ankle, foot, or both (unable-to-bear-weight feeds both).';
COMMENT ON COLUMN ottawa_ankle_rules_grade_rule.category IS
    'Subject category (e.g. zone-pain, bone-tenderness, weight-bearing).';
COMMENT ON COLUMN ottawa_ankle_rules_grade_rule.description IS
    'Human-readable description of why the criterion fired.';
