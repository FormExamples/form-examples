-- Computed grading result for a child safeguarding referral. The engine
-- grades the referral's documentation completeness/validity (complete,
-- partial, or incomplete), classifies its urgency (emergency, urgent, or
-- standard), and reports a completeness percentage. A grade reflects the
-- quality and routing of the referral record, not a clinical judgement.

CREATE TABLE child_safeguarding_referral_grade (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    child_safeguarding_referral_id UUID NOT NULL UNIQUE
        REFERENCES child_safeguarding_referral(id) ON DELETE CASCADE,

    status VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (status IN ('complete', 'partial', 'incomplete', '')),
    urgency VARCHAR(15) NOT NULL DEFAULT ''
        CHECK (urgency IN ('emergency', 'urgent', 'standard', '')),
    completeness_percent INTEGER,

    graded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trigger_child_safeguarding_referral_grade_updated_at
    BEFORE UPDATE ON child_safeguarding_referral_grade
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE child_safeguarding_referral_grade IS
    'Computed grading result for a child safeguarding referral: completeness/validity status (complete/partial/incomplete), urgency classification (emergency/urgent/standard), and completeness percentage.';
COMMENT ON COLUMN child_safeguarding_referral_grade.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN child_safeguarding_referral_grade.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN child_safeguarding_referral_grade.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN child_safeguarding_referral_grade.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN child_safeguarding_referral_grade.child_safeguarding_referral_id IS
    'Foreign key to the parent referral (unique, 1:1).';
COMMENT ON COLUMN child_safeguarding_referral_grade.status IS
    'Completeness/validity status: complete, partial, or incomplete.';
COMMENT ON COLUMN child_safeguarding_referral_grade.urgency IS
    'Urgency classification: emergency (s47 + emergency services), urgent (s47 enquiry), or standard (s17 assessment). Always computed, even when the referral is incomplete.';
COMMENT ON COLUMN child_safeguarding_referral_grade.completeness_percent IS
    'Completeness percentage (0..100): answered mandatory and recommended fields / total mandatory and recommended fields x 100.';
COMMENT ON COLUMN child_safeguarding_referral_grade.graded_at IS
    'Timestamp when the engine last computed the grade.';
