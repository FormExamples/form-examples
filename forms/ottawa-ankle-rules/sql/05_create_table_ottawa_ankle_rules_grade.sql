-- Computed Ottawa Ankle Rules decision result. This instrument is a boolean
-- decision rule, not a numeric score: it stores the derived unable-to-bear-
-- weight finding and the two independent imaging decisions (ankle X-ray
-- indicated, foot X-ray indicated). One-to-one with the parent assessment. The
-- criteria that fired live in the grade_rule child table; the flags live in the
-- grade_flag child table.

CREATE TABLE ottawa_ankle_rules_grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    ottawa_ankle_rules_id UUID NOT NULL UNIQUE
        REFERENCES ottawa_ankle_rules(id) ON DELETE CASCADE,

    unable_to_bear_weight VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (unable_to_bear_weight IN ('yes', 'no', '')),
    ankle_xray_indicated VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (ankle_xray_indicated IN ('yes', 'no', '')),
    foot_xray_indicated VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (foot_xray_indicated IN ('yes', 'no', '')),
    recommended_action TEXT NOT NULL DEFAULT '',
    graded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trigger_ottawa_ankle_rules_grade_updated_at
    BEFORE UPDATE ON ottawa_ankle_rules_grade
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE ottawa_ankle_rules_grade IS
    'Computed Ottawa Ankle Rules decision result: the derived unable-to-bear-weight finding and the two independent imaging decisions. One-to-one with the parent assessment.';
COMMENT ON COLUMN ottawa_ankle_rules_grade.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN ottawa_ankle_rules_grade.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN ottawa_ankle_rules_grade.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN ottawa_ankle_rules_grade.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN ottawa_ankle_rules_grade.ottawa_ankle_rules_id IS
    'Foreign key to the parent assessment (unique, 1:1).';
COMMENT ON COLUMN ottawa_ankle_rules_grade.unable_to_bear_weight IS
    'Derived: patient cannot take four steps both immediately after injury and at assessment (yes/no); contributes to both the ankle and foot decisions.';
COMMENT ON COLUMN ottawa_ankle_rules_grade.ankle_xray_indicated IS
    'Decision: an ankle X-ray series is indicated (yes/no), true when malleolar-zone pain plus any of lateral tenderness, medial tenderness, or unable-to-bear-weight.';
COMMENT ON COLUMN ottawa_ankle_rules_grade.foot_xray_indicated IS
    'Decision: a foot X-ray series is indicated (yes/no), true when midfoot-zone pain plus any of fifth-metatarsal-base tenderness, navicular tenderness, or unable-to-bear-weight.';
COMMENT ON COLUMN ottawa_ankle_rules_grade.recommended_action IS
    'Recommended imaging action derived from the two decisions (e.g. request ankle and foot radiographs, no imaging indicated).';
COMMENT ON COLUMN ottawa_ankle_rules_grade.graded_at IS
    'Timestamp when the engine last computed the decision.';
