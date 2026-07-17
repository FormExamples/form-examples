-- Audit trail of rules that fired during grading of a waiting list card.

CREATE TABLE gen_practice_waiting_list_card_grade_rule (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    gen_practice_waiting_list_card_grade_id UUID NOT NULL
        REFERENCES gen_practice_waiting_list_card_grade(id) ON DELETE CASCADE,
    rule_id VARCHAR(50) NOT NULL,
    instrument VARCHAR(30) NOT NULL
        CHECK (instrument IN ('waiting-time-status', 'clinical-priority', 'long-wait')),
    band VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (band IN (
            'within-target',
            'approaching-breach',
            'breached',
            'long-wait',
            ''
        )),
    category VARCHAR(50) NOT NULL DEFAULT '',
    description VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE TRIGGER trigger_gen_practice_waiting_list_card_grade_rule_updated_at
    BEFORE UPDATE ON gen_practice_waiting_list_card_grade_rule
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

CREATE INDEX index_gen_practice_waiting_list_card_grade_rule_grade_id
    ON gen_practice_waiting_list_card_grade_rule(gen_practice_waiting_list_card_grade_id);

COMMENT ON TABLE gen_practice_waiting_list_card_grade_rule IS
    'Audit trail of every waiting-time-status / clinical-priority / long-wait rule that fired during grading of a waiting list card.';
COMMENT ON COLUMN gen_practice_waiting_list_card_grade_rule.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN gen_practice_waiting_list_card_grade_rule.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN gen_practice_waiting_list_card_grade_rule.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN gen_practice_waiting_list_card_grade_rule.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN gen_practice_waiting_list_card_grade_rule.gen_practice_waiting_list_card_grade_id IS
    'Foreign key to the parent grade row.';
COMMENT ON COLUMN gen_practice_waiting_list_card_grade_rule.rule_id IS
    'Stable rule identifier (e.g. R-WTS-BREACHED-001).';
COMMENT ON COLUMN gen_practice_waiting_list_card_grade_rule.instrument IS
    'Scoring instrument the rule belongs to: waiting-time-status, clinical-priority, long-wait.';
COMMENT ON COLUMN gen_practice_waiting_list_card_grade_rule.band IS
    'Band contributed by this rule (e.g. breached).';
COMMENT ON COLUMN gen_practice_waiting_list_card_grade_rule.category IS
    'Category descriptor (e.g. rtt-18-week, priority-target, long-waiter).';
COMMENT ON COLUMN gen_practice_waiting_list_card_grade_rule.description IS
    'Human-readable description of why the rule fired.';
