-- Audit trail of every grading rule that fired during PACU score
-- computation. Each row records one rule firing with the parameter it
-- belongs to, the points it contributed, and a human-readable
-- description.

CREATE TABLE post_anaesthesia_care_unit_record_grade_rule (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    post_anaesthesia_care_unit_record_grade_id UUID NOT NULL
        REFERENCES post_anaesthesia_care_unit_record_grade(id) ON DELETE CASCADE,

    rule_id VARCHAR(40) NOT NULL,
    parameter VARCHAR(20) NOT NULL
        CHECK (parameter IN ('activity', 'respiration', 'circulation', 'consciousness', 'oxygen-saturation', 'padss', 'readiness')),
    points INT,
    category VARCHAR(50) NOT NULL DEFAULT '',
    description VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX post_anaesthesia_care_unit_record_grade_rule_grade_id_idx
    ON post_anaesthesia_care_unit_record_grade_rule (post_anaesthesia_care_unit_record_grade_id);

CREATE TRIGGER trigger_post_anaesthesia_care_unit_record_grade_rule_updated_at
    BEFORE UPDATE ON post_anaesthesia_care_unit_record_grade_rule
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE post_anaesthesia_care_unit_record_grade_rule IS
    'Audit trail of every grading rule that fired during PACU score computation: parameter, points contributed, category, and description.';
COMMENT ON COLUMN post_anaesthesia_care_unit_record_grade_rule.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN post_anaesthesia_care_unit_record_grade_rule.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN post_anaesthesia_care_unit_record_grade_rule.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN post_anaesthesia_care_unit_record_grade_rule.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN post_anaesthesia_care_unit_record_grade_rule.post_anaesthesia_care_unit_record_grade_id IS
    'Foreign key to the parent grade.';
COMMENT ON COLUMN post_anaesthesia_care_unit_record_grade_rule.rule_id IS
    'Stable rule identifier (e.g. R-OXYGEN-SATURATION-2POINT-01).';
COMMENT ON COLUMN post_anaesthesia_care_unit_record_grade_rule.parameter IS
    'Scored parameter the rule belongs to: activity, respiration, circulation, consciousness, oxygen-saturation, padss, or readiness.';
COMMENT ON COLUMN post_anaesthesia_care_unit_record_grade_rule.points IS
    'Points (0-2) contributed by this rule for its parameter.';
COMMENT ON COLUMN post_anaesthesia_care_unit_record_grade_rule.category IS
    'Subject category (e.g. aldrete-level, padss-level, readiness-band).';
COMMENT ON COLUMN post_anaesthesia_care_unit_record_grade_rule.description IS
    'Human-readable description of why the rule fired.';
