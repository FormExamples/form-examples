-- Main United States health care power of attorney (durable power of attorney
-- for health care, health care proxy, advance directive) record: the principal,
-- the agent and successor agents, the agent's authority, treatment wishes,
-- and the signing and witnessing details checked against the principal's
-- state rule. The readiness classification, fired rules, and flagged issues
-- live in dedicated child tables. Documentation support, not legal advice.

CREATE TABLE united_states_health_care_power_of_attorney (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    principal_id UUID NOT NULL REFERENCES principal(id) ON DELETE RESTRICT,
    reviewer_id UUID REFERENCES reviewer(id) ON DELETE RESTRICT,

    -- Principal
    principal_name TEXT NOT NULL DEFAULT '',
    birth_date DATE,
    state_code VARCHAR(2) NOT NULL DEFAULT '' CHECK (state_code IN ('', 'AL','AK','AZ','AR','CA','CO','CT','DE','DC','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY')),
    phone TEXT NOT NULL DEFAULT '',
    capacity_confirmed VARCHAR(5) NOT NULL DEFAULT '' CHECK (capacity_confirmed IN ('yes', 'no', '')),
    signed_voluntarily VARCHAR(5) NOT NULL DEFAULT '' CHECK (signed_voluntarily IN ('yes', 'no', '')),

    -- Agent and successors
    agent_name TEXT NOT NULL DEFAULT '',
    agent_relationship VARCHAR(20) NOT NULL DEFAULT '' CHECK (agent_relationship IN ('spouse', 'adult-child', 'parent', 'sibling', 'other-relative', 'friend', 'other', '')),
    agent_age INTEGER CHECK (agent_age IS NULL OR (agent_age >= 0 AND agent_age <= 120)),
    agent_phone TEXT NOT NULL DEFAULT '',
    agent_is_health_care_provider VARCHAR(5) NOT NULL DEFAULT '' CHECK (agent_is_health_care_provider IN ('yes', 'no', '')),
    agent_is_facility_employee VARCHAR(5) NOT NULL DEFAULT '' CHECK (agent_is_facility_employee IN ('yes', 'no', '')),
    agent_related_to_principal VARCHAR(5) NOT NULL DEFAULT '' CHECK (agent_related_to_principal IN ('yes', 'no', '')),
    agent_accepted VARCHAR(5) NOT NULL DEFAULT '' CHECK (agent_accepted IN ('yes', 'no', '')),
    successor1_name TEXT NOT NULL DEFAULT '',
    successor1_phone TEXT NOT NULL DEFAULT '',
    successor2_name TEXT NOT NULL DEFAULT '',

    -- Authority
    effective_when VARCHAR(20) NOT NULL DEFAULT '' CHECK (effective_when IN ('immediately', 'upon-incapacity', '')),
    incapacity_determined_by VARCHAR(20) NOT NULL DEFAULT '' CHECK (incapacity_determined_by IN ('one-physician', 'two-physicians', 'other', '')),
    hipaa_release VARCHAR(5) NOT NULL DEFAULT '' CHECK (hipaa_release IN ('yes', 'no', '')),
    mental_health_authority VARCHAR(5) NOT NULL DEFAULT '' CHECK (mental_health_authority IN ('yes', 'no', '')),
    organ_donation VARCHAR(20) NOT NULL DEFAULT '' CHECK (organ_donation IN ('any-needs', 'transplant-only', 'research-only', 'none', 'not-addressed', '')),
    prior_directive_status VARCHAR(20) NOT NULL DEFAULT '' CHECK (prior_directive_status IN ('none-existing', 'revokes-prior', 'prior-remains', '')),

    -- Treatment wishes
    life_sustaining_treatment VARCHAR(25) NOT NULL DEFAULT '' CHECK (life_sustaining_treatment IN ('refuse', 'time-limited-trial', 'want-all', 'agent-decides', '')),
    cpr VARCHAR(15) NOT NULL DEFAULT '' CHECK (cpr IN ('accept', 'refuse', 'agent-decides', '')),
    ventilator VARCHAR(15) NOT NULL DEFAULT '' CHECK (ventilator IN ('accept', 'refuse', 'agent-decides', '')),
    artificial_nutrition VARCHAR(15) NOT NULL DEFAULT '' CHECK (artificial_nutrition IN ('accept', 'refuse', 'agent-decides', '')),
    comfort_care_first VARCHAR(5) NOT NULL DEFAULT '' CHECK (comfort_care_first IN ('yes', 'no', '')),
    serious_illness VARCHAR(5) NOT NULL DEFAULT '' CHECK (serious_illness IN ('yes', 'no', '')),
    polst_status VARCHAR(15) NOT NULL DEFAULT '' CHECK (polst_status IN ('none', 'in-place', 'discussing', '')),
    wishes_note TEXT NOT NULL DEFAULT '',

    -- Signing and witnesses
    signature_date DATE,
    execution_method VARCHAR(25) NOT NULL DEFAULT '' CHECK (execution_method IN ('two-witnesses', 'one-witness', 'notary', 'witnesses-and-notary', '')),
    witnesses_present VARCHAR(5) NOT NULL DEFAULT '' CHECK (witnesses_present IN ('yes', 'no', '')),
    witness1_name TEXT NOT NULL DEFAULT '',
    witness1_is_relative VARCHAR(5) NOT NULL DEFAULT '' CHECK (witness1_is_relative IN ('yes', 'no', '')),
    witness1_is_heir VARCHAR(5) NOT NULL DEFAULT '' CHECK (witness1_is_heir IN ('yes', 'no', '')),
    witness1_is_agent VARCHAR(5) NOT NULL DEFAULT '' CHECK (witness1_is_agent IN ('yes', 'no', '')),
    witness1_is_provider VARCHAR(5) NOT NULL DEFAULT '' CHECK (witness1_is_provider IN ('yes', 'no', '')),
    witness2_name TEXT NOT NULL DEFAULT '',
    witness2_is_relative VARCHAR(5) NOT NULL DEFAULT '' CHECK (witness2_is_relative IN ('yes', 'no', '')),
    witness2_is_heir VARCHAR(5) NOT NULL DEFAULT '' CHECK (witness2_is_heir IN ('yes', 'no', '')),
    witness2_is_agent VARCHAR(5) NOT NULL DEFAULT '' CHECK (witness2_is_agent IN ('yes', 'no', '')),
    witness2_is_provider VARCHAR(5) NOT NULL DEFAULT '' CHECK (witness2_is_provider IN ('yes', 'no', '')),
    notary_name TEXT NOT NULL DEFAULT '',
    principal_in_skilled_nursing_facility VARCHAR(5) NOT NULL DEFAULT '' CHECK (principal_in_skilled_nursing_facility IN ('yes', 'no', '')),
    ombudsman_signed VARCHAR(5) NOT NULL DEFAULT '' CHECK (ombudsman_signed IN ('yes', 'no', '')),

    -- Distribution
    copy_to_agent VARCHAR(5) NOT NULL DEFAULT '' CHECK (copy_to_agent IN ('yes', 'no', '')),
    copy_to_physician VARCHAR(5) NOT NULL DEFAULT '' CHECK (copy_to_physician IN ('yes', 'no', '')),
    copy_to_successor VARCHAR(5) NOT NULL DEFAULT '' CHECK (copy_to_successor IN ('yes', 'no', '')),
    copy_to_facility VARCHAR(5) NOT NULL DEFAULT '' CHECK (copy_to_facility IN ('yes', 'no', ''))
);

