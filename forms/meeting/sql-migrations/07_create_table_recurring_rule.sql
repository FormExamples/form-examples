-- Recurring rule — at most one per meeting, modelled on RFC 5545 RRULE
-- but restricted to the seven frequencies a non-technical user is likely
-- to need (none / daily / weekday / weekly / monthly / quarterly / yearly).

CREATE TABLE recurring_rule (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    meeting_id UUID NOT NULL UNIQUE REFERENCES meeting(id) ON DELETE CASCADE,

    frequency VARCHAR(20) NOT NULL DEFAULT 'none'
        CHECK (frequency IN ('none', 'daily', 'weekday', 'weekly', 'monthly', 'quarterly', 'yearly')),
    interval_count INTEGER NOT NULL DEFAULT 1
        CHECK (interval_count >= 1),

    by_day_of_week VARCHAR(40) NOT NULL DEFAULT ''
        CHECK (by_day_of_week ~ '^(|((MO|TU|WE|TH|FR|SA|SU)(,(MO|TU|WE|TH|FR|SA|SU))*))$'),
    by_day_of_month INTEGER
        CHECK (by_day_of_month IS NULL OR by_day_of_month BETWEEN -31 AND 31),
    by_set_position INTEGER
        CHECK (by_set_position IS NULL OR by_set_position BETWEEN -4 AND 4),
    by_month_of_year INTEGER
        CHECK (by_month_of_year IS NULL OR by_month_of_year BETWEEN 1 AND 12),

    series_count INTEGER
        CHECK (series_count IS NULL OR series_count >= 1),
    series_until TIMESTAMPTZ,

    timezone VARCHAR(64) NOT NULL DEFAULT '',
    rrule_text VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE TRIGGER trigger_recurring_rule_updated_at
    BEFORE UPDATE ON recurring_rule
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE recurring_rule IS
    'Optional recurrence rule for a meeting, modelled on RFC 5545 RRULE but restricted to the seven frequencies a non-technical user is likely to need.';
COMMENT ON COLUMN recurring_rule.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN recurring_rule.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN recurring_rule.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN recurring_rule.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN recurring_rule.meeting_id IS
    'Foreign key to the parent meeting; UNIQUE so at most one rule per meeting.';
COMMENT ON COLUMN recurring_rule.frequency IS
    'Recurrence frequency: none, daily, weekday, weekly, monthly, quarterly, yearly.';
COMMENT ON COLUMN recurring_rule.interval_count IS
    'Interval between occurrences; e.g. interval_count = 2 with frequency = weekly means every fortnight.';
COMMENT ON COLUMN recurring_rule.by_day_of_week IS
    'Comma-separated iCalendar weekday codes (MO,TU,WE,TH,FR,SA,SU). Empty when not constrained.';
COMMENT ON COLUMN recurring_rule.by_day_of_month IS
    'Day of month for monthly / quarterly / yearly rules. Negative values count from the end (-1 = last day).';
COMMENT ON COLUMN recurring_rule.by_set_position IS
    'Set position for the "nth weekday" pattern (e.g. by_set_position = 1, by_day_of_week = MO means first Monday).';
COMMENT ON COLUMN recurring_rule.by_month_of_year IS
    'Month of year for yearly rules (1 = January, 12 = December).';
COMMENT ON COLUMN recurring_rule.series_count IS
    'Total number of occurrences in the series, if known.';
COMMENT ON COLUMN recurring_rule.series_until IS
    'Last possible occurrence in the series, exclusive.';
COMMENT ON COLUMN recurring_rule.timezone IS
    'IANA timezone the rule is evaluated in.';
COMMENT ON COLUMN recurring_rule.rrule_text IS
    'Full RFC 5545 RRULE string for verbatim round-trip with iCalendar clients.';

CREATE INDEX recurring_rule_index_meeting_id
    ON recurring_rule(meeting_id);
