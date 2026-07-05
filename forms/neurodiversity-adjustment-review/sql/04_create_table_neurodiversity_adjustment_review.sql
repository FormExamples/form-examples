-- Neurodiversity reasonable-adjustments review (periodic effectiveness review) — the source-of-truth record.

CREATE TABLE neurodiversity_adjustment_review (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    worker_id UUID NOT NULL REFERENCES worker(id) ON DELETE CASCADE,
    manager_id UUID NOT NULL REFERENCES manager(id) ON DELETE CASCADE,

    -- Review lifecycle and provenance
    review_status VARCHAR(20) NOT NULL DEFAULT 'draft'
        CHECK (review_status IN ('draft', 'completed', 'changes-agreed', 'escalated', 'cancelled', '')),
    response_reference VARCHAR(64) NOT NULL DEFAULT '',
    review_method VARCHAR(25) NOT NULL DEFAULT ''
        CHECK (review_method IN ('meeting', 'occupational-health-review', 'email', 'hr-review', 'other', '')),
    review_date DATE,
    next_review_date DATE,

    -- Per-category effectiveness of the adjustments in place (ACAS categories)
    effectiveness_working_environment VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (effectiveness_working_environment IN ('working-well', 'partial', 'not-working', 'not-in-place', '')),
    effectiveness_equipment_technology VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (effectiveness_equipment_technology IN ('working-well', 'partial', 'not-working', 'not-in-place', '')),
    effectiveness_working_arrangements VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (effectiveness_working_arrangements IN ('working-well', 'partial', 'not-working', 'not-in-place', '')),
    effectiveness_communication VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (effectiveness_communication IN ('working-well', 'partial', 'not-working', 'not-in-place', '')),
    effectiveness_support_mentoring VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (effectiveness_support_mentoring IN ('working-well', 'partial', 'not-working', 'not-in-place', '')),
    effectiveness_recruitment_process VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (effectiveness_recruitment_process IN ('working-well', 'partial', 'not-working', 'not-in-place', '')),
    effectiveness_policy_dress VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (effectiveness_policy_dress IN ('working-well', 'partial', 'not-working', 'not-in-place', '')),
    effectiveness_other VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (effectiveness_other IN ('working-well', 'partial', 'not-working', 'not-in-place', '')),

    -- Worker experience and outcomes
    worker_feedback VARCHAR(2000) NOT NULL DEFAULT '',
    worker_satisfied VARCHAR(12) NOT NULL DEFAULT ''
        CHECK (worker_satisfied IN ('yes', 'partially', 'no', '')),
    wellbeing_change VARCHAR(12) NOT NULL DEFAULT ''
        CHECK (wellbeing_change IN ('improved', 'unchanged', 'worse', '')),
    barriers_detail VARCHAR(1000) NOT NULL DEFAULT '',

    -- Changes arising from the review
    changes_needed BOOLEAN NOT NULL DEFAULT FALSE,
    changes_detail VARCHAR(2000) NOT NULL DEFAULT '',
    updated_adjustments_detail VARCHAR(2000) NOT NULL DEFAULT '',
    occupational_health_rereferral BOOLEAN NOT NULL DEFAULT FALSE,

    -- Escalation
    escalated BOOLEAN NOT NULL DEFAULT FALSE,
    escalation_detail VARCHAR(500) NOT NULL DEFAULT '',

    notes VARCHAR(1000) NOT NULL DEFAULT ''
);

CREATE INDEX index_neurodiversity_adjustment_review_worker_id
    ON neurodiversity_adjustment_review(worker_id);
CREATE INDEX index_neurodiversity_adjustment_review_manager_id
    ON neurodiversity_adjustment_review(manager_id);

CREATE TRIGGER trigger_neurodiversity_adjustment_review_updated_at
    BEFORE UPDATE ON neurodiversity_adjustment_review
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE neurodiversity_adjustment_review IS
    'Neurodiversity reasonable-adjustments review: a periodic check of whether the agreed adjustments are still working, completed by the manager / HR with the worker. Captures the per-category effectiveness of the adjustments in place, the worker''s feedback and outcomes, any changes arising, and the next review date. This is the source-of-truth record that the four-axis grade is computed from. It is the review half of the ACAS request / confirmation / review cycle and follows the ACAS reasonable-adjustments review template.';
