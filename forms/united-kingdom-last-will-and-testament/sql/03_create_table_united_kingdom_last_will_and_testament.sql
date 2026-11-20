-- Main United Kingdom Last Will and Testament record (England and Wales): one
-- will drafting record covering the testator, the estate, executors,
-- beneficiaries and shares, guardians and funeral wishes, and the execution
-- formalities (Wills Act 1837 s.9: in writing, signed by the testator in the
-- presence of two witnesses who also sign). The completeness and
-- validity-classification result, the audit trail of fired rules, and the
-- flagged issues live in dedicated child tables. This is documentation
-- support, not legal advice.

CREATE TABLE united_kingdom_last_will_and_testament.united_kingdom_last_will_and_testament (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,

    testator_id UUID NOT NULL REFERENCES united_kingdom_last_will_and_testament.testator(id) ON DELETE RESTRICT,

    -- Testator
    testator_name TEXT NOT NULL DEFAULT '',
    date_of_birth DATE,
    testator_address TEXT NOT NULL DEFAULT '',
    domicile VARCHAR(16) NOT NULL DEFAULT '' CHECK (domicile IN ('england-wales', 'scotland', 'northern-ireland', 'other', '')),
    marital_status VARCHAR(21) NOT NULL DEFAULT '' CHECK (marital_status IN ('single', 'married', 'civil-partnership', 'cohabiting', 'divorced-or-dissolved', 'widowed', '')),
    marriage_expected VARCHAR(5) NOT NULL DEFAULT '' CHECK (marriage_expected IN ('yes', 'no', '')),
    contemplation_of_marriage_clause VARCHAR(5) NOT NULL DEFAULT '' CHECK (contemplation_of_marriage_clause IN ('yes', 'no', '')),
    has_mental_capacity VARCHAR(5) NOT NULL DEFAULT '' CHECK (has_mental_capacity IN ('yes', 'no', '')),
    made_voluntarily VARCHAR(5) NOT NULL DEFAULT '' CHECK (made_voluntarily IN ('yes', 'no', '')),
    previous_will VARCHAR(10) NOT NULL DEFAULT '' CHECK (previous_will IN ('none', 'exists', 'unsure', '')),
    revocation_clause VARCHAR(5) NOT NULL DEFAULT '' CHECK (revocation_clause IN ('yes', 'no', '')),

    -- Estate
    estate_value_band VARCHAR(10) NOT NULL DEFAULT '' CHECK (estate_value_band IN ('under-325k', '325k-500k', '500k-2m', 'over-2m', '')),
    owns_home VARCHAR(5) NOT NULL DEFAULT '' CHECK (owns_home IN ('yes', 'no', '')),
    home_to_direct_descendants VARCHAR(5) NOT NULL DEFAULT '' CHECK (home_to_direct_descendants IN ('yes', 'no', '')),
    charity_gift_percent NUMERIC(5,2),
    estate_other_jurisdictions VARCHAR(5) NOT NULL DEFAULT '' CHECK (estate_other_jurisdictions IN ('yes', 'no', '')),
    other_jurisdictions_detail TEXT NOT NULL DEFAULT '',
    specific_gifts_notes TEXT NOT NULL DEFAULT '',

    -- Executors
    executor_first_name TEXT NOT NULL DEFAULT '',
    executor_first_relationship TEXT NOT NULL DEFAULT '',
    executor_second_name TEXT NOT NULL DEFAULT '',
    executor_second_relationship TEXT NOT NULL DEFAULT '',
    executors_adult_confirmed VARCHAR(5) NOT NULL DEFAULT '' CHECK (executors_adult_confirmed IN ('yes', 'no', '')),

    -- Beneficiaries
    beneficiary_first_name TEXT NOT NULL DEFAULT '',
    beneficiary_first_relationship VARCHAR(23) NOT NULL DEFAULT '' CHECK (beneficiary_first_relationship IN ('spouse-or-civil-partner', 'unmarried-partner', 'child', 'grandchild', 'other-relative', 'friend', 'charity', 'other', '')),
    beneficiary_first_share_percent NUMERIC(5,2),
    beneficiary_first_is_minor VARCHAR(5) NOT NULL DEFAULT '' CHECK (beneficiary_first_is_minor IN ('yes', 'no', '')),
    beneficiary_first_has_trustee VARCHAR(5) NOT NULL DEFAULT '' CHECK (beneficiary_first_has_trustee IN ('yes', 'no', '')),
    beneficiary_second_name TEXT NOT NULL DEFAULT '',
    beneficiary_second_relationship VARCHAR(23) NOT NULL DEFAULT '' CHECK (beneficiary_second_relationship IN ('spouse-or-civil-partner', 'unmarried-partner', 'child', 'grandchild', 'other-relative', 'friend', 'charity', 'other', '')),
    beneficiary_second_share_percent NUMERIC(5,2),
    beneficiary_second_is_minor VARCHAR(5) NOT NULL DEFAULT '' CHECK (beneficiary_second_is_minor IN ('yes', 'no', '')),
    beneficiary_second_has_trustee VARCHAR(5) NOT NULL DEFAULT '' CHECK (beneficiary_second_has_trustee IN ('yes', 'no', '')),
    beneficiary_third_name TEXT NOT NULL DEFAULT '',
    beneficiary_third_relationship VARCHAR(23) NOT NULL DEFAULT '' CHECK (beneficiary_third_relationship IN ('spouse-or-civil-partner', 'unmarried-partner', 'child', 'grandchild', 'other-relative', 'friend', 'charity', 'other', '')),
    beneficiary_third_share_percent NUMERIC(5,2),
    beneficiary_third_is_minor VARCHAR(5) NOT NULL DEFAULT '' CHECK (beneficiary_third_is_minor IN ('yes', 'no', '')),
    beneficiary_third_has_trustee VARCHAR(5) NOT NULL DEFAULT '' CHECK (beneficiary_third_has_trustee IN ('yes', 'no', '')),
    beneficiary_fourth_name TEXT NOT NULL DEFAULT '',
    beneficiary_fourth_relationship VARCHAR(23) NOT NULL DEFAULT '' CHECK (beneficiary_fourth_relationship IN ('spouse-or-civil-partner', 'unmarried-partner', 'child', 'grandchild', 'other-relative', 'friend', 'charity', 'other', '')),
    beneficiary_fourth_share_percent NUMERIC(5,2),
    beneficiary_fourth_is_minor VARCHAR(5) NOT NULL DEFAULT '' CHECK (beneficiary_fourth_is_minor IN ('yes', 'no', '')),
    beneficiary_fourth_has_trustee VARCHAR(5) NOT NULL DEFAULT '' CHECK (beneficiary_fourth_has_trustee IN ('yes', 'no', '')),
    residuary_clause VARCHAR(5) NOT NULL DEFAULT '' CHECK (residuary_clause IN ('yes', 'no', '')),
    dependants_considered VARCHAR(5) NOT NULL DEFAULT '' CHECK (dependants_considered IN ('yes', 'no', '')),

    -- Family, guardians and funeral wishes
    has_children_under_18 VARCHAR(5) NOT NULL DEFAULT '' CHECK (has_children_under_18 IN ('yes', 'no', '')),
    guardian_name TEXT NOT NULL DEFAULT '',
    funeral_wishes VARCHAR(13) NOT NULL DEFAULT '' CHECK (funeral_wishes IN ('burial', 'cremation', 'no-preference', 'other', '')),
    funeral_wishes_note TEXT NOT NULL DEFAULT '',

    -- Execution and witnessing
    execution_status VARCHAR(10) NOT NULL DEFAULT '' CHECK (execution_status IN ('draft', 'signed', '')),
    date_of_will DATE,
    will_in_writing VARCHAR(5) NOT NULL DEFAULT '' CHECK (will_in_writing IN ('yes', 'no', '')),
    testator_signed VARCHAR(5) NOT NULL DEFAULT '' CHECK (testator_signed IN ('yes', 'no', '')),
    witnesses_present_together VARCHAR(5) NOT NULL DEFAULT '' CHECK (witnesses_present_together IN ('yes', 'no', '')),
    witnesses_signed VARCHAR(5) NOT NULL DEFAULT '' CHECK (witnesses_signed IN ('yes', 'no', '')),
    witness_first_name TEXT NOT NULL DEFAULT '',
    witness_first_over_18 VARCHAR(5) NOT NULL DEFAULT '' CHECK (witness_first_over_18 IN ('yes', 'no', '')),
    witness_first_is_beneficiary_or_spouse VARCHAR(5) NOT NULL DEFAULT '' CHECK (witness_first_is_beneficiary_or_spouse IN ('yes', 'no', '')),
    witness_second_name TEXT NOT NULL DEFAULT '',
    witness_second_over_18 VARCHAR(5) NOT NULL DEFAULT '' CHECK (witness_second_over_18 IN ('yes', 'no', '')),
    witness_second_is_beneficiary_or_spouse VARCHAR(5) NOT NULL DEFAULT '' CHECK (witness_second_is_beneficiary_or_spouse IN ('yes', 'no', '')),

    -- Notes
    drafter_note TEXT NOT NULL DEFAULT ''
);

