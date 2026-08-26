-- Computed and signed-off grading result for one perioperative optimization
-- assessment. Stores the engine-computed surgical readiness band and the
-- clinician-final band with an override reason, plus the derived instrument
-- scores and the weeks remaining before surgery that drove the gating.

CREATE TABLE perioperative_optimization_grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    perioperative_optimization_id UUID NOT NULL UNIQUE
        REFERENCES perioperative_optimization(id) ON DELETE CASCADE,

    weeks_to_surgery INTEGER,
    gating_applied BOOLEAN NOT NULL DEFAULT FALSE,

    must_score INTEGER
        CHECK (must_score IS NULL OR must_score BETWEEN 0 AND 6),
    must_risk VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (must_risk IN ('low', 'medium', 'high', '')),
    audit_c_score INTEGER
        CHECK (audit_c_score IS NULL OR audit_c_score BETWEEN 0 AND 12),
    stop_bang_score INTEGER
        CHECK (stop_bang_score IS NULL OR stop_bang_score BETWEEN 0 AND 8),
    duke_activity_status_index NUMERIC(5,2)
        CHECK (duke_activity_status_index IS NULL OR duke_activity_status_index BETWEEN 0 AND 60),
    clinical_frailty_scale INTEGER
        CHECK (clinical_frailty_scale IS NULL OR clinical_frailty_scale BETWEEN 1 AND 9),
    fried_phenotype_score INTEGER
        CHECK (fried_phenotype_score IS NULL OR fried_phenotype_score BETWEEN 0 AND 5),
    fried_frailty_category VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (fried_frailty_category IN ('robust', 'pre-frail', 'frail', '')),

    domains_optimized INTEGER
        CHECK (domains_optimized IS NULL OR domains_optimized BETWEEN 0 AND 8),
    domains_in_progress INTEGER
        CHECK (domains_in_progress IS NULL OR domains_in_progress BETWEEN 0 AND 8),
    domains_action_required INTEGER
        CHECK (domains_action_required IS NULL OR domains_action_required BETWEEN 0 AND 8),
    domains_insufficient_time INTEGER
        CHECK (domains_insufficient_time IS NULL OR domains_insufficient_time BETWEEN 0 AND 8),

    computed_readiness VARCHAR(30) NOT NULL DEFAULT ''
        CHECK (computed_readiness IN ('ready', 'optimization-in-progress', 'optimization-required', 'defer-surgery', '')),
    final_readiness VARCHAR(30) NOT NULL DEFAULT ''
        CHECK (final_readiness IN ('ready', 'optimization-in-progress', 'optimization-required', 'defer-surgery', '')),
    override_reason VARCHAR(500) NOT NULL DEFAULT '',

    gate_decision VARCHAR(30) NOT NULL DEFAULT ''
        CHECK (gate_decision IN ('proceed', 'proceed-with-prehabilitation', 'defer-and-optimize', 'accept-unoptimized-risk', 'mdt-review', 'cancel', '')),
    recommended_earliest_surgery_date DATE,
    clinician_notes TEXT NOT NULL DEFAULT '',
    signed_by_name VARCHAR(255) NOT NULL DEFAULT '',
    signed_at TIMESTAMPTZ,
    graded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trigger_perioperative_optimization_grade_updated_at
    BEFORE UPDATE ON perioperative_optimization_grade
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE perioperative_optimization_grade IS
    'Computed and signed-off grading result for one perioperative optimization assessment, holding the engine-computed and clinician-final surgical readiness bands.';
COMMENT ON COLUMN perioperative_optimization_grade.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN perioperative_optimization_grade.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN perioperative_optimization_grade.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN perioperative_optimization_grade.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN perioperative_optimization_grade.perioperative_optimization_id IS
    'Foreign key to the perioperative_optimization table, unique because grading is one-to-one with the assessment.';
COMMENT ON COLUMN perioperative_optimization_grade.weeks_to_surgery IS
    'Whole weeks between the assessment date and the planned surgery date, the value every domain lead time is gated against. Negative where the surgery date precedes the assessment date; NULL where either date is missing.';
