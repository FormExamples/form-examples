-- Eligibility determination for an application.
--
-- This is the output of the grading engine: a single outcome plus
-- the validity period of the resulting certificate.

CREATE TABLE grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    application_id UUID NOT NULL UNIQUE
        REFERENCES application(id) ON DELETE CASCADE,

    outcome TEXT NOT NULL DEFAULT '' CHECK (outcome IN ('eligible', 'ineligible', 'requires-clarification', '')),
    redirect_to TEXT NOT NULL DEFAULT '' CHECK (redirect_to IN ('', 'FW8', 'age-exemption', 'low-income-scheme', 'hc1', 'hc2')),

    result_category TEXT NOT NULL DEFAULT '',
    result_score NUMERIC(5, 2),
    result_notes TEXT NOT NULL DEFAULT '',

    valid_from DATE,
    valid_until DATE,
    validity_years INTEGER NOT NULL DEFAULT 5 CHECK (validity_years BETWEEN 0 AND 10),

    graded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trigger_grade_updated_at
    BEFORE UPDATE ON grade
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE grade IS
    'Computed eligibility determination for an FP92A application.';
COMMENT ON COLUMN grade.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN grade.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN grade.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN grade.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN grade.application_id IS
    'Foreign key to the parent application (one grade per application).';
COMMENT ON COLUMN grade.outcome IS
    'Eligibility outcome: eligible, ineligible, or requires-clarification.';
COMMENT ON COLUMN grade.redirect_to IS
    'If ineligible on FP92A, suggested alternative exemption route.';
COMMENT ON COLUMN grade.result_category IS
    'Headline category as a human-readable label.';
COMMENT ON COLUMN grade.result_score IS
    'Numeric score (always 1.0 for eligible, 0.0 otherwise).';
COMMENT ON COLUMN grade.result_notes IS
    'Free-text rationale or summary attached to the grade.';
COMMENT ON COLUMN grade.valid_from IS
    'Date the certificate would become valid (typically completed_date).';
COMMENT ON COLUMN grade.valid_until IS
    'Date the certificate would expire (typically valid_from + validity_years).';
COMMENT ON COLUMN grade.validity_years IS
    'Number of years the certificate is valid for (NHSBSA default: 5).';
COMMENT ON COLUMN grade.graded_at IS
    'Timestamp the grade was last (re-)computed.';