CREATE INDEX united_kingdom_last_will_and_testament_testator_id_idx
    ON united_kingdom_last_will_and_testament.united_kingdom_last_will_and_testament (testator_id);

CREATE TRIGGER trigger_united_kingdom_last_will_and_testament_updated_at
    BEFORE UPDATE ON united_kingdom_last_will_and_testament.united_kingdom_last_will_and_testament
    FOR EACH ROW
    EXECUTE FUNCTION united_kingdom_last_will_and_testament.set_updated_at();

COMMENT ON TABLE united_kingdom_last_will_and_testament.united_kingdom_last_will_and_testament IS
    'Main United Kingdom Last Will and Testament record (England and Wales): testator, estate, executors, beneficiaries and shares, guardians, funeral wishes, and execution formalities. Validity classification, fired rules, and flags live in child tables. Documentation support, not legal advice.';
COMMENT ON COLUMN united_kingdom_last_will_and_testament.united_kingdom_last_will_and_testament.id IS
    'Primary key UUID, auto-generated.';
COMMENT ON COLUMN united_kingdom_last_will_and_testament.united_kingdom_last_will_and_testament.created_at IS
    'Timestamp when the record was created.';
COMMENT ON COLUMN united_kingdom_last_will_and_testament.united_kingdom_last_will_and_testament.updated_at IS
    'Timestamp when the record was updated most-recently.';
