-- Computed classification for a newborn-blood-spot-screening record. A pure
-- engine normalises the nine per-condition results, derives the overall
-- screening outcome by precedence (any suspected wins), sets the referral
-- status, and records the derived sample-quality flags. This is a
-- result-classification outcome, not a numeric score.

CREATE TABLE newborn_blood_spot_screening_grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    newborn_blood_spot_screening_id UUID NOT NULL UNIQUE
        REFERENCES newborn_blood_spot_screening(id) ON DELETE CASCADE,

    overall_outcome VARCHAR(30) NOT NULL DEFAULT ''
        CHECK (overall_outcome IN (
            'referral-required',
            'repeat-required',
            'incomplete',
            'declined-only-outstanding',
            'all-not-suspected',
            ''
        )),
    referral_status VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (referral_status IN ('routine', 'repeat', 'urgent', '')),

    -- Derived sample-quality flags (see spec section 4)
    sample_adequate BOOLEAN,
    within_window BOOLEAN,
    avoidable_repeat BOOLEAN,

    graded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trigger_newborn_blood_spot_screening_grade_updated_at
    BEFORE UPDATE ON newborn_blood_spot_screening_grade
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE newborn_blood_spot_screening_grade IS
    'Computed classification for a newborn-blood-spot-screening record: overall screening outcome, referral status, and derived sample-quality flags.';
COMMENT ON COLUMN newborn_blood_spot_screening_grade.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN newborn_blood_spot_screening_grade.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN newborn_blood_spot_screening_grade.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN newborn_blood_spot_screening_grade.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN newborn_blood_spot_screening_grade.newborn_blood_spot_screening_id IS
    'Foreign key to the parent newborn-blood-spot-screening record (unique, 1:1).';
COMMENT ON COLUMN newborn_blood_spot_screening_grade.overall_outcome IS
    'Overall screening outcome by precedence: referral-required (any suspected), repeat-required, incomplete, declined-only-outstanding, or all-not-suspected.';
COMMENT ON COLUMN newborn_blood_spot_screening_grade.referral_status IS
    'Referral status: urgent when referral-required, repeat when repeat-required, otherwise routine.';
COMMENT ON COLUMN newborn_blood_spot_screening_grade.sample_adequate IS
    'Derived: true when sample_adequacy is adequate.';
COMMENT ON COLUMN newborn_blood_spot_screening_grade.within_window IS
    'Derived: true when age_at_sample_days is between day 5 and day 8 inclusive.';
COMMENT ON COLUMN newborn_blood_spot_screening_grade.avoidable_repeat IS
    'Derived: true when this is a repeat whose reason is inadequate-sample, too-early, or technical.';
COMMENT ON COLUMN newborn_blood_spot_screening_grade.graded_at IS
    'Timestamp when the engine last computed the classification.';
