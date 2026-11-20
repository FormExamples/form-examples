-- Main United States durable financial power of attorney record: one
-- instrument documenting the principal, the durable and effectiveness choices,
-- the agent and successor, general grants and express "hot power" grants, the
-- notary and witness plan, and the acceptance and use plan. The execution-
-- readiness result, fired rules, and flagged issues live in dedicated child
-- tables. Documentation support, not legal advice.

CREATE TABLE united_states_durable_financial_power_of_attorney (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    principal_id UUID NOT NULL REFERENCES principal(id) ON DELETE RESTRICT,
    agent_id UUID REFERENCES agent(id) ON DELETE RESTRICT,
    principal_name TEXT NOT NULL DEFAULT '',
    date_of_birth DATE,
    state VARCHAR(2) NOT NULL DEFAULT '',
    principal_address TEXT NOT NULL DEFAULT '',
    capacity_confirmed VARCHAR(5) NOT NULL DEFAULT '' CHECK (capacity_confirmed IN ('yes', 'no', '')),
    durable_statement VARCHAR(5) NOT NULL DEFAULT '' CHECK (durable_statement IN ('yes', 'no', '')),
    effectiveness VARCHAR(10) NOT NULL DEFAULT '' CHECK (effectiveness IN ('immediate', 'springing', '')),
    springing_trigger VARCHAR(30) NOT NULL DEFAULT '' CHECK (springing_trigger IN ('physician-certification', 'named-person-declaration', 'court-determination', '')),
    statutory_notice_included VARCHAR(5) NOT NULL DEFAULT '' CHECK (statutory_notice_included IN ('yes', 'no', '')),
    agent_name TEXT NOT NULL DEFAULT '',
    agent_relationship VARCHAR(25) NOT NULL DEFAULT '' CHECK (agent_relationship IN ('spouse', 'child', 'other-family', 'friend', 'professional', 'financial-institution', '')),
    agent_is_adult VARCHAR(5) NOT NULL DEFAULT '' CHECK (agent_is_adult IN ('yes', 'no', '')),
    agent_signed_acknowledgment VARCHAR(5) NOT NULL DEFAULT '' CHECK (agent_signed_acknowledgment IN ('yes', 'no', '')),
    successor_agent_name TEXT NOT NULL DEFAULT '',
    co_agents_mode VARCHAR(15) NOT NULL DEFAULT '' CHECK (co_agents_mode IN ('sole', 'jointly', 'independently', '')),
    compensation VARCHAR(10) NOT NULL DEFAULT '' CHECK (compensation IN ('none', 'reasonable', 'fixed', '')),
    compensation_amount NUMERIC(12,2),
    grant_banking VARCHAR(5) NOT NULL DEFAULT '' CHECK (grant_banking IN ('yes', 'no', '')),
    grant_real_estate VARCHAR(5) NOT NULL DEFAULT '' CHECK (grant_real_estate IN ('yes', 'no', '')),
    grant_investments VARCHAR(5) NOT NULL DEFAULT '' CHECK (grant_investments IN ('yes', 'no', '')),
    grant_business VARCHAR(5) NOT NULL DEFAULT '' CHECK (grant_business IN ('yes', 'no', '')),
    grant_insurance VARCHAR(5) NOT NULL DEFAULT '' CHECK (grant_insurance IN ('yes', 'no', '')),
    grant_tax_matters VARCHAR(5) NOT NULL DEFAULT '' CHECK (grant_tax_matters IN ('yes', 'no', '')),
    grant_benefits VARCHAR(5) NOT NULL DEFAULT '' CHECK (grant_benefits IN ('yes', 'no', '')),
    grant_retirement VARCHAR(5) NOT NULL DEFAULT '' CHECK (grant_retirement IN ('yes', 'no', '')),
    grant_claims VARCHAR(5) NOT NULL DEFAULT '' CHECK (grant_claims IN ('yes', 'no', '')),
    grant_personal_property VARCHAR(5) NOT NULL DEFAULT '' CHECK (grant_personal_property IN ('yes', 'no', '')),
    hot_create_trust VARCHAR(5) NOT NULL DEFAULT '' CHECK (hot_create_trust IN ('yes', 'no', '')),
    hot_gift VARCHAR(5) NOT NULL DEFAULT '' CHECK (hot_gift IN ('yes', 'no', '')),
    hot_survivorship VARCHAR(5) NOT NULL DEFAULT '' CHECK (hot_survivorship IN ('yes', 'no', '')),
    hot_beneficiary VARCHAR(5) NOT NULL DEFAULT '' CHECK (hot_beneficiary IN ('yes', 'no', '')),
    hot_delegate VARCHAR(5) NOT NULL DEFAULT '' CHECK (hot_delegate IN ('yes', 'no', '')),
    hot_annuity_waiver VARCHAR(5) NOT NULL DEFAULT '' CHECK (hot_annuity_waiver IN ('yes', 'no', '')),
    hot_disclaim VARCHAR(5) NOT NULL DEFAULT '' CHECK (hot_disclaim IN ('yes', 'no', '')),
    hot_powers_initialed VARCHAR(5) NOT NULL DEFAULT '' CHECK (hot_powers_initialed IN ('yes', 'no', '')),
    gift_limit_type VARCHAR(20) NOT NULL DEFAULT '' CHECK (gift_limit_type IN ('annual-exclusion', 'fixed-amount', 'unlimited', 'none', '')),
    gift_limit_amount NUMERIC(12,2),
    self_gifting_allowed VARCHAR(5) NOT NULL DEFAULT '' CHECK (self_gifting_allowed IN ('yes', 'no', '')),
    notary_arranged VARCHAR(5) NOT NULL DEFAULT '' CHECK (notary_arranged IN ('yes', 'no', '')),
    witness_count INTEGER CHECK (witness_count IS NULL OR witness_count >= 0),
    witness_is_agent VARCHAR(5) NOT NULL DEFAULT '' CHECK (witness_is_agent IN ('yes', 'no', '')),
    used_for_real_estate VARCHAR(5) NOT NULL DEFAULT '' CHECK (used_for_real_estate IN ('yes', 'no', '')),
    bank_form_completed VARCHAR(10) NOT NULL DEFAULT '' CHECK (bank_form_completed IN ('yes', 'no', 'not-needed', '')),
    form2848_status VARCHAR(12) NOT NULL DEFAULT '' CHECK (form2848_status IN ('filed', 'not-filed', 'not-needed', ''))
);

