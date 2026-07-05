-- Neurodiversity reasonable-adjustments response (employer decision, confirmation, and review) — the source-of-truth record.

CREATE TABLE neurodiversity_adjustment_response (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    worker_id UUID NOT NULL REFERENCES worker(id) ON DELETE CASCADE,
    manager_id UUID NOT NULL REFERENCES manager(id) ON DELETE CASCADE,

    -- Response lifecycle and provenance
    response_status VARCHAR(20) NOT NULL DEFAULT 'draft'
        CHECK (response_status IN ('draft', 'agreed', 'partially-agreed', 'trial', 'declined', 'deferred', 'cancelled', '')),
    request_reference VARCHAR(64) NOT NULL DEFAULT '',
    handling_method VARCHAR(25) NOT NULL DEFAULT ''
        CHECK (handling_method IN ('meeting', 'occupational-health-referral', 'email', 'hr-review', 'other', '')),
    assessed_date DATE,
    responded_date DATE,
    effective_date DATE,

    -- Overall decision
    overall_decision VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (overall_decision IN ('agreed', 'partially-agreed', 'alternative-offered', 'declined', 'deferred', '')),
    decision_rationale VARCHAR(2000) NOT NULL DEFAULT '',
    decline_reason_category VARCHAR(25) NOT NULL DEFAULT ''
        CHECK (decline_reason_category IN ('not-reasonable', 'disproportionate-cost', 'health-and-safety', 'operational-impact', 'alternative-provided', 'insufficient-information', 'none', '')),

    -- Adjustments agreed (parallel to the request's ACAS adjustment categories)
    agreed_working_environment BOOLEAN NOT NULL DEFAULT FALSE,
    agreed_equipment_technology BOOLEAN NOT NULL DEFAULT FALSE,
    agreed_working_arrangements BOOLEAN NOT NULL DEFAULT FALSE,
    agreed_communication BOOLEAN NOT NULL DEFAULT FALSE,
    agreed_support_mentoring BOOLEAN NOT NULL DEFAULT FALSE,
    agreed_recruitment_process BOOLEAN NOT NULL DEFAULT FALSE,
    agreed_policy_dress BOOLEAN NOT NULL DEFAULT FALSE,
    agreed_other BOOLEAN NOT NULL DEFAULT FALSE,
    agreed_adjustments_detail VARCHAR(2000) NOT NULL DEFAULT '',
    alternative_adjustments_detail VARCHAR(2000) NOT NULL DEFAULT '',

    -- Trial and review (ACAS: try adjustments and review them regularly)
    trial_period BOOLEAN NOT NULL DEFAULT FALSE,
    trial_period_weeks INTEGER
        CHECK (trial_period_weeks IS NULL OR trial_period_weeks BETWEEN 0 AND 104),
    review_scheduled BOOLEAN NOT NULL DEFAULT FALSE,
    review_date DATE,

    -- Support, resources, and responsibilities
    occupational_health_referred BOOLEAN NOT NULL DEFAULT FALSE,
    access_to_work_referred BOOLEAN NOT NULL DEFAULT FALSE,
    support_resources_detail VARCHAR(1000) NOT NULL DEFAULT '',
    responsibilities_detail VARCHAR(1000) NOT NULL DEFAULT '',
    point_of_contact VARCHAR(255) NOT NULL DEFAULT '',

    -- Escalation
    escalated BOOLEAN NOT NULL DEFAULT FALSE,
    escalation_detail VARCHAR(500) NOT NULL DEFAULT '',

    notes VARCHAR(1000) NOT NULL DEFAULT ''
);

CREATE INDEX index_neurodiversity_adjustment_response_worker_id
    ON neurodiversity_adjustment_response(worker_id);
CREATE INDEX index_neurodiversity_adjustment_response_manager_id
    ON neurodiversity_adjustment_response(manager_id);

CREATE TRIGGER trigger_neurodiversity_adjustment_response_updated_at
    BEFORE UPDATE ON neurodiversity_adjustment_response
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE neurodiversity_adjustment_response IS
    'Neurodiversity reasonable-adjustments response: the employer''s decision, written confirmation, and review arrangements in answer to a request. Captures the overall decision and rationale, which adjustments were agreed (and any alternatives offered), the trial period and review date, support / resources / responsibilities, and any escalation. This is the source-of-truth record that the four-axis grade is computed from. Aligned with the ACAS reasonable-adjustment confirmation and review templates and the Equality Act 2010 duty to make reasonable adjustments.';
COMMENT ON COLUMN neurodiversity_adjustment_response.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN neurodiversity_adjustment_response.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN neurodiversity_adjustment_response.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN neurodiversity_adjustment_response.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN neurodiversity_adjustment_response.worker_id IS
    'Foreign key to the worker the response is for.';
COMMENT ON COLUMN neurodiversity_adjustment_response.manager_id IS
    'Foreign key to the manager / HR contact authoring the response.';
COMMENT ON COLUMN neurodiversity_adjustment_response.response_status IS
    'Response lifecycle status: draft, agreed, partially-agreed, trial, declined, deferred, cancelled.';
COMMENT ON COLUMN neurodiversity_adjustment_response.request_reference IS
    'Reference to the originating reasonable-adjustments request.';
COMMENT ON COLUMN neurodiversity_adjustment_response.handling_method IS
    'How the request was handled: meeting, occupational-health-referral, email, hr-review, other.';
COMMENT ON COLUMN neurodiversity_adjustment_response.assessed_date IS
    'Date the request was assessed / discussed with the worker.';
COMMENT ON COLUMN neurodiversity_adjustment_response.responded_date IS
    'Date the response was issued to the worker.';
COMMENT ON COLUMN neurodiversity_adjustment_response.effective_date IS
    'Date the agreed adjustments take effect.';
COMMENT ON COLUMN neurodiversity_adjustment_response.overall_decision IS
    'Overall decision: agreed, partially-agreed, alternative-offered, declined, deferred.';
COMMENT ON COLUMN neurodiversity_adjustment_response.decision_rationale IS
    'Rationale for the decision, including the reasonableness justification where any adjustment is declined.';
COMMENT ON COLUMN neurodiversity_adjustment_response.decline_reason_category IS
    'Where an adjustment is declined, the reasonableness category: not-reasonable, disproportionate-cost, health-and-safety, operational-impact, alternative-provided, insufficient-information, none.';
COMMENT ON COLUMN neurodiversity_adjustment_response.agreed_working_environment IS
    'Agreed adjustment category: changes to the physical working environment.';
COMMENT ON COLUMN neurodiversity_adjustment_response.agreed_equipment_technology IS
    'Agreed adjustment category: equipment or assistive technology.';
COMMENT ON COLUMN neurodiversity_adjustment_response.agreed_working_arrangements IS
    'Agreed adjustment category: changes to working arrangements.';
COMMENT ON COLUMN neurodiversity_adjustment_response.agreed_communication IS
    'Agreed adjustment category: changes to communication.';
COMMENT ON COLUMN neurodiversity_adjustment_response.agreed_support_mentoring IS
    'Agreed adjustment category: additional support / mentoring.';
COMMENT ON COLUMN neurodiversity_adjustment_response.agreed_recruitment_process IS
    'Agreed adjustment category: adjustments to a recruitment / assessment process.';
COMMENT ON COLUMN neurodiversity_adjustment_response.agreed_policy_dress IS
    'Agreed adjustment category: changes to policies (dress code / uniform, absence policy).';
COMMENT ON COLUMN neurodiversity_adjustment_response.agreed_other IS
    'Agreed adjustment category: another adjustment not separately listed.';
COMMENT ON COLUMN neurodiversity_adjustment_response.agreed_adjustments_detail IS
    'Free-text detail of the specific adjustments agreed.';
COMMENT ON COLUMN neurodiversity_adjustment_response.alternative_adjustments_detail IS
    'Free-text detail of any alternative adjustments offered where the original request was not agreed as-is.';
COMMENT ON COLUMN neurodiversity_adjustment_response.trial_period IS
    'Whether the agreed adjustments are being tried for a time-limited trial period before permanent implementation.';
COMMENT ON COLUMN neurodiversity_adjustment_response.trial_period_weeks IS
    'Length of the trial period in weeks, if a trial applies (0-104).';
COMMENT ON COLUMN neurodiversity_adjustment_response.review_scheduled IS
    'Whether a review of the adjustments has been scheduled.';
COMMENT ON COLUMN neurodiversity_adjustment_response.review_date IS
    'Date the adjustments will be reviewed.';
COMMENT ON COLUMN neurodiversity_adjustment_response.occupational_health_referred IS
    'Whether the worker has been referred to occupational health.';
COMMENT ON COLUMN neurodiversity_adjustment_response.access_to_work_referred IS
    'Whether the worker has been signposted / referred to the government Access to Work scheme.';
COMMENT ON COLUMN neurodiversity_adjustment_response.support_resources_detail IS
    'Free-text detail of support resources allocated (budget, equipment orders, training).';
COMMENT ON COLUMN neurodiversity_adjustment_response.responsibilities_detail IS
    'Free-text detail of who is responsible for implementing each agreed adjustment.';
COMMENT ON COLUMN neurodiversity_adjustment_response.point_of_contact IS
    'Named point of contact for the worker to raise concerns about the adjustments.';
COMMENT ON COLUMN neurodiversity_adjustment_response.escalated IS
    'Whether the matter has been escalated (e.g. dispute, grievance, or appeal).';
COMMENT ON COLUMN neurodiversity_adjustment_response.escalation_detail IS
    'Free-text detail of any escalation, dispute, or appeal.';
COMMENT ON COLUMN neurodiversity_adjustment_response.notes IS
    'Free-text notes accompanying the response.';
