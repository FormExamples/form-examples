-- Neurodiversity workplace reasonable-adjustments request — the source-of-truth record.

CREATE TABLE neurodiversity_adjustment_request (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    worker_id UUID NOT NULL REFERENCES worker(id) ON DELETE CASCADE,
    manager_id UUID NOT NULL REFERENCES manager(id) ON DELETE CASCADE,

    -- Request lifecycle
    status VARCHAR(20) NOT NULL DEFAULT 'draft'
        CHECK (status IN ('draft', 'submitted', 'under-review', 'agreed', 'partially-agreed', 'declined', 'withdrawn', '')),
    requested_by VARCHAR(15) NOT NULL DEFAULT 'worker'
        CHECK (requested_by IN ('worker', 'manager', 'occupational-health', 'other', '')),
    request_date DATE,
    requested_start_date DATE,

    -- Neurodivergent profile (ACAS: a formal diagnosis is not required)
    condition_adhd BOOLEAN NOT NULL DEFAULT FALSE,
    condition_autism BOOLEAN NOT NULL DEFAULT FALSE,
    condition_dyslexia BOOLEAN NOT NULL DEFAULT FALSE,
    condition_dyspraxia BOOLEAN NOT NULL DEFAULT FALSE,
    condition_dyscalculia BOOLEAN NOT NULL DEFAULT FALSE,
    condition_tourettes BOOLEAN NOT NULL DEFAULT FALSE,
    condition_other BOOLEAN NOT NULL DEFAULT FALSE,
    condition_other_detail VARCHAR(500) NOT NULL DEFAULT '',
    diagnosis_status VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (diagnosis_status IN ('diagnosed', 'self-identified', 'awaiting-assessment', 'prefer-not-to-say', '')),
    considers_disability VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (considers_disability IN ('yes', 'no', 'unsure', 'prefer-not-to-say', '')),
    substantial_long_term_impact BOOLEAN NOT NULL DEFAULT FALSE,
    disclosure_consent BOOLEAN NOT NULL DEFAULT FALSE,

    -- Functional difficulties (ACAS functional areas)
    difficulty_concentration BOOLEAN NOT NULL DEFAULT FALSE,
    difficulty_written_communication BOOLEAN NOT NULL DEFAULT FALSE,
    difficulty_organisation_time BOOLEAN NOT NULL DEFAULT FALSE,
    difficulty_sensory_overload BOOLEAN NOT NULL DEFAULT FALSE,
    difficulty_balance_coordination BOOLEAN NOT NULL DEFAULT FALSE,
    difficulty_social_communication BOOLEAN NOT NULL DEFAULT FALSE,
    difficulty_memory BOOLEAN NOT NULL DEFAULT FALSE,
    difficulty_burnout_wellbeing BOOLEAN NOT NULL DEFAULT FALSE,
    tasks_situations_affected VARCHAR(1000) NOT NULL DEFAULT '',
    worker_strengths VARCHAR(1000) NOT NULL DEFAULT '',

    -- Requested adjustments (ACAS adjustment categories)
    adjustment_working_environment BOOLEAN NOT NULL DEFAULT FALSE,
    adjustment_equipment_technology BOOLEAN NOT NULL DEFAULT FALSE,
    adjustment_working_arrangements BOOLEAN NOT NULL DEFAULT FALSE,
    adjustment_communication BOOLEAN NOT NULL DEFAULT FALSE,
    adjustment_support_mentoring BOOLEAN NOT NULL DEFAULT FALSE,
    adjustment_recruitment_process BOOLEAN NOT NULL DEFAULT FALSE,
    adjustment_policy_dress BOOLEAN NOT NULL DEFAULT FALSE,
    adjustment_other BOOLEAN NOT NULL DEFAULT FALSE,
    adjustments_requested_detail VARCHAR(2000) NOT NULL DEFAULT '',

    -- Supporting evidence (ACAS: occupational health / Access to Work)
    supporting_evidence_type VARCHAR(25) NOT NULL DEFAULT ''
        CHECK (supporting_evidence_type IN ('occupational-health', 'gp-letter', 'diagnostic-report', 'access-to-work', 'none', '')),
    occupational_health_involved BOOLEAN NOT NULL DEFAULT FALSE,
    access_to_work_involved BOOLEAN NOT NULL DEFAULT FALSE,

    -- Impact and urgency
    current_impact VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (current_impact IN ('low', 'moderate', 'high', 'severe', '')),
    at_risk_of_absence BOOLEAN NOT NULL DEFAULT FALSE,
    urgency VARCHAR(10) NOT NULL DEFAULT 'routine'
        CHECK (urgency IN ('routine', 'soon', 'urgent', '')),

    notes VARCHAR(1000) NOT NULL DEFAULT ''
);

