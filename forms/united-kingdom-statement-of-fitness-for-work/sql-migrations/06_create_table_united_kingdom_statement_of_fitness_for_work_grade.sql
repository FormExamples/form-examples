-- Computed grading result for a fit note. One-to-one with the fit-note row.
-- Stores the engine outputs alongside the clinician's signed-off recommendation.

CREATE TABLE united_kingdom_statement_of_fitness_for_work_grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    united_kingdom_statement_of_fitness_for_work_id UUID NOT NULL UNIQUE
        REFERENCES united_kingdom_statement_of_fitness_for_work(id) ON DELETE CASCADE,

    fitness_category VARCHAR(15) NOT NULL DEFAULT '' CHECK (fitness_category IN (
        'not_fit',
        'may_be_fit',
        ''
    )),
    adaptation_intensity VARCHAR(15) NOT NULL DEFAULT '' CHECK (adaptation_intensity IN (
        'none',
        'light',
        'moderate',
        'substantial',
        'comprehensive',
        ''
    )),
    adaptation_count INTEGER NOT NULL DEFAULT 0 CHECK (adaptation_count BETWEEN 0 AND 4),
    period_days INTEGER,
    period_compliance VARCHAR(20) NOT NULL DEFAULT '' CHECK (period_compliance IN (
        'self_cert_range',
        'compliant',
        'exceeds_initial_max',
        'long_term',
        'very_long_term',
        ''
    )),
    recommendation VARCHAR(30) NOT NULL DEFAULT '' CHECK (recommendation IN (
        'standard',
        'refer_occupational_health',
        'refer_access_to_work',
        'refer_employment_advisor',
        'review_for_validity',
        ''
    )),
    is_within_first_six_months_of_condition VARCHAR(5) NOT NULL DEFAULT '' CHECK (is_within_first_six_months_of_condition IN ('yes', 'no', '')),
    is_valid VARCHAR(5) NOT NULL DEFAULT '' CHECK (is_valid IN ('yes', 'no', '')),
    grader_notes TEXT NOT NULL DEFAULT '',
    graded_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    clinician_override VARCHAR(5) NOT NULL DEFAULT '' CHECK (clinician_override IN ('yes', 'no', '')),
    clinician_override_reason VARCHAR(500) NOT NULL DEFAULT '',
    clinician_final_recommendation VARCHAR(30) NOT NULL DEFAULT '' CHECK (clinician_final_recommendation IN (
        'standard',
        'refer_occupational_health',
        'refer_access_to_work',
        'refer_employment_advisor',
        'review_for_validity',
        ''
    ))
);

CREATE TRIGGER trigger_united_kingdom_statement_of_fitness_for_work_grade_updated_at
    BEFORE UPDATE ON united_kingdom_statement_of_fitness_for_work_grade
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE united_kingdom_statement_of_fitness_for_work_grade IS
    'Computed grading result for a fit note: fitness category, adaptation intensity, period compliance, and overall recommendation.';
COMMENT ON COLUMN united_kingdom_statement_of_fitness_for_work_grade.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN united_kingdom_statement_of_fitness_for_work_grade.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN united_kingdom_statement_of_fitness_for_work_grade.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN united_kingdom_statement_of_fitness_for_work_grade.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN united_kingdom_statement_of_fitness_for_work_grade.united_kingdom_statement_of_fitness_for_work_id IS
    'Foreign key to the parent fit note (one-to-one).';
COMMENT ON COLUMN united_kingdom_statement_of_fitness_for_work_grade.fitness_category IS
    'Fitness category computed from the form: not_fit or may_be_fit.';
COMMENT ON COLUMN united_kingdom_statement_of_fitness_for_work_grade.adaptation_intensity IS
    'Adaptation intensity classification based on the number of tick boxes selected.';
COMMENT ON COLUMN united_kingdom_statement_of_fitness_for_work_grade.adaptation_count IS
    'Number of adaptation tick boxes selected (0-4).';
COMMENT ON COLUMN united_kingdom_statement_of_fitness_for_work_grade.period_days IS
    'Computed period length in calendar days.';
COMMENT ON COLUMN united_kingdom_statement_of_fitness_for_work_grade.period_compliance IS
    'Compliance category for the period: self_cert_range, compliant, exceeds_initial_max, long_term, or very_long_term.';
COMMENT ON COLUMN united_kingdom_statement_of_fitness_for_work_grade.recommendation IS
    'Engine recommendation: standard, refer_occupational_health, refer_access_to_work, refer_employment_advisor, or review_for_validity.';
COMMENT ON COLUMN united_kingdom_statement_of_fitness_for_work_grade.is_within_first_six_months_of_condition IS
    'Whether the assessment falls within the first six months of the condition (drives the 3-month max rule).';
COMMENT ON COLUMN united_kingdom_statement_of_fitness_for_work_grade.is_valid IS
    'Whether the fit note passes the validity checks (name, profession, practice address all present).';
COMMENT ON COLUMN united_kingdom_statement_of_fitness_for_work_grade.grader_notes IS
    'Free-text notes from the engine.';
COMMENT ON COLUMN united_kingdom_statement_of_fitness_for_work_grade.graded_at IS
    'Timestamp the engine last computed the result.';
COMMENT ON COLUMN united_kingdom_statement_of_fitness_for_work_grade.clinician_override IS
    'Whether the clinician overrode the engine recommendation.';
COMMENT ON COLUMN united_kingdom_statement_of_fitness_for_work_grade.clinician_override_reason IS
    'Required justification when the clinician overrode the engine recommendation.';
COMMENT ON COLUMN united_kingdom_statement_of_fitness_for_work_grade.clinician_final_recommendation IS
    'Clinician-signed-off recommendation (may equal or differ from the engine recommendation).';