CREATE INDEX united_states_health_care_power_of_attorney_principal_id_idx
    ON united_states_health_care_power_of_attorney (principal_id);
CREATE INDEX united_states_health_care_power_of_attorney_reviewer_id_idx
    ON united_states_health_care_power_of_attorney (reviewer_id);
CREATE TRIGGER trigger_united_states_health_care_power_of_attorney_updated_at
    BEFORE UPDATE ON united_states_health_care_power_of_attorney
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE united_states_health_care_power_of_attorney IS
    'Main United States health care power of attorney record: principal, agent and successors, authority, treatment wishes, and signing details. Readiness classification, fired rules, and flags live in child tables.';
COMMENT ON COLUMN united_states_health_care_power_of_attorney.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN united_states_health_care_power_of_attorney.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN united_states_health_care_power_of_attorney.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN united_states_health_care_power_of_attorney.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN united_states_health_care_power_of_attorney.principal_id IS
    'Foreign key to the principal who makes this directive (restrict delete).';
COMMENT ON COLUMN united_states_health_care_power_of_attorney.reviewer_id IS
    'Foreign key to the reviewer (restrict delete); optional.';
COMMENT ON COLUMN united_states_health_care_power_of_attorney.principal_name IS
    'Full legal name of the principal as written in the directive.';