COMMENT ON COLUMN united_kingdom_last_will_and_testament.united_kingdom_last_will_and_testament.deleted_at IS
    'Timestamp when the record was deleted a.k.a. soft-removed.';
COMMENT ON COLUMN united_kingdom_last_will_and_testament.united_kingdom_last_will_and_testament.testator_id IS
    'Foreign key to the testator this will documents (restrict delete).';
COMMENT ON COLUMN united_kingdom_last_will_and_testament.united_kingdom_last_will_and_testament.testator_name IS
    'Full legal name of the testator as it will appear in the will.';
COMMENT ON COLUMN united_kingdom_last_will_and_testament.united_kingdom_last_will_and_testament.date_of_birth IS
    'Testator date of birth; a testator must be 18 or over (Wills Act 1837 s.7).';
COMMENT ON COLUMN united_kingdom_last_will_and_testament.united_kingdom_last_will_and_testament.testator_address IS
    'Testator postal address as a single text block.';
COMMENT ON COLUMN united_kingdom_last_will_and_testament.united_kingdom_last_will_and_testament.domicile IS
    'Testator domicile for choice of law: england-wales, scotland, northern-ireland, or other.';
COMMENT ON COLUMN united_kingdom_last_will_and_testament.united_kingdom_last_will_and_testament.marital_status IS
    'Marital status: single, married, civil-partnership, cohabiting, divorced-or-dissolved, or widowed.';