CREATE INDEX index_neurodiversity_adjustment_request_worker_id
    ON neurodiversity_adjustment_request(worker_id);
CREATE INDEX index_neurodiversity_adjustment_request_manager_id
    ON neurodiversity_adjustment_request(manager_id);

CREATE TRIGGER trigger_neurodiversity_adjustment_request_updated_at
    BEFORE UPDATE ON neurodiversity_adjustment_request
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE neurodiversity_adjustment_request IS
    'Neurodiversity workplace reasonable-adjustments request. Captures the worker''s neurodivergent profile (conditions, diagnosis status, disability self-assessment, disclosure consent), the functional difficulties experienced across the ACAS functional areas, the specific adjustments requested across the ACAS adjustment categories, supporting evidence, and impact / urgency. This is the source-of-truth record that the four-axis grade is computed from. Aligned with ACAS reasonable-adjustments guidance and the Equality Act 2010 duty to make reasonable adjustments.';
COMMENT ON COLUMN neurodiversity_adjustment_request.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN neurodiversity_adjustment_request.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN neurodiversity_adjustment_request.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN neurodiversity_adjustment_request.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN neurodiversity_adjustment_request.worker_id IS
    'Foreign key to the worker the request is for.';
COMMENT ON COLUMN neurodiversity_adjustment_request.manager_id IS
    'Foreign key to the manager / HR contact handling the request.';
COMMENT ON COLUMN neurodiversity_adjustment_request.status IS
    'Request lifecycle status: draft, submitted, under-review, agreed, partially-agreed, declined, withdrawn.';
COMMENT ON COLUMN neurodiversity_adjustment_request.requested_by IS
    'Who initiated the request: worker, manager, occupational-health, other.';
COMMENT ON COLUMN neurodiversity_adjustment_request.request_date IS
    'Date the request was made.';
COMMENT ON COLUMN neurodiversity_adjustment_request.requested_start_date IS
    'Proposed date for the requested adjustments to start.';
COMMENT ON COLUMN neurodiversity_adjustment_request.condition_adhd IS
    'Neurodivergent profile: attention deficit hyperactivity disorder (ADHD).';
COMMENT ON COLUMN neurodiversity_adjustment_request.condition_autism IS
    'Neurodivergent profile: autism.';
COMMENT ON COLUMN neurodiversity_adjustment_request.condition_dyslexia IS
    'Neurodivergent profile: dyslexia.';
COMMENT ON COLUMN neurodiversity_adjustment_request.condition_dyspraxia IS
    'Neurodivergent profile: dyspraxia (developmental coordination disorder).';
COMMENT ON COLUMN neurodiversity_adjustment_request.condition_dyscalculia IS
    'Neurodivergent profile: dyscalculia.';
COMMENT ON COLUMN neurodiversity_adjustment_request.condition_tourettes IS
    'Neurodivergent profile: Tourette''s syndrome / tic disorder.';
COMMENT ON COLUMN neurodiversity_adjustment_request.condition_other IS
    'Neurodivergent profile: another form of neurodivergence not separately listed.';
COMMENT ON COLUMN neurodiversity_adjustment_request.condition_other_detail IS
    'Free-text detail of the other neurodivergent condition(s).';
COMMENT ON COLUMN neurodiversity_adjustment_request.diagnosis_status IS
    'Diagnosis status: diagnosed, self-identified, awaiting-assessment, prefer-not-to-say. A formal diagnosis is not required for the Equality Act duty to apply.';
COMMENT ON COLUMN neurodiversity_adjustment_request.considers_disability IS
    'Whether the worker considers their neurodivergence a disability under the Equality Act 2010: yes, no, unsure, prefer-not-to-say.';
COMMENT ON COLUMN neurodiversity_adjustment_request.substantial_long_term_impact IS
    'Whether the neurodivergence has a substantial and long-term adverse effect on day-to-day activities (the Equality Act 2010 disability test).';
COMMENT ON COLUMN neurodiversity_adjustment_request.disclosure_consent IS
    'Whether the worker consents to their neurodivergence details being shared with HR / occupational health as needed to arrange adjustments.';
