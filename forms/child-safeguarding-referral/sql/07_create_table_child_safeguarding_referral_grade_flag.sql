-- Safeguarding flags that fire independently of the completeness status
-- and urgency, each with a priority and a suggested action for the
-- referrer or the receiving social-care team.

CREATE TABLE child_safeguarding_referral_grade_flag (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    child_safeguarding_referral_grade_id UUID NOT NULL
        REFERENCES child_safeguarding_referral_grade(id) ON DELETE CASCADE,

    flag_id VARCHAR(50) NOT NULL,
    category VARCHAR(30) NOT NULL DEFAULT ''
        CHECK (category IN (
            'immediate-danger',
            'disclosure-of-abuse',
            'sexual-abuse-category',
            'other-children-at-risk',
            'no-consent-basis',
            'mandatory-field-missing',
            'child-unaware-unsafe',
            'previous-history',
            'other',
            ''
        )),
    priority VARCHAR(10) NOT NULL DEFAULT ''
        CHECK (priority IN ('low', 'medium', 'high', '')),
    description VARCHAR(500) NOT NULL DEFAULT '',
    suggested_action VARCHAR(500) NOT NULL DEFAULT ''
);

CREATE INDEX child_safeguarding_referral_grade_flag_grade_id_idx
    ON child_safeguarding_referral_grade_flag (child_safeguarding_referral_grade_id);

CREATE TRIGGER trigger_child_safeguarding_referral_grade_flag_updated_at
    BEFORE UPDATE ON child_safeguarding_referral_grade_flag
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE child_safeguarding_referral_grade_flag IS
    'Safeguarding flags that fire independently of the completeness status and urgency, each with a priority and a suggested action for the referrer or receiving social-care team.';
COMMENT ON COLUMN child_safeguarding_referral_grade_flag.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN child_safeguarding_referral_grade_flag.created_at IS
    'Timestamp when the row was created.';
COMMENT ON COLUMN child_safeguarding_referral_grade_flag.updated_at IS
    'Timestamp when the row was most recently updated.';
COMMENT ON COLUMN child_safeguarding_referral_grade_flag.deleted_at IS
    'Timestamp when the row was soft-deleted.';
COMMENT ON COLUMN child_safeguarding_referral_grade_flag.child_safeguarding_referral_grade_id IS
    'Foreign key to the parent grade.';
COMMENT ON COLUMN child_safeguarding_referral_grade_flag.flag_id IS
    'Stable flag identifier (e.g. F-IMMEDIATE-DANGER-001).';
COMMENT ON COLUMN child_safeguarding_referral_grade_flag.category IS
    'Flag category: immediate-danger, disclosure-of-abuse, sexual-abuse-category, other-children-at-risk, no-consent-basis, mandatory-field-missing, child-unaware-unsafe, previous-history, or other.';
COMMENT ON COLUMN child_safeguarding_referral_grade_flag.priority IS
    'Priority: low, medium, high.';
COMMENT ON COLUMN child_safeguarding_referral_grade_flag.description IS
    'Human-readable description of what fired the flag.';
COMMENT ON COLUMN child_safeguarding_referral_grade_flag.suggested_action IS
    'Suggested safeguarding action (e.g. "escalate to emergency services now", "record a lawful basis for sharing without consent").';