COMMENT ON COLUMN united_kingdom_last_will_and_testament.united_kingdom_last_will_and_testament.marriage_expected IS
    'Whether the testator expects to marry or form a civil partnership soon (marriage revokes a will, Wills Act 1837 s.18).';
COMMENT ON COLUMN united_kingdom_last_will_and_testament.united_kingdom_last_will_and_testament.contemplation_of_marriage_clause IS
    'Whether the will states it is made in contemplation of that marriage or civil partnership, which stops the marriage revoking it (s.18).';
COMMENT ON COLUMN united_kingdom_last_will_and_testament.united_kingdom_last_will_and_testament.has_mental_capacity IS
    'Whether the testator has testamentary capacity (understands making a will, the extent of the estate, and who might claim on it).';
COMMENT ON COLUMN united_kingdom_last_will_and_testament.united_kingdom_last_will_and_testament.made_voluntarily IS
    'Whether the testator makes the will freely, without undue influence or pressure.';
COMMENT ON COLUMN united_kingdom_last_will_and_testament.united_kingdom_last_will_and_testament.previous_will IS
    'Earlier will status: none, exists (an earlier will exists), or unsure.';
COMMENT ON COLUMN united_kingdom_last_will_and_testament.united_kingdom_last_will_and_testament.revocation_clause IS
    'Whether the will expressly revokes all earlier wills and codicils.';
COMMENT ON COLUMN united_kingdom_last_will_and_testament.united_kingdom_last_will_and_testament.estate_value_band IS
    'Approximate estate value band: under-325k, 325k-500k, 500k-2m, or over-2m (inheritance tax thresholds).';
COMMENT ON COLUMN united_kingdom_last_will_and_testament.united_kingdom_last_will_and_testament.owns_home IS
    'Whether the testator owns a home that forms part of the estate.';
COMMENT ON COLUMN united_kingdom_last_will_and_testament.united_kingdom_last_will_and_testament.home_to_direct_descendants IS
    'Whether the home is left to children or grandchildren (residence nil-rate band).';
COMMENT ON COLUMN united_kingdom_last_will_and_testament.united_kingdom_last_will_and_testament.charity_gift_percent IS
    'Percentage of the net estate left to charity (10% or more earns the reduced 36% inheritance tax rate).';
COMMENT ON COLUMN united_kingdom_last_will_and_testament.united_kingdom_last_will_and_testament.estate_other_jurisdictions IS
    'Whether the testator owns property outside England and Wales.';
COMMENT ON COLUMN united_kingdom_last_will_and_testament.united_kingdom_last_will_and_testament.other_jurisdictions_detail IS
    'Where and what property is held outside England and Wales.';
COMMENT ON COLUMN united_kingdom_last_will_and_testament.united_kingdom_last_will_and_testament.specific_gifts_notes IS
    'Free-text list of specific gifts (items, sums of money) left to named people.';
COMMENT ON COLUMN united_kingdom_last_will_and_testament.united_kingdom_last_will_and_testament.executor_first_name IS
    'Name of the first executor.';
COMMENT ON COLUMN united_kingdom_last_will_and_testament.united_kingdom_last_will_and_testament.executor_first_relationship IS
    'Relationship of the first executor to the testator.';
COMMENT ON COLUMN united_kingdom_last_will_and_testament.united_kingdom_last_will_and_testament.executor_second_name IS
    'Name of the second executor.';
COMMENT ON COLUMN united_kingdom_last_will_and_testament.united_kingdom_last_will_and_testament.executor_second_relationship IS
    'Relationship of the second executor to the testator.';
COMMENT ON COLUMN united_kingdom_last_will_and_testament.united_kingdom_last_will_and_testament.executors_adult_confirmed IS
    'Whether every named executor is confirmed as 18 or over and willing to act.';
COMMENT ON COLUMN united_kingdom_last_will_and_testament.united_kingdom_last_will_and_testament.beneficiary_first_name IS
    'Name of the first beneficiary.';