COMMENT ON COLUMN united_states_health_care_power_of_attorney.birth_date IS
    'Date of birth of the principal.';
COMMENT ON COLUMN united_states_health_care_power_of_attorney.state_code IS
    'Two-letter USPS state code whose rule table applies; blank when unanswered.';
COMMENT ON COLUMN united_states_health_care_power_of_attorney.phone IS
    'Principal phone number.';
COMMENT ON COLUMN united_states_health_care_power_of_attorney.capacity_confirmed IS
    'Whether the principal understands the document and what it does (yes/no).';
COMMENT ON COLUMN united_states_health_care_power_of_attorney.signed_voluntarily IS
    'Whether the principal is signing freely, without pressure (yes/no).';
COMMENT ON COLUMN united_states_health_care_power_of_attorney.agent_name IS
    'Full name of the health care agent (proxy, surrogate, attorney-in-fact).';
COMMENT ON COLUMN united_states_health_care_power_of_attorney.agent_relationship IS
    'Agent relationship to the principal: spouse, adult-child, parent, sibling, other-relative, friend, or other.';
COMMENT ON COLUMN united_states_health_care_power_of_attorney.agent_age IS
    'Agent age in whole years; an agent must be 18 or older.';
COMMENT ON COLUMN united_states_health_care_power_of_attorney.agent_phone IS
    'Agent phone number.';
COMMENT ON COLUMN united_states_health_care_power_of_attorney.agent_is_health_care_provider IS
    'Whether the agent is the principal''s treating provider or that provider''s employee (yes/no).';
COMMENT ON COLUMN united_states_health_care_power_of_attorney.agent_is_facility_employee IS
    'Whether the agent operates or works at the facility where the principal is a patient (yes/no).';
COMMENT ON COLUMN united_states_health_care_power_of_attorney.agent_related_to_principal IS
    'Whether the agent is related to the principal by blood, marriage, or adoption (yes/no).';
COMMENT ON COLUMN united_states_health_care_power_of_attorney.agent_accepted IS
    'Whether the agent has agreed to serve (yes/no).';
COMMENT ON COLUMN united_states_health_care_power_of_attorney.successor1_name IS
    'First successor agent name.';
COMMENT ON COLUMN united_states_health_care_power_of_attorney.successor1_phone IS
    'First successor agent phone.';
COMMENT ON COLUMN united_states_health_care_power_of_attorney.successor2_name IS
    'Second successor agent name.';
COMMENT ON COLUMN united_states_health_care_power_of_attorney.effective_when IS
    'When the agent authority begins: immediately or upon-incapacity.';
COMMENT ON COLUMN united_states_health_care_power_of_attorney.incapacity_determined_by IS
    'Who decides the principal cannot decide: one-physician, two-physicians, or other.';
COMMENT ON COLUMN united_states_health_care_power_of_attorney.hipaa_release IS
    'Whether the document includes a HIPAA authorization for the agent (yes/no).';
COMMENT ON COLUMN united_states_health_care_power_of_attorney.mental_health_authority IS
    'Whether the agent may decide on mental health treatment (yes/no).';
COMMENT ON COLUMN united_states_health_care_power_of_attorney.organ_donation IS
    'Organ and tissue donation direction: any-needs, transplant-only, research-only, none, or not-addressed.';
COMMENT ON COLUMN united_states_health_care_power_of_attorney.prior_directive_status IS
    'Status of earlier health care powers of attorney: none-existing, revokes-prior, or prior-remains.';
COMMENT ON COLUMN united_states_health_care_power_of_attorney.life_sustaining_treatment IS
    'General wish on life-sustaining treatment: refuse, time-limited-trial, want-all, or agent-decides.';
COMMENT ON COLUMN united_states_health_care_power_of_attorney.cpr IS
    'CPR wish: accept, refuse, or agent-decides.';