CREATE INDEX dpoa_principal_id_idx
    ON united_states_durable_financial_power_of_attorney (principal_id);
CREATE INDEX dpoa_agent_id_idx
    ON united_states_durable_financial_power_of_attorney (agent_id);

CREATE TRIGGER trigger_dpoa_updated_at
    BEFORE UPDATE ON united_states_durable_financial_power_of_attorney
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE united_states_durable_financial_power_of_attorney IS
    'Main United States durable financial power of attorney record: principal, durability and effectiveness, agent and successor, general grants and hot powers, execution plan, and acceptance plan. Classification, fired rules, and flags live in child tables.';
COMMENT ON COLUMN united_states_durable_financial_power_of_attorney.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN united_states_durable_financial_power_of_attorney.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN united_states_durable_financial_power_of_attorney.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN united_states_durable_financial_power_of_attorney.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN united_states_durable_financial_power_of_attorney.principal_id IS
    'Foreign key to the principal who signs the instrument (restrict delete).';
COMMENT ON COLUMN united_states_durable_financial_power_of_attorney.agent_id IS
    'Foreign key to the primary agent (restrict delete); optional.';
COMMENT ON COLUMN united_states_durable_financial_power_of_attorney.principal_name IS
    'Full legal name of the principal as written in the instrument.';
COMMENT ON COLUMN united_states_durable_financial_power_of_attorney.date_of_birth IS
    'Date of birth of the principal.';
COMMENT ON COLUMN united_states_durable_financial_power_of_attorney.state IS
    'Governing state as the two-letter United States postal code; empty when unanswered.';
COMMENT ON COLUMN united_states_durable_financial_power_of_attorney.principal_address IS
    'Principal address.';
COMMENT ON COLUMN united_states_durable_financial_power_of_attorney.capacity_confirmed IS
    'Whether the principal has capacity to sign and understands the document (yes/no).';
COMMENT ON COLUMN united_states_durable_financial_power_of_attorney.durable_statement IS
    'Whether the instrument is durable: its authority survives the principal incapacity (yes/no).';
COMMENT ON COLUMN united_states_durable_financial_power_of_attorney.effectiveness IS
    'When the power takes effect: immediate on signing, or springing on a later event.';
COMMENT ON COLUMN united_states_durable_financial_power_of_attorney.springing_trigger IS
    'Who determines the springing event: physician-certification, named-person-declaration, or court-determination.';
COMMENT ON COLUMN united_states_durable_financial_power_of_attorney.statutory_notice_included IS
    'Whether the mandatory statutory notice text for the governing state is included (yes/no).';
COMMENT ON COLUMN united_states_durable_financial_power_of_attorney.agent_name IS
    'Full name of the primary agent.';
COMMENT ON COLUMN united_states_durable_financial_power_of_attorney.agent_relationship IS
    'Relationship of the agent to the principal.';
COMMENT ON COLUMN united_states_durable_financial_power_of_attorney.agent_is_adult IS
    'Whether the agent is an adult individual (18 or older) or a qualifying institution (yes/no).';
COMMENT ON COLUMN united_states_durable_financial_power_of_attorney.agent_signed_acknowledgment IS
    'Whether the agent has signed the acknowledgment of duties required by some states (yes/no).';
COMMENT ON COLUMN united_states_durable_financial_power_of_attorney.successor_agent_name IS
    'Full name of the successor agent, if any.';
