-- Meeting outcome — the impact or change that results from the meeting:
-- goal reached, risk identified, alignment achieved, decision recorded.
-- Distinct from meeting_output: outputs are *things*, outcomes are *changes*.

CREATE TABLE meeting_outcome (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    meeting_id UUID NOT NULL REFERENCES meeting(id) ON DELETE CASCADE,
    position INTEGER NOT NULL DEFAULT 0
        CHECK (position >= 0),

    title VARCHAR(255) NOT NULL DEFAULT '',
    category VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (category IN (
            'goal-reached', 'risk-identified', 'risk-mitigated',
            'alignment-achieved', 'decision', 'blocker-cleared',
            'blocker-raised', 'commitment', 'no-outcome', 'other', ''
        )),
    description TEXT NOT NULL DEFAULT '',
    impact VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (impact IN ('low', 'medium', 'high', 'strategic', '')),
    related_action_item_id UUID REFERENCES action_item(id) ON DELETE SET NULL
);

CREATE TRIGGER trigger_meeting_outcome_updated_at
    BEFORE UPDATE ON meeting_outcome
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE meeting_outcome IS
    'The impact or change resulting from the meeting: goal reached, risk identified, alignment achieved, decision recorded. Distinct from meeting_output: outputs are things, outcomes are changes.';
COMMENT ON COLUMN meeting_outcome.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN meeting_outcome.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN meeting_outcome.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN meeting_outcome.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN meeting_outcome.meeting_id IS
    'Foreign key to the parent meeting.';
COMMENT ON COLUMN meeting_outcome.position IS
    'Zero-based ordinal of the outcome in the list.';
COMMENT ON COLUMN meeting_outcome.title IS
    'Short title summarising the outcome.';
COMMENT ON COLUMN meeting_outcome.category IS
    'Outcome category: goal-reached, risk-identified, risk-mitigated, alignment-achieved, decision, blocker-cleared, blocker-raised, commitment, no-outcome, other.';
COMMENT ON COLUMN meeting_outcome.description IS
    'Free-text description of the outcome.';
COMMENT ON COLUMN meeting_outcome.impact IS
    'Subjective impact rating: low, medium, high, strategic.';
COMMENT ON COLUMN meeting_outcome.related_action_item_id IS
    'Optional foreign key to an action_item that captures the follow-up needed for this outcome.';

CREATE INDEX meeting_outcome_index_meeting_id
    ON meeting_outcome(meeting_id);
CREATE INDEX meeting_outcome_index_meeting_id_position
    ON meeting_outcome(meeting_id, position);
