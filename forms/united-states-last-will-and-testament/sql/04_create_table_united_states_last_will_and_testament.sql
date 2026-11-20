-- Main United States Last Will and Testament record: one will plan for one testator.
-- It captures the testator and state, family and spouse, estate and bequests,
-- the personal representative and standard clauses, the execution plan and
-- witnesses, and the self-proving affidavit. The completeness and validity
-- classification, the audit trail of fired rules, and the flagged issues live in
-- dedicated child tables. This record documents a drafting plan; it is not
-- legal advice and does not itself make a will valid.

CREATE TABLE united_states_last_will_and_testament.united_states_last_will_and_testament (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    testator_id UUID NOT NULL REFERENCES united_states_last_will_and_testament.testator(id) ON DELETE RESTRICT,
    attorney_id UUID REFERENCES united_states_last_will_and_testament.attorney(id) ON DELETE RESTRICT,
    state VARCHAR(2) NOT NULL DEFAULT '',
    testator_name TEXT NOT NULL DEFAULT '',
    testator_date_of_birth DATE,
    sound_mind VARCHAR(9) NOT NULL DEFAULT '' CHECK (sound_mind IN ('yes', 'no', 'uncertain', '')),
    undue_influence_concern VARCHAR(8) NOT NULL DEFAULT '' CHECK (undue_influence_concern IN ('none', 'possible', '')),
    marital_status VARCHAR(8) NOT NULL DEFAULT '' CHECK (marital_status IN ('single', 'married', 'divorced', 'widowed', '')),
    spouse_name TEXT NOT NULL DEFAULT '',
    spouse_inheritance_value NUMERIC(14,2),
    spouse_waived_elective_share VARCHAR(3) NOT NULL DEFAULT '' CHECK (spouse_waived_elective_share IN ('yes', 'no', '')),
    has_minor_children VARCHAR(3) NOT NULL DEFAULT '' CHECK (has_minor_children IN ('yes', 'no', '')),
    guardian_for_minors_name TEXT NOT NULL DEFAULT '',
    disinherits_child VARCHAR(3) NOT NULL DEFAULT '' CHECK (disinherits_child IN ('yes', 'no', '')),
    disinherited_child_named VARCHAR(3) NOT NULL DEFAULT '' CHECK (disinherited_child_named IN ('yes', 'no', '')),
    estimated_estate_value NUMERIC(14,2),
    specific_bequests_total NUMERIC(14,2),
    specific_bequests_summary TEXT NOT NULL DEFAULT '',
    residuary_clause_present VARCHAR(3) NOT NULL DEFAULT '' CHECK (residuary_clause_present IN ('yes', 'no', '')),
    residuary_1_name TEXT NOT NULL DEFAULT '',
    residuary_1_percent NUMERIC(5,2),
    residuary_2_name TEXT NOT NULL DEFAULT '',
    residuary_2_percent NUMERIC(5,2),
    residuary_3_name TEXT NOT NULL DEFAULT '',
    residuary_3_percent NUMERIC(5,2),
    contingent_beneficiary_named VARCHAR(3) NOT NULL DEFAULT '' CHECK (contingent_beneficiary_named IN ('yes', 'no', '')),
    personal_representative_name TEXT NOT NULL DEFAULT '',
    successor_personal_representative_name TEXT NOT NULL DEFAULT '',
    bond_waived VARCHAR(3) NOT NULL DEFAULT '' CHECK (bond_waived IN ('yes', 'no', '')),
    revokes_prior_wills_clause VARCHAR(3) NOT NULL DEFAULT '' CHECK (revokes_prior_wills_clause IN ('yes', 'no', '')),
    no_contest_clause VARCHAR(3) NOT NULL DEFAULT '' CHECK (no_contest_clause IN ('yes', 'no', '')),
    digital_assets_clause VARCHAR(3) NOT NULL DEFAULT '' CHECK (digital_assets_clause IN ('yes', 'no', '')),
    estate_tax_reviewed VARCHAR(3) NOT NULL DEFAULT '' CHECK (estate_tax_reviewed IN ('yes', 'no', '')),
    original_will_location TEXT NOT NULL DEFAULT '',
    drafter_note TEXT NOT NULL DEFAULT '',
    execution_form VARCHAR(11) NOT NULL DEFAULT '' CHECK (execution_form IN ('witnessed', 'holographic', 'electronic', '')),
    execution_date DATE,
    signed_at_end VARCHAR(3) NOT NULL DEFAULT '' CHECK (signed_at_end IN ('yes', 'no', '')),
    signed_in_witness_presence VARCHAR(3) NOT NULL DEFAULT '' CHECK (signed_in_witness_presence IN ('yes', 'no', '')),
    witnesses_signed_in_testator_presence VARCHAR(3) NOT NULL DEFAULT '' CHECK (witnesses_signed_in_testator_presence IN ('yes', 'no', '')),
    holographic_entirely_handwritten VARCHAR(3) NOT NULL DEFAULT '' CHECK (holographic_entirely_handwritten IN ('yes', 'no', '')),
    witness_1_name TEXT NOT NULL DEFAULT '',
    witness_1_beneficiary VARCHAR(3) NOT NULL DEFAULT '' CHECK (witness_1_beneficiary IN ('yes', 'no', '')),
    witness_2_name TEXT NOT NULL DEFAULT '',
    witness_2_beneficiary VARCHAR(3) NOT NULL DEFAULT '' CHECK (witness_2_beneficiary IN ('yes', 'no', '')),
    witness_3_name TEXT NOT NULL DEFAULT '',
    witness_3_beneficiary VARCHAR(3) NOT NULL DEFAULT '' CHECK (witness_3_beneficiary IN ('yes', 'no', '')),
    self_proving_affidavit VARCHAR(3) NOT NULL DEFAULT '' CHECK (self_proving_affidavit IN ('yes', 'no', '')),
    notary_name TEXT NOT NULL DEFAULT '',
    notary_acknowledged VARCHAR(3) NOT NULL DEFAULT '' CHECK (notary_acknowledged IN ('yes', 'no', ''))
);