COMMENT ON COLUMN united_states_durable_financial_power_of_attorney.co_agents_mode IS
    'How multiple agents act: sole, jointly, or independently.';
COMMENT ON COLUMN united_states_durable_financial_power_of_attorney.compensation IS
    'Agent compensation: none, reasonable, or fixed.';
COMMENT ON COLUMN united_states_durable_financial_power_of_attorney.compensation_amount IS
    'Fixed annual compensation in US dollars, when compensation is fixed.';
COMMENT ON COLUMN united_states_durable_financial_power_of_attorney.grant_banking IS
    'General authority granted over banking and financial institutions (yes/no).';
COMMENT ON COLUMN united_states_durable_financial_power_of_attorney.grant_real_estate IS
    'General authority granted over real estate (yes/no).';
COMMENT ON COLUMN united_states_durable_financial_power_of_attorney.grant_investments IS
    'General authority granted over stocks, bonds, and investments (yes/no).';
COMMENT ON COLUMN united_states_durable_financial_power_of_attorney.grant_business IS
    'General authority granted over business operations (yes/no).';
COMMENT ON COLUMN united_states_durable_financial_power_of_attorney.grant_insurance IS
    'General authority granted over insurance and annuities (yes/no).';
COMMENT ON COLUMN united_states_durable_financial_power_of_attorney.grant_tax_matters IS
    'General authority granted over tax matters (yes/no).';
COMMENT ON COLUMN united_states_durable_financial_power_of_attorney.grant_benefits IS
    'General authority granted over government and public benefits (yes/no).';
COMMENT ON COLUMN united_states_durable_financial_power_of_attorney.grant_retirement IS
    'General authority granted over retirement plans (yes/no).';
COMMENT ON COLUMN united_states_durable_financial_power_of_attorney.grant_claims IS
    'General authority granted over claims and litigation (yes/no).';
COMMENT ON COLUMN united_states_durable_financial_power_of_attorney.grant_personal_property IS
    'General authority granted over personal property (yes/no).';
COMMENT ON COLUMN united_states_durable_financial_power_of_attorney.hot_create_trust IS
    'Express grant of the hot power to create, amend, revoke, or terminate a trust (yes/no).';
COMMENT ON COLUMN united_states_durable_financial_power_of_attorney.hot_gift IS
    'Express grant of the hot power to make gifts (yes/no).';
COMMENT ON COLUMN united_states_durable_financial_power_of_attorney.hot_survivorship IS
    'Express grant of the hot power to create or change rights of survivorship (yes/no).';
COMMENT ON COLUMN united_states_durable_financial_power_of_attorney.hot_beneficiary IS
    'Express grant of the hot power to create or change a beneficiary designation (yes/no).';
COMMENT ON COLUMN united_states_durable_financial_power_of_attorney.hot_delegate IS
    'Express grant of the hot power to delegate the agent authority (yes/no).';
COMMENT ON COLUMN united_states_durable_financial_power_of_attorney.hot_annuity_waiver IS
    'Express grant of the hot power to waive the principal right to a joint and survivor annuity benefit (yes/no).';
COMMENT ON COLUMN united_states_durable_financial_power_of_attorney.hot_disclaim IS
    'Express grant of the hot power to disclaim property (yes/no).';
COMMENT ON COLUMN united_states_durable_financial_power_of_attorney.hot_powers_initialed IS
    'Whether the principal initials beside each hot power, required in Florida (yes/no).';
COMMENT ON COLUMN united_states_durable_financial_power_of_attorney.gift_limit_type IS
    'Gift limit: annual-exclusion, fixed-amount, unlimited, or none.';
COMMENT ON COLUMN united_states_durable_financial_power_of_attorney.gift_limit_amount IS
    'Fixed per-year gift limit in US dollars, when the limit is a fixed amount.';
COMMENT ON COLUMN united_states_durable_financial_power_of_attorney.self_gifting_allowed IS
    'Whether the agent may make gifts to the agent (yes/no).';
COMMENT ON COLUMN united_states_durable_financial_power_of_attorney.notary_arranged IS
    'Whether a notary acknowledgment is arranged for the principal signature (yes/no).';
COMMENT ON COLUMN united_states_durable_financial_power_of_attorney.witness_count IS
    'Number of witnesses arranged, not counting the notary.';
COMMENT ON COLUMN united_states_durable_financial_power_of_attorney.witness_is_agent IS
    'Whether any witness is an agent or successor agent (yes/no).';
COMMENT ON COLUMN united_states_durable_financial_power_of_attorney.used_for_real_estate IS
    'Whether the instrument will be recorded for a real-estate transaction (yes/no).';
COMMENT ON COLUMN united_states_durable_financial_power_of_attorney.bank_form_completed IS
    'Whether the financial institution own POA form is completed: yes, no, or not-needed.';
COMMENT ON COLUMN united_states_durable_financial_power_of_attorney.form2848_status IS
    'Status of IRS Form 2848 for tax representation: filed, not-filed, or not-needed.';
