-- Main child-safeguarding-referral record: one structured referral to
-- children's social care when a professional believes a child may be at
-- risk of harm. Holds the referrer context, child-specific details, the
-- family and household, the concern or allegation, the category of abuse,
-- presenting evidence, immediate risk and safety, the consent and
-- information-sharing basis, who else has been informed, and the action
-- requested. The completeness/urgency grade, the audit trail of fired
-- grading rules, and the safeguarding flags live in dedicated child
-- tables. This is a documentation-completeness and risk-classification
-- record, not a numeric score.

CREATE TABLE child_safeguarding_referral (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    patient_id UUID NOT NULL REFERENCES patient(id) ON DELETE RESTRICT,
    clinician_id UUID REFERENCES clinician(id) ON DELETE RESTRICT,

    -- Referrer context (identity lives in the clinician table)
    referrer_organisation TEXT NOT NULL DEFAULT '',
    referred_at TIMESTAMPTZ,
    relationship_to_child TEXT NOT NULL DEFAULT '',

    -- Child-specific details (core demographics live in the patient table)
    child_age NUMERIC(4,1),
    child_setting TEXT NOT NULL DEFAULT '',
    child_reference TEXT NOT NULL DEFAULT '',
    child_ethnicity TEXT NOT NULL DEFAULT '',
    child_first_language TEXT NOT NULL DEFAULT '',
    child_disability TEXT NOT NULL DEFAULT '',

    -- Family and household
    carers TEXT NOT NULL DEFAULT '',
    household_members TEXT NOT NULL DEFAULT '',
    other_children TEXT NOT NULL DEFAULT '',
    professionals_involved TEXT NOT NULL DEFAULT '',

    -- The concern
    concern_description TEXT NOT NULL DEFAULT '',
    concern_onset TEXT NOT NULL DEFAULT '',
    child_disclosed VARCHAR(5) NOT NULL DEFAULT '' CHECK (child_disclosed IN ('yes', 'no', '')),
    referrer_observations TEXT NOT NULL DEFAULT '',

    -- Category of abuse
    primary_category VARCHAR(15) NOT NULL DEFAULT '' CHECK (primary_category IN ('physical', 'emotional', 'sexual', 'neglect', '')),
    additional_categories TEXT NOT NULL DEFAULT '',
    presenting_evidence TEXT NOT NULL DEFAULT '',

    -- Immediate risk and safety
    immediate_danger VARCHAR(5) NOT NULL DEFAULT '' CHECK (immediate_danger IN ('yes', 'no', '')),
    child_whereabouts TEXT NOT NULL DEFAULT '',
    who_with_child TEXT NOT NULL DEFAULT '',
    alleged_person_in_contact VARCHAR(10) NOT NULL DEFAULT '' CHECK (alleged_person_in_contact IN ('yes', 'no', 'unknown', '')),
    other_children_at_risk VARCHAR(10) NOT NULL DEFAULT '' CHECK (other_children_at_risk IN ('yes', 'no', 'unknown', '')),

    -- Consent and information sharing
    consent_sought VARCHAR(5) NOT NULL DEFAULT '' CHECK (consent_sought IN ('yes', 'no', '')),
    consent_status VARCHAR(15) NOT NULL DEFAULT '' CHECK (consent_status IN ('given', 'refused', 'not-sought', '')),
    sharing_basis_without_consent VARCHAR(35) NOT NULL DEFAULT '' CHECK (sharing_basis_without_consent IN ('risk-of-serious-harm', 'seeking-consent-increases-risk', 'not-applicable', '')),
    family_aware VARCHAR(5) NOT NULL DEFAULT '' CHECK (family_aware IN ('yes', 'no', '')),
    unsafe_to_inform_reason TEXT NOT NULL DEFAULT '',

    -- Who else is informed
    agencies_contacted TEXT NOT NULL DEFAULT '',
    strategy_discussion_held VARCHAR(5) NOT NULL DEFAULT '' CHECK (strategy_discussion_held IN ('yes', 'no', '')),
    previous_safeguarding_history TEXT NOT NULL DEFAULT '',

    -- Requested action
    requested_action TEXT NOT NULL DEFAULT '',
    referrer_declaration VARCHAR(5) NOT NULL DEFAULT '' CHECK (referrer_declaration IN ('yes', 'no', '')),
    notes TEXT NOT NULL DEFAULT ''
);

CREATE INDEX child_safeguarding_referral_patient_id_idx
    ON child_safeguarding_referral (patient_id);
CREATE INDEX child_safeguarding_referral_clinician_id_idx
    ON child_safeguarding_referral (clinician_id);

CREATE TRIGGER trigger_child_safeguarding_referral_updated_at
    BEFORE UPDATE ON child_safeguarding_referral
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE child_safeguarding_referral IS
    'Main child-safeguarding-referral record: referrer context, child details, family and household, the concern or allegation, category of abuse, presenting evidence, immediate risk and safety, consent and information-sharing basis, who else is informed, and the action requested. Grade, fired rules, and flags live in child tables.';
COMMENT ON COLUMN child_safeguarding_referral.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN child_safeguarding_referral.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN child_safeguarding_referral.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN child_safeguarding_referral.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN child_safeguarding_referral.patient_id IS
    'Foreign key to the child this referral concerns (restrict delete).';