COMMENT ON COLUMN united_states_health_care_power_of_attorney.ventilator IS
    'Ventilator wish: accept, refuse, or agent-decides.';
COMMENT ON COLUMN united_states_health_care_power_of_attorney.artificial_nutrition IS
    'Artificial nutrition and hydration wish: accept, refuse, or agent-decides.';
COMMENT ON COLUMN united_states_health_care_power_of_attorney.comfort_care_first IS
    'Whether comfort and pain relief are the priority (yes/no).';
COMMENT ON COLUMN united_states_health_care_power_of_attorney.serious_illness IS
    'Whether the principal has a serious illness or frailty (yes/no); a POLST is meant for these people.';
COMMENT ON COLUMN united_states_health_care_power_of_attorney.polst_status IS
    'POLST status: none, in-place, or discussing.';
COMMENT ON COLUMN united_states_health_care_power_of_attorney.wishes_note IS
    'Free-text values and wishes in the principal own words.';
COMMENT ON COLUMN united_states_health_care_power_of_attorney.signature_date IS
    'Date the principal signed the directive.';
COMMENT ON COLUMN united_states_health_care_power_of_attorney.execution_method IS
    'Signing method: two-witnesses, one-witness, notary, or witnesses-and-notary.';
COMMENT ON COLUMN united_states_health_care_power_of_attorney.witnesses_present IS
    'Whether the principal signed, or acknowledged the signature, in the presence of the witnesses or notary (yes/no).';
COMMENT ON COLUMN united_states_health_care_power_of_attorney.witness1_name IS
    'Witness 1 name.';
COMMENT ON COLUMN united_states_health_care_power_of_attorney.witness1_is_relative IS
    'Whether witness 1 is related to the principal (yes/no).';
COMMENT ON COLUMN united_states_health_care_power_of_attorney.witness1_is_heir IS
    'Whether witness 1 would inherit from the principal (yes/no).';
COMMENT ON COLUMN united_states_health_care_power_of_attorney.witness1_is_agent IS
    'Whether witness 1 is the named agent (yes/no).';
COMMENT ON COLUMN united_states_health_care_power_of_attorney.witness1_is_provider IS
    'Whether witness 1 is the principal''s provider or facility staff (yes/no).';
COMMENT ON COLUMN united_states_health_care_power_of_attorney.witness2_name IS
    'Witness 2 name.';
COMMENT ON COLUMN united_states_health_care_power_of_attorney.witness2_is_relative IS
    'Whether witness 2 is related to the principal (yes/no).';
COMMENT ON COLUMN united_states_health_care_power_of_attorney.witness2_is_heir IS
    'Whether witness 2 would inherit from the principal (yes/no).';
COMMENT ON COLUMN united_states_health_care_power_of_attorney.witness2_is_agent IS
    'Whether witness 2 is the named agent (yes/no).';
COMMENT ON COLUMN united_states_health_care_power_of_attorney.witness2_is_provider IS
    'Whether witness 2 is the principal''s provider or facility staff (yes/no).';
COMMENT ON COLUMN united_states_health_care_power_of_attorney.notary_name IS
    'Name of the notary public, when the acknowledgment route is used.';
COMMENT ON COLUMN united_states_health_care_power_of_attorney.principal_in_skilled_nursing_facility IS
    'Whether the principal lives in a skilled nursing facility (yes/no).';
COMMENT ON COLUMN united_states_health_care_power_of_attorney.ombudsman_signed IS
    'Whether a patient advocate or ombudsman signed as a witness (yes/no).';
COMMENT ON COLUMN united_states_health_care_power_of_attorney.copy_to_agent IS
    'Whether a signed copy was given to the agent (yes/no).';
COMMENT ON COLUMN united_states_health_care_power_of_attorney.copy_to_physician IS
    'Whether a signed copy was given to the principal physician (yes/no).';
COMMENT ON COLUMN united_states_health_care_power_of_attorney.copy_to_successor IS
    'Whether a signed copy was given to the successor agents (yes/no).';
COMMENT ON COLUMN united_states_health_care_power_of_attorney.copy_to_facility IS
    'Whether a copy was brought to the hospital or care facility (yes/no).';
