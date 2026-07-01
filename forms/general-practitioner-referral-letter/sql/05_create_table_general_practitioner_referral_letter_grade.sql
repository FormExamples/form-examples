-- Computed documentation-completeness grading result for a referral
-- letter. The engine classifies the letter as Complete or Incomplete,
-- echoes the urgency classification, and reports a completeness
-- percentage. A grade reflects the quality of the letter, not the
-- clinical decision of whether to refer.

CREATE TABLE general_practitioner_referral_letter_grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    general_practitioner_referral_letter_id UUID NOT NULL UNIQUE
        REFERENCES general_practitioner_referral_letter(id) ON DELETE CASCADE,

    status VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (status IN ('Complete', 'Incomplete', '')),
    urgency VARCHAR(20) NOT NULL DEFAULT ''
        CHECK (urgency IN ('routine', 'urgent', 'two-week-wait', 'emergency', '')),
    completeness_percent INTEGER,

    graded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trigger_general_practitioner_referral_letter_grade_updated_at
    BEFORE UPDATE ON general_practitioner_referral_letter_grade
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE general_practitioner_referral_letter_grade IS
    'Computed documentation-completeness grading result for a referral letter: status (Complete/Incomplete), echoed urgency classification, and completeness percentage.';
COMMENT ON COLUMN general_practitioner_referral_letter_grade.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN general_practitioner_referral_letter_grade.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN general_practitioner_referral_letter_grade.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN general_practitioner_referral_letter_grade.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN general_practitioner_referral_letter_grade.general_practitioner_referral_letter_id IS
    'Foreign key to the parent referral letter (unique, 1:1).';
COMMENT ON COLUMN general_practitioner_referral_letter_grade.status IS
    'Completeness status: Complete when every mandatory field is present, otherwise Incomplete.';
COMMENT ON COLUMN general_practitioner_referral_letter_grade.urgency IS
    'Echoed urgency classification: routine, urgent, two-week-wait, or emergency.';
COMMENT ON COLUMN general_practitioner_referral_letter_grade.completeness_percent IS
    'Completeness percentage (0..100): present mandatory fields / total mandatory fields x 100.';
COMMENT ON COLUMN general_practitioner_referral_letter_grade.graded_at IS
    'Timestamp when the engine last computed the grade.';