COMMENT ON COLUMN child_safeguarding_referral.clinician_id IS
    'Foreign key to the referrer making the referral (restrict delete); optional.';
COMMENT ON COLUMN child_safeguarding_referral.referrer_organisation IS
    'Employing organisation of the referrer.';
COMMENT ON COLUMN child_safeguarding_referral.referred_at IS
    'Date and time the referral was made.';
COMMENT ON COLUMN child_safeguarding_referral.relationship_to_child IS
    'How the referrer knows the child.';
COMMENT ON COLUMN child_safeguarding_referral.child_age IS
    'Age of the child in years, used as a fallback when the date of birth is unknown.';
COMMENT ON COLUMN child_safeguarding_referral.child_setting IS
    'Education or care setting the child attends (school, nursery, college).';
COMMENT ON COLUMN child_safeguarding_referral.child_reference IS
    'NHS number or local unique reference for the child.';
COMMENT ON COLUMN child_safeguarding_referral.child_ethnicity IS
    'Self-described ethnicity of the child where known.';
COMMENT ON COLUMN child_safeguarding_referral.child_first_language IS
    'First language of the child, recorded for any interpreter need.';
COMMENT ON COLUMN child_safeguarding_referral.child_disability IS
    'Disability or communication need of the child.';
COMMENT ON COLUMN child_safeguarding_referral.carers IS
    'Parents or carers with parental responsibility.';
COMMENT ON COLUMN child_safeguarding_referral.household_members IS
    'Other members of the household.';
COMMENT ON COLUMN child_safeguarding_referral.other_children IS
    'Siblings or other children in the household.';
COMMENT ON COLUMN child_safeguarding_referral.professionals_involved IS
    'Professionals already involved (GP, school, existing social worker).';
COMMENT ON COLUMN child_safeguarding_referral.concern_description IS
    'What the concern or allegation is (mandatory for a valid referral).';
COMMENT ON COLUMN child_safeguarding_referral.concern_onset IS
    'When and how the concern came to light.';
COMMENT ON COLUMN child_safeguarding_referral.child_disclosed IS
    'Whether the child disclosed abuse (yes/no); yes raises the disclosure-of-abuse flag and drives urgent classification.';
COMMENT ON COLUMN child_safeguarding_referral.referrer_observations IS
    'Direct observations recorded by the referrer.';
COMMENT ON COLUMN child_safeguarding_referral.primary_category IS
    'Primary category of abuse (mandatory): physical, emotional, sexual, or neglect.';
COMMENT ON COLUMN child_safeguarding_referral.additional_categories IS
    'Any further categories of abuse beyond the primary category.';
COMMENT ON COLUMN child_safeguarding_referral.presenting_evidence IS
    'Indicators and evidence presenting the concern.';
COMMENT ON COLUMN child_safeguarding_referral.immediate_danger IS
    'Whether the child is in immediate danger (mandatory, yes/no); yes classifies the referral as an emergency.';
COMMENT ON COLUMN child_safeguarding_referral.child_whereabouts IS
    'Where the child is now.';
COMMENT ON COLUMN child_safeguarding_referral.who_with_child IS
    'Who is currently with the child.';
COMMENT ON COLUMN child_safeguarding_referral.alleged_person_in_contact IS
    'Whether the alleged person is in contact with the child (yes/no/unknown); yes drives urgent classification.';
COMMENT ON COLUMN child_safeguarding_referral.other_children_at_risk IS
    'Whether siblings or other children are at risk (yes/no/unknown); yes raises the other-children-at-risk flag and drives urgent classification.';
COMMENT ON COLUMN child_safeguarding_referral.consent_sought IS
    'Whether consent to refer was sought (yes/no).';
COMMENT ON COLUMN child_safeguarding_referral.consent_status IS
    'Consent status: given, refused, or not-sought.';
COMMENT ON COLUMN child_safeguarding_referral.sharing_basis_without_consent IS
    'Lawful basis for sharing without consent (mandatory when consent is not given): risk-of-serious-harm, seeking-consent-increases-risk, or not-applicable.';
COMMENT ON COLUMN child_safeguarding_referral.family_aware IS
    'Whether the child or family is aware of the referral (yes/no).';
COMMENT ON COLUMN child_safeguarding_referral.unsafe_to_inform_reason IS
    'Why informing the child or family would increase risk.';
COMMENT ON COLUMN child_safeguarding_referral.agencies_contacted IS
    'Agencies already contacted (police, health, education).';
COMMENT ON COLUMN child_safeguarding_referral.strategy_discussion_held IS
    'Whether a strategy discussion has already been held (yes/no).';
COMMENT ON COLUMN child_safeguarding_referral.previous_safeguarding_history IS
    'Prior safeguarding involvement if known; non-empty raises the previous-history flag.';
COMMENT ON COLUMN child_safeguarding_referral.requested_action IS
    'Action requested of children''s social care.';
COMMENT ON COLUMN child_safeguarding_referral.referrer_declaration IS
    'Whether the referrer confirms the accuracy of the referral (yes/no).';
COMMENT ON COLUMN child_safeguarding_referral.notes IS
    'Free-text notes shown in the summary.';