COMMENT ON COLUMN neurodiversity_adjustment_request.difficulty_concentration IS
    'Functional difficulty: concentration / focus.';
COMMENT ON COLUMN neurodiversity_adjustment_request.difficulty_written_communication IS
    'Functional difficulty: reading / writing / written communication.';
COMMENT ON COLUMN neurodiversity_adjustment_request.difficulty_organisation_time IS
    'Functional difficulty: organisation and time management.';
COMMENT ON COLUMN neurodiversity_adjustment_request.difficulty_sensory_overload IS
    'Functional difficulty: sensory overload (noise, light, busy environments).';
COMMENT ON COLUMN neurodiversity_adjustment_request.difficulty_balance_coordination IS
    'Functional difficulty: balance and coordination.';
COMMENT ON COLUMN neurodiversity_adjustment_request.difficulty_social_communication IS
    'Functional difficulty: social interaction / verbal communication.';
COMMENT ON COLUMN neurodiversity_adjustment_request.difficulty_memory IS
    'Functional difficulty: working memory / recall.';
COMMENT ON COLUMN neurodiversity_adjustment_request.difficulty_burnout_wellbeing IS
    'Functional difficulty: fatigue, burnout, and wellbeing.';
COMMENT ON COLUMN neurodiversity_adjustment_request.tasks_situations_affected IS
    'Specific tasks and situations at work where the difficulties cause a substantial disadvantage.';
COMMENT ON COLUMN neurodiversity_adjustment_request.worker_strengths IS
    'Strengths the worker brings that adjustments can help them make the most of (ACAS: strength utilisation).';
COMMENT ON COLUMN neurodiversity_adjustment_request.adjustment_working_environment IS
    'Requested adjustment category: changes to the physical working environment (quiet space, lighting, desk location, screens).';
COMMENT ON COLUMN neurodiversity_adjustment_request.adjustment_equipment_technology IS
    'Requested adjustment category: equipment or assistive technology (noise-cancelling headphones, screen reader, speech-to-text, ergonomic equipment).';
COMMENT ON COLUMN neurodiversity_adjustment_request.adjustment_working_arrangements IS
    'Requested adjustment category: changes to working arrangements (flexible hours, remote / hybrid working, phased return, planned breaks).';
COMMENT ON COLUMN neurodiversity_adjustment_request.adjustment_communication IS
    'Requested adjustment category: changes to communication (written instructions, tasks broken into clear steps, regular check-ins).';
COMMENT ON COLUMN neurodiversity_adjustment_request.adjustment_support_mentoring IS
    'Requested adjustment category: additional support (mentor / buddy, coaching, extra training, job aids).';
COMMENT ON COLUMN neurodiversity_adjustment_request.adjustment_recruitment_process IS
    'Requested adjustment category: adjustments to a recruitment, selection, or assessment process.';
COMMENT ON COLUMN neurodiversity_adjustment_request.adjustment_policy_dress IS
    'Requested adjustment category: changes to policies (dress code / uniform for softer materials, absence-policy flexibility).';
COMMENT ON COLUMN neurodiversity_adjustment_request.adjustment_other IS
    'Requested adjustment category: another adjustment not separately listed.';
COMMENT ON COLUMN neurodiversity_adjustment_request.adjustments_requested_detail IS
    'Free-text detail of the specific adjustments requested.';
COMMENT ON COLUMN neurodiversity_adjustment_request.supporting_evidence_type IS
    'Type of supporting evidence supplied: occupational-health, gp-letter, diagnostic-report, access-to-work, none.';
COMMENT ON COLUMN neurodiversity_adjustment_request.occupational_health_involved IS
    'Whether occupational health has been or should be involved.';
COMMENT ON COLUMN neurodiversity_adjustment_request.access_to_work_involved IS
    'Whether the government Access to Work scheme is involved or has been applied for.';
COMMENT ON COLUMN neurodiversity_adjustment_request.current_impact IS
    'Current impact of the unadjusted difficulties on the worker''s work and wellbeing: low, moderate, high, severe.';
COMMENT ON COLUMN neurodiversity_adjustment_request.at_risk_of_absence IS
    'Whether the worker is at risk of sickness absence or burnout without adjustments.';
COMMENT ON COLUMN neurodiversity_adjustment_request.urgency IS
    'Requested handling urgency: routine, soon, urgent.';
COMMENT ON COLUMN neurodiversity_adjustment_request.notes IS
    'Free-text notes accompanying the request.';
