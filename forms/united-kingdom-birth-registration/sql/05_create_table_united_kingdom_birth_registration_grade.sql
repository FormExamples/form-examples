-- Computed completeness and validity classification for a United Kingdom Birth
-- Registration application. The engine classifies it as ready-to-submit,
-- incomplete, needs-additional-evidence, or out-of-scope (not a birth
-- registrable in England and Wales), derives the days from birth to
-- registration against the 42-day statutory period, and counts missing items.
-- This is a readiness classification, not a numeric score; the registrar's
-- decision and the register entry remain the legal record.

CREATE TABLE united_kingdom_birth_registration_grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    united_kingdom_birth_registration_id UUID NOT NULL UNIQUE
        REFERENCES united_kingdom_birth_registration(id) ON DELETE CASCADE,

    readiness_class VARCHAR(30) NOT NULL DEFAULT ''
        CHECK (readiness_class IN ('ready-to-submit', 'incomplete', 'needs-additional-evidence', 'out-of-scope', '')),
    days_since_birth INTEGER,
    late_registration VARCHAR(5) NOT NULL DEFAULT ''
        CHECK (late_registration IN ('yes', 'no', '')),
    missing_item_count INTEGER,

    graded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trigger_united_kingdom_birth_registration_grade_updated_at
    BEFORE UPDATE ON united_kingdom_birth_registration_grade
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE united_kingdom_birth_registration_grade IS
    'Computed completeness and validity classification for a United Kingdom Birth Registration application: readiness class (ready-to-submit/incomplete/needs-additional-evidence/out-of-scope), days from birth to registration, late-registration indicator, and count of missing items.';
COMMENT ON COLUMN united_kingdom_birth_registration_grade.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN united_kingdom_birth_registration_grade.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN united_kingdom_birth_registration_grade.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN united_kingdom_birth_registration_grade.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN united_kingdom_birth_registration_grade.united_kingdom_birth_registration_id IS
    'Foreign key to the parent application (unique, 1:1).';
COMMENT ON COLUMN united_kingdom_birth_registration_grade.readiness_class IS
    'Readiness classification: ready-to-submit, incomplete, needs-additional-evidence, or out-of-scope (out-of-scope takes precedence, then incomplete).';
COMMENT ON COLUMN united_kingdom_birth_registration_grade.days_since_birth IS
    'Whole days from the date of birth to the registration date; null when either date is missing.';
COMMENT ON COLUMN united_kingdom_birth_registration_grade.late_registration IS
    'Whether registration falls after the 42-day statutory period (yes/no).';
COMMENT ON COLUMN united_kingdom_birth_registration_grade.missing_item_count IS
    'Number of required items still missing.';
COMMENT ON COLUMN united_kingdom_birth_registration_grade.graded_at IS
    'Timestamp when the engine last computed the classification.';
