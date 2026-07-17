-- Computed grading result for a waiting list card.

CREATE TABLE ent_waiting_list_card_grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    ent_waiting_list_card_id UUID NOT NULL UNIQUE
        REFERENCES ent_waiting_list_card(id) ON DELETE CASCADE,

    waiting_time_status VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (waiting_time_status IN (
            'within-target',
            'approaching-breach',
            'breached',
            'long-wait',
            ''
        )),
    clinical_priority VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (clinical_priority IN ('P1a', 'P1b', 'P2', 'P3', 'P4', 'P5', 'P6', '')),
    target_wait_weeks NUMERIC(5,1),
    days_waited INTEGER
        CHECK (days_waited IS NULL OR days_waited >= 0),
    weeks_waited NUMERIC(5,1)
        CHECK (weeks_waited IS NULL OR weeks_waited >= 0),
    days_to_target INTEGER,
    days_to_breach INTEGER,
    days_to_appointment INTEGER,
    grader_notes TEXT NOT NULL DEFAULT '',
    graded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trigger_ent_waiting_list_card_grade_updated_at
    BEFORE UPDATE ON ent_waiting_list_card_grade
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

CREATE INDEX index_ent_waiting_list_card_grade_card_id
    ON ent_waiting_list_card_grade(ent_waiting_list_card_id);

COMMENT ON TABLE ent_waiting_list_card_grade IS
    'Computed grading result for a waiting list card. One-to-one child of the card. Stores the Waiting Time Status, clinical priority, and derived day / week counts used by the dashboard and patient view.';
COMMENT ON COLUMN ent_waiting_list_card_grade.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN ent_waiting_list_card_grade.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN ent_waiting_list_card_grade.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN ent_waiting_list_card_grade.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN ent_waiting_list_card_grade.ent_waiting_list_card_id IS
    'Foreign key to the parent waiting list card (unique, 1:1).';
COMMENT ON COLUMN ent_waiting_list_card_grade.waiting_time_status IS
    'Waiting Time Status band: within-target, approaching-breach, breached, long-wait.';
COMMENT ON COLUMN ent_waiting_list_card_grade.clinical_priority IS
    'Clinical priority that drove the calculation (echo of the input).';
COMMENT ON COLUMN ent_waiting_list_card_grade.target_wait_weeks IS
    'Maximum permitted wait in weeks for the recorded clinical priority.';
COMMENT ON COLUMN ent_waiting_list_card_grade.days_waited IS
    'Days elapsed since the RTT clock-start date.';
COMMENT ON COLUMN ent_waiting_list_card_grade.weeks_waited IS
    'Weeks elapsed since the RTT clock-start date.';
COMMENT ON COLUMN ent_waiting_list_card_grade.days_to_target IS
    'Days remaining until the priority-driven target wait is reached (negative if exceeded).';
COMMENT ON COLUMN ent_waiting_list_card_grade.days_to_breach IS
    'Days remaining until the 18-week RTT breach threshold is reached (negative if breached).';
COMMENT ON COLUMN ent_waiting_list_card_grade.days_to_appointment IS
    'Days until the next scheduled appointment (negative if in the past).';
COMMENT ON COLUMN ent_waiting_list_card_grade.grader_notes IS
    'Free-text grader notes (typically empty; populated when the engine cannot compute).';
COMMENT ON COLUMN ent_waiting_list_card_grade.graded_at IS
    'Timestamp when the engine last computed the result.';