COMMENT ON COLUMN neurodiversity_adjustment_review.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN neurodiversity_adjustment_review.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN neurodiversity_adjustment_review.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN neurodiversity_adjustment_review.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN neurodiversity_adjustment_review.worker_id IS
    'Foreign key to the worker the review is for.';
COMMENT ON COLUMN neurodiversity_adjustment_review.manager_id IS
    'Foreign key to the manager / HR contact conducting the review.';
COMMENT ON COLUMN neurodiversity_adjustment_review.review_status IS
    'Review lifecycle status: draft, completed, changes-agreed, escalated, cancelled.';
COMMENT ON COLUMN neurodiversity_adjustment_review.response_reference IS
    'Reference to the originating response / confirmation whose adjustments are being reviewed.';
COMMENT ON COLUMN neurodiversity_adjustment_review.review_method IS
    'How the review was conducted: meeting, occupational-health-review, email, hr-review, other.';
COMMENT ON COLUMN neurodiversity_adjustment_review.review_date IS
    'Date the review took place.';
COMMENT ON COLUMN neurodiversity_adjustment_review.next_review_date IS
    'Date of the next scheduled review.';
COMMENT ON COLUMN neurodiversity_adjustment_review.effectiveness_working_environment IS
    'Effectiveness of working-environment adjustments: working-well, partial, not-working, not-in-place.';
COMMENT ON COLUMN neurodiversity_adjustment_review.effectiveness_equipment_technology IS
    'Effectiveness of equipment / technology adjustments: working-well, partial, not-working, not-in-place.';
COMMENT ON COLUMN neurodiversity_adjustment_review.effectiveness_working_arrangements IS
    'Effectiveness of working-arrangements adjustments: working-well, partial, not-working, not-in-place.';
COMMENT ON COLUMN neurodiversity_adjustment_review.effectiveness_communication IS
    'Effectiveness of communication adjustments: working-well, partial, not-working, not-in-place.';
COMMENT ON COLUMN neurodiversity_adjustment_review.effectiveness_support_mentoring IS
    'Effectiveness of support / mentoring adjustments: working-well, partial, not-working, not-in-place.';
COMMENT ON COLUMN neurodiversity_adjustment_review.effectiveness_recruitment_process IS
    'Effectiveness of recruitment-process adjustments: working-well, partial, not-working, not-in-place.';
COMMENT ON COLUMN neurodiversity_adjustment_review.effectiveness_policy_dress IS
    'Effectiveness of policy / dress-code adjustments: working-well, partial, not-working, not-in-place.';
COMMENT ON COLUMN neurodiversity_adjustment_review.effectiveness_other IS
    'Effectiveness of any other adjustment: working-well, partial, not-working, not-in-place.';
COMMENT ON COLUMN neurodiversity_adjustment_review.worker_feedback IS
    'The worker''s own feedback on how the adjustments are working.';
COMMENT ON COLUMN neurodiversity_adjustment_review.worker_satisfied IS
    'Whether the worker is satisfied the adjustments meet their needs: yes, partially, no.';
COMMENT ON COLUMN neurodiversity_adjustment_review.wellbeing_change IS
    'Change in the worker''s wellbeing / ability to work since the adjustments: improved, unchanged, worse.';
COMMENT ON COLUMN neurodiversity_adjustment_review.barriers_detail IS
    'Any remaining barriers or difficulties the worker still experiences.';
COMMENT ON COLUMN neurodiversity_adjustment_review.changes_needed IS
    'Whether changes to the adjustments are needed as a result of the review.';
COMMENT ON COLUMN neurodiversity_adjustment_review.changes_detail IS
    'Detail of the changes needed.';
COMMENT ON COLUMN neurodiversity_adjustment_review.updated_adjustments_detail IS
    'Detail of the updated / newly agreed adjustments arising from the review.';
COMMENT ON COLUMN neurodiversity_adjustment_review.occupational_health_rereferral IS
    'Whether an occupational-health re-referral has been made as a result of the review.';
COMMENT ON COLUMN neurodiversity_adjustment_review.escalated IS
    'Whether the matter has been escalated (e.g. unresolved difficulty, dispute, or grievance).';
COMMENT ON COLUMN neurodiversity_adjustment_review.escalation_detail IS
    'Free-text detail of any escalation.';
COMMENT ON COLUMN neurodiversity_adjustment_review.notes IS
    'Free-text notes accompanying the review.';
