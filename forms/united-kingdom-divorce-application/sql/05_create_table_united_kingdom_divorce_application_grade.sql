-- Computed readiness classification for a divorce or dissolution application.
-- The engine classifies the application as ready-to-apply, incomplete or
-- not-eligible-yet for the stage being checked, derives the earliest date that
-- stage can be applied for, and records whether a jurisdiction ground is met.
-- This is a completeness and validity classification, not a score, and it is
-- not legal advice.

CREATE TABLE united_kingdom_divorce_application.united_kingdom_divorce_application_grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    united_kingdom_divorce_application_id UUID NOT NULL UNIQUE
        REFERENCES united_kingdom_divorce_application.united_kingdom_divorce_application(id) ON DELETE CASCADE,
    application_class VARCHAR(16) NOT NULL DEFAULT '' CHECK (application_class IN ('ready-to-apply', 'incomplete', 'not-eligible-yet', '')),
    earliest_eligible_date DATE,
    jurisdiction_met VARCHAR(5) NOT NULL DEFAULT '' CHECK (jurisdiction_met IN ('yes', 'no', '')),
    graded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trigger_united_kingdom_divorce_application_grade_updated_at
    BEFORE UPDATE ON united_kingdom_divorce_application.united_kingdom_divorce_application_grade
    FOR EACH ROW
    EXECUTE FUNCTION united_kingdom_divorce_application.set_updated_at();

COMMENT ON TABLE united_kingdom_divorce_application.united_kingdom_divorce_application_grade IS
    'Computed readiness classification for a divorce or dissolution application: application class (ready-to-apply/incomplete/not-eligible-yet), earliest eligible date for the stage, and whether a jurisdiction ground is met.';
COMMENT ON COLUMN united_kingdom_divorce_application.united_kingdom_divorce_application_grade.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN united_kingdom_divorce_application.united_kingdom_divorce_application_grade.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN united_kingdom_divorce_application.united_kingdom_divorce_application_grade.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN united_kingdom_divorce_application.united_kingdom_divorce_application_grade.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN united_kingdom_divorce_application.united_kingdom_divorce_application_grade.united_kingdom_divorce_application_id IS
    'Foreign key to the parent application (unique, 1:1).';
COMMENT ON COLUMN united_kingdom_divorce_application.united_kingdom_divorce_application_grade.application_class IS
    'Readiness classification: ready-to-apply, incomplete, or not-eligible-yet (not-eligible-yet takes precedence).';
COMMENT ON COLUMN united_kingdom_divorce_application.united_kingdom_divorce_application_grade.earliest_eligible_date IS
    'Earliest date the checked stage can be applied for; empty when no time gate applies or the dates are missing.';
COMMENT ON COLUMN united_kingdom_divorce_application.united_kingdom_divorce_application_grade.jurisdiction_met IS
    'Whether at least one England and Wales jurisdiction ground is met (yes/no).';
COMMENT ON COLUMN united_kingdom_divorce_application.united_kingdom_divorce_application_grade.graded_at IS
    'Timestamp when the engine last computed the classification.';
