-- Individual workplace restriction / adjustment line items associated
-- with a Return to Work record. Each row corresponds to a single
-- enumerated check-box on the Med 3 plus a quantitative limit
-- (e.g. lifting kg, screen-break minutes) and a free-text note.

CREATE TABLE return_to_work_restriction (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    return_to_work_id UUID NOT NULL
        REFERENCES return_to_work(id) ON DELETE CASCADE,

    kind VARCHAR(40) NOT NULL DEFAULT ''
        CHECK (kind IN (
            'altered-hours',
            'amended-duties',
            'workplace-adaptations',
            'phased-return',
            'no-heavy-lifting',
            'no-driving',
            'no-operating-machinery',
            'no-working-at-height',
            'no-lone-working',
            'no-night-shifts',
            'no-shift-work',
            'no-patient-contact',
            'no-public-contact',
            'sedentary-only',
            'no-exposure-to-allergen',
            'no-exposure-to-chemicals',
            'no-exposure-to-temperature-extremes',
            'no-exposure-to-noise',
            'no-firearms-or-weapons',
            'no-safety-critical-duties',
            'screen-break-frequency',
            'workstation-review',
            'reduced-screen-time',
            'restricted-travel',
            'no-overtime',
            'other',
            '')),
    severity VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (severity IN ('low', 'moderate', 'high', '')),
    quantitative_limit VARCHAR(50) NOT NULL DEFAULT '',
    notes VARCHAR(500) NOT NULL DEFAULT '',
    start_date DATE,
    end_date DATE,
    priority_rank INTEGER NOT NULL DEFAULT 0
);

CREATE TRIGGER trigger_return_to_work_restriction_updated_at
    BEFORE UPDATE ON return_to_work_restriction
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE return_to_work_restriction IS
    'Individual workplace restriction or reasonable adjustment associated with a Return to Work record. Many-to-one relation to return_to_work.';
COMMENT ON COLUMN return_to_work_restriction.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN return_to_work_restriction.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN return_to_work_restriction.updated_at IS
    'Timestamp when this row was updated.';
COMMENT ON COLUMN return_to_work_restriction.deleted_at IS
    'Timestamp when this row was deleted.';
COMMENT ON COLUMN return_to_work_restriction.return_to_work_id IS
    'Foreign key to the parent return_to_work record.';
COMMENT ON COLUMN return_to_work_restriction.kind IS
    'Restriction kind drawn from the enumerated Med 3 adjustments list plus this monorepo extensions.';
COMMENT ON COLUMN return_to_work_restriction.severity IS
    'Severity of the restriction: low, moderate, or high. Drives the composite restriction-priority grade.';
COMMENT ON COLUMN return_to_work_restriction.quantitative_limit IS
    'Quantitative limit for the restriction (e.g. 5 kg lifting limit, 30 minute screen break).';
COMMENT ON COLUMN return_to_work_restriction.notes IS
    'Free-text clinician notes for this specific restriction.';
COMMENT ON COLUMN return_to_work_restriction.start_date IS
    'First date this restriction applies (defaults to return_to_work.valid_from).';
COMMENT ON COLUMN return_to_work_restriction.end_date IS
    'Last date this restriction applies (defaults to return_to_work.valid_until).';
COMMENT ON COLUMN return_to_work_restriction.priority_rank IS
    'Display ordering for the restriction within the fit note (lower = higher on the printed list).';

CREATE INDEX return_to_work_restriction_return_to_work_id_index
    ON return_to_work_restriction (return_to_work_id);
CREATE INDEX return_to_work_restriction_kind_index
    ON return_to_work_restriction (kind);