COMMENT ON COLUMN united_kingdom_last_will_and_testament.united_kingdom_last_will_and_testament.beneficiary_first_relationship IS
    'Relationship of the first beneficiary: spouse-or-civil-partner, unmarried-partner, child, grandchild, other-relative, friend, charity, or other.';
COMMENT ON COLUMN united_kingdom_last_will_and_testament.united_kingdom_last_will_and_testament.beneficiary_first_share_percent IS
    'Percentage share of the residuary estate left to the first beneficiary.';
COMMENT ON COLUMN united_kingdom_last_will_and_testament.united_kingdom_last_will_and_testament.beneficiary_first_is_minor IS
    'Whether the first beneficiary is under 18.';
COMMENT ON COLUMN united_kingdom_last_will_and_testament.united_kingdom_last_will_and_testament.beneficiary_first_has_trustee IS
    'Whether a trustee is appointed to hold the first beneficiary share until they are 18.';
COMMENT ON COLUMN united_kingdom_last_will_and_testament.united_kingdom_last_will_and_testament.beneficiary_second_name IS
    'Name of the second beneficiary.';
COMMENT ON COLUMN united_kingdom_last_will_and_testament.united_kingdom_last_will_and_testament.beneficiary_second_relationship IS
    'Relationship of the second beneficiary: spouse-or-civil-partner, unmarried-partner, child, grandchild, other-relative, friend, charity, or other.';
COMMENT ON COLUMN united_kingdom_last_will_and_testament.united_kingdom_last_will_and_testament.beneficiary_second_share_percent IS
    'Percentage share of the residuary estate left to the second beneficiary.';
COMMENT ON COLUMN united_kingdom_last_will_and_testament.united_kingdom_last_will_and_testament.beneficiary_second_is_minor IS
    'Whether the second beneficiary is under 18.';
COMMENT ON COLUMN united_kingdom_last_will_and_testament.united_kingdom_last_will_and_testament.beneficiary_second_has_trustee IS
    'Whether a trustee is appointed to hold the second beneficiary share until they are 18.';
COMMENT ON COLUMN united_kingdom_last_will_and_testament.united_kingdom_last_will_and_testament.beneficiary_third_name IS
    'Name of the third beneficiary.';
COMMENT ON COLUMN united_kingdom_last_will_and_testament.united_kingdom_last_will_and_testament.beneficiary_third_relationship IS
    'Relationship of the third beneficiary: spouse-or-civil-partner, unmarried-partner, child, grandchild, other-relative, friend, charity, or other.';
COMMENT ON COLUMN united_kingdom_last_will_and_testament.united_kingdom_last_will_and_testament.beneficiary_third_share_percent IS
    'Percentage share of the residuary estate left to the third beneficiary.';
COMMENT ON COLUMN united_kingdom_last_will_and_testament.united_kingdom_last_will_and_testament.beneficiary_third_is_minor IS
    'Whether the third beneficiary is under 18.';
COMMENT ON COLUMN united_kingdom_last_will_and_testament.united_kingdom_last_will_and_testament.beneficiary_third_has_trustee IS
    'Whether a trustee is appointed to hold the third beneficiary share until they are 18.';
COMMENT ON COLUMN united_kingdom_last_will_and_testament.united_kingdom_last_will_and_testament.beneficiary_fourth_name IS
    'Name of the fourth beneficiary.';
COMMENT ON COLUMN united_kingdom_last_will_and_testament.united_kingdom_last_will_and_testament.beneficiary_fourth_relationship IS
    'Relationship of the fourth beneficiary: spouse-or-civil-partner, unmarried-partner, child, grandchild, other-relative, friend, charity, or other.';
COMMENT ON COLUMN united_kingdom_last_will_and_testament.united_kingdom_last_will_and_testament.beneficiary_fourth_share_percent IS
    'Percentage share of the residuary estate left to the fourth beneficiary.';
COMMENT ON COLUMN united_kingdom_last_will_and_testament.united_kingdom_last_will_and_testament.beneficiary_fourth_is_minor IS
    'Whether the fourth beneficiary is under 18.';
