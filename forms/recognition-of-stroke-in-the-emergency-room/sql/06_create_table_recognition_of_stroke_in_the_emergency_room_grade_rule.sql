-- Audit trail of every grading rule that fired during ROSIER computation.
-- Each row records one rule firing with the criterion it belongs to, the
-- signed points it contributed, and a human-readable description.

CREATE TABLE recognition_of_stroke_in_the_emergency_room_grade_rule (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    recognition_of_stroke_in_the_emergency_room_grade_id UUID NOT NULL
        REFERENCES recognition_of_stroke_in_the_emergency_room_grade(id) ON DELETE CASCADE,

    rule_id VARCHAR(40) NOT NULL,
    criterion VARCHAR(30) NOT NULL
        CHECK (criterion IN ('loss-of-consciousness', 'seizure-activity', 'facial-weakness', 'arm-weakness', 'leg-weakness', 'speech-disturbance', 'visual-field-defect', 'band')),
    points INT,
    category VARCHAR(50) NOT NULL DEFAULT '',
    description VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX recognition_of_stroke_in_the_emergency_room_grade_rule_grade_id_idx
    ON recognition_of_stroke_in_the_emergency_room_grade_rule (recognition_of_stroke_in_the_emergency_room_grade_id);

CREATE TRIGGER trigger_recognition_of_stroke_in_the_emergency_room_grade_rule_updated_at
    BEFORE UPDATE ON recognition_of_stroke_in_the_emergency_room_grade_rule
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE recognition_of_stroke_in_the_emergency_room_grade_rule IS
    'Audit trail of every grading rule that fired during ROSIER computation: criterion, signed points contributed, category, and description.';
COMMENT ON COLUMN recognition_of_stroke_in_the_emergency_room_grade_rule.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN recognition_of_stroke_in_the_emergency_room_grade_rule.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN recognition_of_stroke_in_the_emergency_room_grade_rule.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN recognition_of_stroke_in_the_emergency_room_grade_rule.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN recognition_of_stroke_in_the_emergency_room_grade_rule.recognition_of_stroke_in_the_emergency_room_grade_id IS
    'Foreign key to the parent grade.';
COMMENT ON COLUMN recognition_of_stroke_in_the_emergency_room_grade_rule.rule_id IS
    'Stable rule identifier (e.g. R-FACIAL-WEAKNESS-01).';
COMMENT ON COLUMN recognition_of_stroke_in_the_emergency_room_grade_rule.criterion IS
    'Criterion the rule belongs to: loss-of-consciousness, seizure-activity, facial-weakness, arm-weakness, leg-weakness, speech-disturbance, visual-field-defect, or band.';
COMMENT ON COLUMN recognition_of_stroke_in_the_emergency_room_grade_rule.points IS
    'Signed points contributed by this rule (-1 for a mimic, +1 for a sign).';
COMMENT ON COLUMN recognition_of_stroke_in_the_emergency_room_grade_rule.category IS
    'Subject category (e.g. mimic, sign, band).';
COMMENT ON COLUMN recognition_of_stroke_in_the_emergency_room_grade_rule.description IS
    'Human-readable description of why the rule fired.';