CREATE INDEX united_states_last_will_and_testament_testator_id_idx
    ON united_states_last_will_and_testament.united_states_last_will_and_testament (testator_id);
CREATE INDEX united_states_last_will_and_testament_attorney_id_idx
    ON united_states_last_will_and_testament.united_states_last_will_and_testament (attorney_id);

CREATE TRIGGER trigger_united_states_last_will_and_testament_updated_at
    BEFORE UPDATE ON united_states_last_will_and_testament.united_states_last_will_and_testament
    FOR EACH ROW
    EXECUTE FUNCTION united_states_last_will_and_testament.set_updated_at();

COMMENT ON TABLE united_states_last_will_and_testament.united_states_last_will_and_testament IS
    'Main United States Last Will and Testament record: testator and state, family and spouse, estate and bequests, personal representative and clauses, execution plan and witnesses, and the self-proving affidavit. Validity classification, fired rules, and flags live in child tables.';
COMMENT ON COLUMN united_states_last_will_and_testament.united_states_last_will_and_testament.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN united_states_last_will_and_testament.united_states_last_will_and_testament.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN united_states_last_will_and_testament.united_states_last_will_and_testament.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN united_states_last_will_and_testament.united_states_last_will_and_testament.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN united_states_last_will_and_testament.united_states_last_will_and_testament.testator_id IS
    'Foreign key to the testator (restrict delete).';
COMMENT ON COLUMN united_states_last_will_and_testament.united_states_last_will_and_testament.attorney_id IS
    'Foreign key to the drafting attorney (restrict delete); optional.';
COMMENT ON COLUMN united_states_last_will_and_testament.united_states_last_will_and_testament.state IS
    'Two-letter state code whose law governs the will; unknown states fall back to the Uniform Probate Code default.';
COMMENT ON COLUMN united_states_last_will_and_testament.united_states_last_will_and_testament.testator_name IS
    'Full legal name of the testator as written in the will.';
COMMENT ON COLUMN united_states_last_will_and_testament.united_states_last_will_and_testament.testator_date_of_birth IS
    'Date of birth of the testator; the testator must be 18 or older on the execution date.';
