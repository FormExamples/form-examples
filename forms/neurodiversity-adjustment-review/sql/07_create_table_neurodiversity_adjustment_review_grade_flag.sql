-- Compliance / risk flags for a neurodiversity reasonable-adjustments response, independent of the axes.

CREATE TABLE neurodiversity_adjustment_review_grade_flag (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    neurodiversity_adjustment_review_grade_id UUID NOT NULL
        REFERENCES neurodiversity_adjustment_review_grade(id) ON DELETE CASCADE,
    flag_id VARCHAR(50) NOT NULL,
    category VARCHAR(40) NOT NULL DEFAULT ''
        CHECK (category IN (
            'adjustments-not-working',
            'worker-dissatisfied',
            'wellbeing-declined',
            'changes-outstanding',
            'no-next-review',
            'escalation',
            'incomplete-review',
            'other',
            ''
        )),
    priority VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (priority IN ('low', 'medium', 'high', '')),
    description VARCHAR(500) NOT NULL DEFAULT '',
    suggested_action VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX index_neurodiversity_adjustment_review_grade_flag_grade_id
    ON neurodiversity_adjustment_review_grade_flag(neurodiversity_adjustment_review_grade_id);

CREATE TRIGGER trigger_neurodiversity_adjustment_review_grade_flag_updated_at
    BEFORE UPDATE ON neurodiversity_adjustment_review_grade_flag
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE neurodiversity_adjustment_review_grade_flag IS
    'Compliance and risk flags that fire independently of the four axes, with priority and a suggested action. The discrimination-risk flag (adjustments declined for a worker likely covered by the Equality Act 2010 without adequate justification or alternatives) is the highest-priority signal of a failure-to-make-reasonable-adjustments claim.';
COMMENT ON COLUMN neurodiversity_adjustment_review_grade_flag.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN neurodiversity_adjustment_review_grade_flag.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN neurodiversity_adjustment_review_grade_flag.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN neurodiversity_adjustment_review_grade_flag.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN neurodiversity_adjustment_review_grade_flag.neurodiversity_adjustment_review_grade_id IS
    'Foreign key to the parent grade.';
COMMENT ON COLUMN neurodiversity_adjustment_review_grade_flag.flag_id IS
    'Stable flag identifier (e.g. F-ADJUSTMENTS-NOT-WORKING-001).';
COMMENT ON COLUMN neurodiversity_adjustment_review_grade_flag.category IS
    'Flag category.';
COMMENT ON COLUMN neurodiversity_adjustment_review_grade_flag.priority IS
    'Priority: low, medium, high.';
COMMENT ON COLUMN neurodiversity_adjustment_review_grade_flag.description IS
    'Human-readable description of what fired the flag.';
COMMENT ON COLUMN neurodiversity_adjustment_review_grade_flag.suggested_action IS
    'Suggested action (e.g. "reconsider the decision or record a reasonableness justification and offer alternatives before finalising").';
