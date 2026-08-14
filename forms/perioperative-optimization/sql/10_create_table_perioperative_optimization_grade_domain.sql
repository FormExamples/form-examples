-- Per-domain optimisation result: one row per optimisation domain per
-- assessment.
--
-- Unlike the sibling pre-operative forms, where the fired-rule list is an audit
-- trail beneath a single score, the domain statuses ARE this form's primary
-- output. They therefore get their own table rather than being flattened into
-- the grade row, so a dashboard can query "which lists have an anaemia domain
-- short on time?" directly.

CREATE TABLE perioperative_optimization_grade_domain (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    perioperative_optimization_grade_id UUID NOT NULL
        REFERENCES perioperative_optimization_grade(id) ON DELETE CASCADE,
    domain VARCHAR(30) NOT NULL
        CHECK (domain IN (
            'anaemia',
            'glycaemic-control',
            'smoking',
            'alcohol',
            'nutrition',
            'physical-fitness',
            'medication',
            'cardiorespiratory'
        )),
    status VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (status IN ('optimised', 'in-progress', 'action-required', 'insufficient-time', 'not-applicable', '')),
    triggered BOOLEAN NOT NULL DEFAULT FALSE,
    lead_time_weeks INTEGER NOT NULL DEFAULT 0
        CHECK (lead_time_weeks BETWEEN 0 AND 52),
    weeks_shortfall INTEGER
        CHECK (weeks_shortfall IS NULL OR weeks_shortfall BETWEEN 0 AND 520),
    rule_id VARCHAR(30) NOT NULL DEFAULT '',
    finding VARCHAR(500) NOT NULL DEFAULT '',
    intervention VARCHAR(500) NOT NULL DEFAULT '',
    intervention_started BOOLEAN NOT NULL DEFAULT FALSE,
    referral_made BOOLEAN NOT NULL DEFAULT FALSE,
    target_value VARCHAR(255) NOT NULL DEFAULT '',
    start_date DATE
);

CREATE INDEX perioperative_optimization_grade_domain_grade_id_index
    ON perioperative_optimization_grade_domain (perioperative_optimization_grade_id);

CREATE INDEX perioperative_optimization_grade_domain_status_index
    ON perioperative_optimization_grade_domain (status);

CREATE UNIQUE INDEX perioperative_optimization_grade_domain_unique_index
    ON perioperative_optimization_grade_domain (perioperative_optimization_grade_id, domain);

CREATE TRIGGER trigger_perioperative_optimization_grade_domain_updated_at
    BEFORE UPDATE ON perioperative_optimization_grade_domain
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE perioperative_optimization_grade_domain IS
    'Per-domain optimisation result, one row per optimisation domain per assessment. The domain statuses are this form primary output rather than an audit trail beneath a single score.';
COMMENT ON COLUMN perioperative_optimization_grade_domain.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN perioperative_optimization_grade_domain.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN perioperative_optimization_grade_domain.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN perioperative_optimization_grade_domain.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN perioperative_optimization_grade_domain.perioperative_optimization_grade_id IS
    'Foreign key to the parent perioperative_optimization_grade table.';
COMMENT ON COLUMN perioperative_optimization_grade_domain.domain IS
    'Which of the eight optimisation domains this row grades.';
COMMENT ON COLUMN perioperative_optimization_grade_domain.status IS
    'Domain status after time-to-surgery gating: optimised, in-progress, action-required, insufficient-time, or not-applicable.';
COMMENT ON COLUMN perioperative_optimization_grade_domain.triggered IS
    'Whether the domain screening threshold was crossed, i.e. whether there is anything to optimise.';
COMMENT ON COLUMN perioperative_optimization_grade_domain.lead_time_weeks IS
    'Minimum weeks before surgery the intervention needs in order to work, per doc/optimisation-domains.md.';
COMMENT ON COLUMN perioperative_optimization_grade_domain.weeks_shortfall IS
    'How many weeks short of the lead time this assessment is, i.e. how much later the surgery would have to be for the intervention to work. NULL when there is enough time.';
COMMENT ON COLUMN perioperative_optimization_grade_domain.rule_id IS
    'Stable identifier of the rule that triggered the domain, such as R-ANAEMIA-3.';
COMMENT ON COLUMN perioperative_optimization_grade_domain.finding IS
    'Human-readable description of what triggered the domain.';
COMMENT ON COLUMN perioperative_optimization_grade_domain.intervention IS
    'The intervention this domain calls for.';
COMMENT ON COLUMN perioperative_optimization_grade_domain.intervention_started IS
    'Whether the intervention has already been started, which moves the domain from action-required to in-progress.';
COMMENT ON COLUMN perioperative_optimization_grade_domain.referral_made IS
    'Whether an onward referral for this domain has been made.';
COMMENT ON COLUMN perioperative_optimization_grade_domain.target_value IS
    'Target value for the domain, such as a haemoglobin or HbA1c figure to reach before surgery.';
COMMENT ON COLUMN perioperative_optimization_grade_domain.start_date IS
    'Date the intervention for this domain started, or is planned to start.';