COMMENT ON COLUMN united_states_last_will_and_testament.united_states_last_will_and_testament.sound_mind IS
    'Testamentary capacity: whether the testator is of sound mind: yes, no, or uncertain.';
COMMENT ON COLUMN united_states_last_will_and_testament.united_states_last_will_and_testament.undue_influence_concern IS
    'Whether there is a concern of undue influence: none or possible.';
COMMENT ON COLUMN united_states_last_will_and_testament.united_states_last_will_and_testament.marital_status IS
    'Marital status of the testator: single, married, divorced, or widowed.';
COMMENT ON COLUMN united_states_last_will_and_testament.united_states_last_will_and_testament.spouse_name IS
    'Full name of the testator''s spouse, when married.';
COMMENT ON COLUMN united_states_last_will_and_testament.united_states_last_will_and_testament.spouse_inheritance_value IS
    'Value in US dollars left to the surviving spouse.';
COMMENT ON COLUMN united_states_last_will_and_testament.united_states_last_will_and_testament.spouse_waived_elective_share IS
    'Whether the spouse has waived the elective share in writing (yes/no).';
COMMENT ON COLUMN united_states_last_will_and_testament.united_states_last_will_and_testament.has_minor_children IS
    'Whether the testator has minor children (yes/no).';
COMMENT ON COLUMN united_states_last_will_and_testament.united_states_last_will_and_testament.guardian_for_minors_name IS
    'Nominated guardian for minor children.';
COMMENT ON COLUMN united_states_last_will_and_testament.united_states_last_will_and_testament.disinherits_child IS
    'Whether the will leaves a child out (yes/no).';
COMMENT ON COLUMN united_states_last_will_and_testament.united_states_last_will_and_testament.disinherited_child_named IS
    'Whether the omitted child is named in the will (yes/no).';
COMMENT ON COLUMN united_states_last_will_and_testament.united_states_last_will_and_testament.estimated_estate_value IS
    'Estimated gross estate value in US dollars.';
COMMENT ON COLUMN united_states_last_will_and_testament.united_states_last_will_and_testament.specific_bequests_total IS
    'Total value in US dollars of all specific bequests.';
COMMENT ON COLUMN united_states_last_will_and_testament.united_states_last_will_and_testament.specific_bequests_summary IS
    'Free-text summary of the specific bequests.';
COMMENT ON COLUMN united_states_last_will_and_testament.united_states_last_will_and_testament.residuary_clause_present IS
    'Whether the will has a residuary clause giving away everything not otherwise given (yes/no).';
COMMENT ON COLUMN united_states_last_will_and_testament.united_states_last_will_and_testament.residuary_1_name IS
    'Residuary beneficiary 1 name.';
COMMENT ON COLUMN united_states_last_will_and_testament.united_states_last_will_and_testament.residuary_1_percent IS
    'Residuary beneficiary 1 share, percent.';
COMMENT ON COLUMN united_states_last_will_and_testament.united_states_last_will_and_testament.residuary_2_name IS
    'Residuary beneficiary 2 name.';
COMMENT ON COLUMN united_states_last_will_and_testament.united_states_last_will_and_testament.residuary_2_percent IS
    'Residuary beneficiary 2 share, percent.';
COMMENT ON COLUMN united_states_last_will_and_testament.united_states_last_will_and_testament.residuary_3_name IS
    'Residuary beneficiary 3 name.';
COMMENT ON COLUMN united_states_last_will_and_testament.united_states_last_will_and_testament.residuary_3_percent IS
    'Residuary beneficiary 3 share, percent.';
COMMENT ON COLUMN united_states_last_will_and_testament.united_states_last_will_and_testament.contingent_beneficiary_named IS
    'Whether a contingent (backup) beneficiary is named (yes/no).';
COMMENT ON COLUMN united_states_last_will_and_testament.united_states_last_will_and_testament.personal_representative_name IS
    'Personal representative (executor) named in the will.';
COMMENT ON COLUMN united_states_last_will_and_testament.united_states_last_will_and_testament.successor_personal_representative_name IS
    'Successor personal representative named in the will.';