COMMENT ON COLUMN united_kingdom_last_will_and_testament.united_kingdom_last_will_and_testament.beneficiary_fourth_has_trustee IS
    'Whether a trustee is appointed to hold the fourth beneficiary share until they are 18.';
COMMENT ON COLUMN united_kingdom_last_will_and_testament.united_kingdom_last_will_and_testament.residuary_clause IS
    'Whether the will disposes of the residuary estate (everything not otherwise given away).';
COMMENT ON COLUMN united_kingdom_last_will_and_testament.united_kingdom_last_will_and_testament.dependants_considered IS
    'Whether the testator has considered who could claim reasonable provision under the Inheritance (Provision for Family and Dependants) Act 1975.';
COMMENT ON COLUMN united_kingdom_last_will_and_testament.united_kingdom_last_will_and_testament.has_children_under_18 IS
    'Whether the testator has children under 18.';
COMMENT ON COLUMN united_kingdom_last_will_and_testament.united_kingdom_last_will_and_testament.guardian_name IS
    'Guardian appointed for children under 18.';
COMMENT ON COLUMN united_kingdom_last_will_and_testament.united_kingdom_last_will_and_testament.funeral_wishes IS
    'Funeral wishes: burial, cremation, no-preference, or other.';
COMMENT ON COLUMN united_kingdom_last_will_and_testament.united_kingdom_last_will_and_testament.funeral_wishes_note IS
    'Free-text funeral wishes (not legally binding on the executors).';
COMMENT ON COLUMN united_kingdom_last_will_and_testament.united_kingdom_last_will_and_testament.execution_status IS
    'Whether the will is still a draft or has been signed and witnessed.';
COMMENT ON COLUMN united_kingdom_last_will_and_testament.united_kingdom_last_will_and_testament.date_of_will IS
    'Date the will was signed and witnessed.';
COMMENT ON COLUMN united_kingdom_last_will_and_testament.united_kingdom_last_will_and_testament.will_in_writing IS
    'Whether the will is in writing (Wills Act 1837 s.9).';
COMMENT ON COLUMN united_kingdom_last_will_and_testament.united_kingdom_last_will_and_testament.testator_signed IS
    'Whether the testator signed (or acknowledged their signature) with the intention of giving effect to the will.';
COMMENT ON COLUMN united_kingdom_last_will_and_testament.united_kingdom_last_will_and_testament.witnesses_present_together IS
    'Whether two witnesses were present together when the testator signed or acknowledged.';
COMMENT ON COLUMN united_kingdom_last_will_and_testament.united_kingdom_last_will_and_testament.witnesses_signed IS
    'Whether each witness then signed or acknowledged their signature in the testator presence.';
COMMENT ON COLUMN united_kingdom_last_will_and_testament.united_kingdom_last_will_and_testament.witness_first_name IS
    'Name of the first witness.';
COMMENT ON COLUMN united_kingdom_last_will_and_testament.united_kingdom_last_will_and_testament.witness_first_over_18 IS
    'Whether the first witness is 18 or over.';
COMMENT ON COLUMN united_kingdom_last_will_and_testament.united_kingdom_last_will_and_testament.witness_first_is_beneficiary_or_spouse IS
    'Whether the first witness, or their spouse or civil partner, is a beneficiary (the gift fails, Wills Act 1837 s.15).';
COMMENT ON COLUMN united_kingdom_last_will_and_testament.united_kingdom_last_will_and_testament.witness_second_name IS
    'Name of the second witness.';
COMMENT ON COLUMN united_kingdom_last_will_and_testament.united_kingdom_last_will_and_testament.witness_second_over_18 IS
    'Whether the second witness is 18 or over.';
COMMENT ON COLUMN united_kingdom_last_will_and_testament.united_kingdom_last_will_and_testament.witness_second_is_beneficiary_or_spouse IS
    'Whether the second witness, or their spouse or civil partner, is a beneficiary (the gift fails, Wills Act 1837 s.15).';
COMMENT ON COLUMN united_kingdom_last_will_and_testament.united_kingdom_last_will_and_testament.drafter_note IS
    'Free-text note from the person preparing the will.';