COMMENT ON COLUMN perioperative_optimization_grade.gating_applied IS
    'Whether time-to-surgery gating could be applied, i.e. whether both dates were present. When false, every triggered domain reports action-required and the report says gating was not applied.';
COMMENT ON COLUMN perioperative_optimization_grade.must_score IS
    'Malnutrition Universal Screening Tool total, 0 to 6, driving the nutrition domain.';
COMMENT ON COLUMN perioperative_optimization_grade.must_risk IS
    'MUST risk category: low for 0, medium for 1, high for 2 or more.';
COMMENT ON COLUMN perioperative_optimization_grade.audit_c_score IS
    'AUDIT-C alcohol consumption score, 0 to 12, driving the alcohol domain.';
COMMENT ON COLUMN perioperative_optimization_grade.stop_bang_score IS
    'STOP-BANG obstructive sleep apnoea screening score, 0 to 8, contributing to the cardiorespiratory domain.';
COMMENT ON COLUMN perioperative_optimization_grade.duke_activity_status_index IS
    'Duke Activity Status Index, contributing to the physical fitness domain.';
COMMENT ON COLUMN perioperative_optimization_grade.clinical_frailty_scale IS
    'Clinical Frailty Scale, 1 to 9. Reported and flagged but not gated, because frailty is rarely reversible in the available window.';
COMMENT ON COLUMN perioperative_optimization_grade.fried_phenotype_score IS
    'Fried Frailty Phenotype score (0-5): count of weakness, slowness, low activity, exhaustion, and unintentional weight loss criteria met.';
COMMENT ON COLUMN perioperative_optimization_grade.fried_frailty_category IS
    'Fried Frailty Phenotype category derived from the score: robust (0), pre-frail (1-2), or frail (3-5).';
COMMENT ON COLUMN perioperative_optimization_grade.domains_optimized IS
    'Count of the eight domains graded optimized or not-applicable.';
COMMENT ON COLUMN perioperative_optimization_grade.domains_in_progress IS
    'Count of the eight domains graded in-progress.';
COMMENT ON COLUMN perioperative_optimization_grade.domains_action_required IS
    'Count of the eight domains graded action-required.';
COMMENT ON COLUMN perioperative_optimization_grade.domains_insufficient_time IS
    'Count of the eight domains graded insufficient-time. Any value above zero forces a defer-surgery readiness band.';
COMMENT ON COLUMN perioperative_optimization_grade.computed_readiness IS
    'Surgical readiness band computed by the engine using the max-grade algorithm across the eight domains.';
COMMENT ON COLUMN perioperative_optimization_grade.final_readiness IS
    'Surgical readiness band signed off by the clinician, which may equal or differ from the computed band.';
COMMENT ON COLUMN perioperative_optimization_grade.override_reason IS
    'Reason the clinician set a final band differently from the computed band, mandatory when they differ. Safety flags are unaffected by the override.';
COMMENT ON COLUMN perioperative_optimization_grade.gate_decision IS
    'The explicit human decision recorded at sign-off: proceed, proceed-with-prehabilitation, defer-and-optimize, accept-unoptimized-risk, mdt-review, or cancel.';
COMMENT ON COLUMN perioperative_optimization_grade.recommended_earliest_surgery_date IS
    'Earliest date at which every triggered domain would have had its full lead time, derived from the largest domain shortfall.';
COMMENT ON COLUMN perioperative_optimization_grade.clinician_notes IS
    'Free-text clinician summary notes.';
COMMENT ON COLUMN perioperative_optimization_grade.signed_by_name IS
    'Name of the clinician who signed the assessment.';
COMMENT ON COLUMN perioperative_optimization_grade.signed_at IS
    'Timestamp of the clinician electronic signature.';
COMMENT ON COLUMN perioperative_optimization_grade.graded_at IS
    'Timestamp when the engine last computed the result.';