COMMENT ON COLUMN united_states_last_will_and_testament.united_states_last_will_and_testament.bond_waived IS
    'Whether the will waives the personal representative''s bond (yes/no).';
COMMENT ON COLUMN united_states_last_will_and_testament.united_states_last_will_and_testament.revokes_prior_wills_clause IS
    'Whether the will expressly revokes all earlier wills and codicils (yes/no).';
COMMENT ON COLUMN united_states_last_will_and_testament.united_states_last_will_and_testament.no_contest_clause IS
    'Whether the will has a no-contest (in terrorem) clause (yes/no).';
COMMENT ON COLUMN united_states_last_will_and_testament.united_states_last_will_and_testament.digital_assets_clause IS
    'Whether the will authorizes access to digital assets under RUFADAA (yes/no).';
COMMENT ON COLUMN united_states_last_will_and_testament.united_states_last_will_and_testament.estate_tax_reviewed IS
    'Whether a tax adviser has reviewed estate tax (yes/no).';
COMMENT ON COLUMN united_states_last_will_and_testament.united_states_last_will_and_testament.original_will_location IS
    'Where the signed original will is kept.';
COMMENT ON COLUMN united_states_last_will_and_testament.united_states_last_will_and_testament.drafter_note IS
    'Free-text note from the drafter.';
COMMENT ON COLUMN united_states_last_will_and_testament.united_states_last_will_and_testament.execution_form IS
    'Form of execution: witnessed, holographic, or electronic.';
COMMENT ON COLUMN united_states_last_will_and_testament.united_states_last_will_and_testament.execution_date IS
    'Date the will is or was signed.';
COMMENT ON COLUMN united_states_last_will_and_testament.united_states_last_will_and_testament.signed_at_end IS
    'Whether the testator signs at the end of the will (yes/no).';
COMMENT ON COLUMN united_states_last_will_and_testament.united_states_last_will_and_testament.signed_in_witness_presence IS
    'Whether the testator signs or acknowledges the signature in front of the witnesses (yes/no).';
COMMENT ON COLUMN united_states_last_will_and_testament.united_states_last_will_and_testament.witnesses_signed_in_testator_presence IS
    'Whether the witnesses sign in the testator''s presence (yes/no).';
COMMENT ON COLUMN united_states_last_will_and_testament.united_states_last_will_and_testament.holographic_entirely_handwritten IS
    'For a holographic will, whether the signature and material provisions are in the testator''s handwriting (yes/no).';
COMMENT ON COLUMN united_states_last_will_and_testament.united_states_last_will_and_testament.witness_1_name IS
    'Witness 1 name.';
COMMENT ON COLUMN united_states_last_will_and_testament.united_states_last_will_and_testament.witness_1_beneficiary IS
    'Whether witness 1 takes a gift under the will (yes/no).';
COMMENT ON COLUMN united_states_last_will_and_testament.united_states_last_will_and_testament.witness_2_name IS
    'Witness 2 name.';
COMMENT ON COLUMN united_states_last_will_and_testament.united_states_last_will_and_testament.witness_2_beneficiary IS
    'Whether witness 2 takes a gift under the will (yes/no).';
COMMENT ON COLUMN united_states_last_will_and_testament.united_states_last_will_and_testament.witness_3_name IS
    'Witness 3 name (optional extra witness).';
COMMENT ON COLUMN united_states_last_will_and_testament.united_states_last_will_and_testament.witness_3_beneficiary IS
    'Whether witness 3 takes a gift under the will (yes/no).';
COMMENT ON COLUMN united_states_last_will_and_testament.united_states_last_will_and_testament.self_proving_affidavit IS
    'Whether a self-proving affidavit will be signed (yes/no).';
COMMENT ON COLUMN united_states_last_will_and_testament.united_states_last_will_and_testament.notary_name IS
    'Name of the notary on the self-proving affidavit.';
COMMENT ON COLUMN united_states_last_will_and_testament.united_states_last_will_and_testament.notary_acknowledged IS
    'Whether the notary acknowledged the signatures (yes/no).';
