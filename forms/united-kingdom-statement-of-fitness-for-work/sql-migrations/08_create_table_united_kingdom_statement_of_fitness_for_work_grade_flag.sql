-- Safety-critical flags that fire independently of the fitness category,
-- with priority and a suggested action for the patient, employer, or DWP.

CREATE TABLE united_kingdom_statement_of_fitness_for_work_grade_flag (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    united_kingdom_statement_of_fitness_for_work_grade_id UUID NOT NULL
        REFERENCES united_kingdom_statement_of_fitness_for_work_grade(id) ON DELETE CASCADE,
    flag_id VARCHAR(60) NOT NULL,
    category VARCHAR(60) NOT NULL DEFAULT '' CHECK (category IN (
        'invalid_no_name',
        'invalid_no_profession',
        'invalid_no_practice_address',
        'may_be_fit_no_adaptations',
        'may_be_fit_no_comments',
        'non_medical_reason_detected',
        'automatic_disability',
        'duration_exceeds_3_months_in_first_6_months',
        'self_cert_range',
        'long_absence_four_weeks',
        'long_absence_twelve_weeks',
        'private_practice',
        'secondary_care_discharge',
        'new_authority_hcp',
        'mental_health_condition',
        'driving_restriction_recommended',
        'safeguarding_concern',
        'ongoing_review_required',
        'other',
        ''
    )),
    priority VARCHAR(10) NOT NULL DEFAULT '' CHECK (priority IN ('low', 'medium', 'high', '')),
    description VARCHAR(500) NOT NULL DEFAULT '',
    suggested_action VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX index_united_kingdom_statement_of_fitness_for_work_grade_flag_grade_id
    ON united_kingdom_statement_of_fitness_for_work_grade_flag(united_kingdom_statement_of_fitness_for_work_grade_id);

CREATE TRIGGER trigger_united_kingdom_statement_of_fitness_for_work_grade_flag_updated_at
    BEFORE UPDATE ON united_kingdom_statement_of_fitness_for_work_grade_flag
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE united_kingdom_statement_of_fitness_for_work_grade_flag IS
    'Safety-critical flags fired independently of the fitness category, with priority and suggested action.';
COMMENT ON COLUMN united_kingdom_statement_of_fitness_for_work_grade_flag.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN united_kingdom_statement_of_fitness_for_work_grade_flag.created_at IS
    'Timestamp when this row was created.';
COMMENT ON COLUMN united_kingdom_statement_of_fitness_for_work_grade_flag.updated_at IS
    'Timestamp when this row was updated most-recently.';
COMMENT ON COLUMN united_kingdom_statement_of_fitness_for_work_grade_flag.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN united_kingdom_statement_of_fitness_for_work_grade_flag.united_kingdom_statement_of_fitness_for_work_grade_id IS
    'Foreign key to the parent grade row.';
COMMENT ON COLUMN united_kingdom_statement_of_fitness_for_work_grade_flag.flag_id IS
    'Stable flag identifier (e.g. F-AUTOMATIC-DISABILITY-001).';
COMMENT ON COLUMN united_kingdom_statement_of_fitness_for_work_grade_flag.category IS
    'Flag category — see the eighteen-flag catalogue in index.md.';
COMMENT ON COLUMN united_kingdom_statement_of_fitness_for_work_grade_flag.priority IS
    'Priority: low, medium, or high.';
COMMENT ON COLUMN united_kingdom_statement_of_fitness_for_work_grade_flag.description IS
    'Human-readable description of what triggered the flag.';
COMMENT ON COLUMN united_kingdom_statement_of_fitness_for_work_grade_flag.suggested_action IS
    'Suggested action (e.g. "consider Access to Work referral").';
