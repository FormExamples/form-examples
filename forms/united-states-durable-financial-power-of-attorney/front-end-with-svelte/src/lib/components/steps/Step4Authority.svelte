<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import Select from '#lib/components/ui/Select.svelte';
  import NumberInput from '#lib/components/ui/NumberInput.svelte';

  const au = assessment.data.authority;
</script>

<Fieldset legend="Step 4 of 6 — Authority granted">
  <p class="hint">
    General powers, and the hot powers that need an express grant because they can reduce the
    principal’s estate (Uniform Power of Attorney Act section 201). Florida requires the principal
    to initial each.
  </p>

  <Field
    label="General authority: Banking and financial institutions"
    inputId="authority-grantBanking"
  >
    <Select
      id="authority-grantBanking"
      label="General authority: Banking and financial institutions"
      bind:value={au.grantBanking}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>
  <Field label="General authority: Real estate" inputId="authority-grantRealEstate">
    <Select
      id="authority-grantRealEstate"
      label="General authority: Real estate"
      bind:value={au.grantRealEstate}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>
  <Field
    label="General authority: Stocks, bonds, and investments"
    inputId="authority-grantInvestments"
  >
    <Select
      id="authority-grantInvestments"
      label="General authority: Stocks, bonds, and investments"
      bind:value={au.grantInvestments}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>
  <Field label="General authority: Business operations" inputId="authority-grantBusiness">
    <Select
      id="authority-grantBusiness"
      label="General authority: Business operations"
      bind:value={au.grantBusiness}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>
  <Field label="General authority: Insurance and annuities" inputId="authority-grantInsurance">
    <Select
      id="authority-grantInsurance"
      label="General authority: Insurance and annuities"
      bind:value={au.grantInsurance}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>
  <Field label="General authority: Tax matters" inputId="authority-grantTaxMatters">
    <Select
      id="authority-grantTaxMatters"
      label="General authority: Tax matters"
      bind:value={au.grantTaxMatters}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>
  <Field
    label="General authority: Government and public benefits"
    inputId="authority-grantBenefits"
  >
    <Select
      id="authority-grantBenefits"
      label="General authority: Government and public benefits"
      bind:value={au.grantBenefits}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>
  <Field label="General authority: Retirement plans" inputId="authority-grantRetirement">
    <Select
      id="authority-grantRetirement"
      label="General authority: Retirement plans"
      bind:value={au.grantRetirement}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>
  <Field label="General authority: Claims and litigation" inputId="authority-grantClaims">
    <Select
      id="authority-grantClaims"
      label="General authority: Claims and litigation"
      bind:value={au.grantClaims}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>
  <Field label="General authority: Personal property" inputId="authority-grantPersonalProperty">
    <Select
      id="authority-grantPersonalProperty"
      label="General authority: Personal property"
      bind:value={au.grantPersonalProperty}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>
  <Field
    label="Hot power: Create, amend, revoke, or terminate a trust"
    inputId="authority-hotCreateTrust"
  >
    <Select
      id="authority-hotCreateTrust"
      label="Hot power: Create, amend, revoke, or terminate a trust"
      bind:value={au.hotCreateTrust}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>
  <Field label="Hot power: Make gifts" inputId="authority-hotGift">
    <Select id="authority-hotGift" label="Hot power: Make gifts" bind:value={au.hotGift}>
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>
  <Field
    label="Hot power: Create or change rights of survivorship"
    inputId="authority-hotSurvivorship"
  >
    <Select
      id="authority-hotSurvivorship"
      label="Hot power: Create or change rights of survivorship"
      bind:value={au.hotSurvivorship}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>
  <Field
    label="Hot power: Create or change a beneficiary designation"
    inputId="authority-hotBeneficiary"
  >
    <Select
      id="authority-hotBeneficiary"
      label="Hot power: Create or change a beneficiary designation"
      bind:value={au.hotBeneficiary}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>
  <Field label="Hot power: Delegate the agent’s authority" inputId="authority-hotDelegate">
    <Select
      id="authority-hotDelegate"
      label="Hot power: Delegate the agent’s authority"
      bind:value={au.hotDelegate}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>
  <Field
    label="Hot power: Waive the principal’s joint and survivor annuity right"
    inputId="authority-hotAnnuityWaiver"
  >
    <Select
      id="authority-hotAnnuityWaiver"
      label="Hot power: Waive the principal’s joint and survivor annuity right"
      bind:value={au.hotAnnuityWaiver}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>
  <Field label="Hot power: Disclaim property" inputId="authority-hotDisclaim">
    <Select
      id="authority-hotDisclaim"
      label="Hot power: Disclaim property"
      bind:value={au.hotDisclaim}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>
  <Field label="Principal initials beside each hot power?" inputId="authority-hotPowersInitialed">
    <Select
      id="authority-hotPowersInitialed"
      label="Principal initials beside each hot power?"
      bind:value={au.hotPowersInitialed}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>
  <Field label="Gift limit" inputId="authority-giftLimitType">
    <Select id="authority-giftLimitType" label="Gift limit" bind:value={au.giftLimitType}>
      <option value="">— Select —</option>
      <option value="annual-exclusion">Federal annual exclusion per recipient</option>
      <option value="fixed-amount">Fixed amount per year</option>
      <option value="unlimited">Unlimited</option>
      <option value="none">No limit stated</option>
    </Select>
  </Field>
  <Field label="Fixed gift limit per year (USD)" inputId="authority-giftLimitAmount">
    <NumberInput
      id="authority-giftLimitAmount"
      label="Fixed gift limit per year (USD)"
      min={0}
      bind:value={au.giftLimitAmount}
    />
  </Field>
  <Field
    label="May the agent make gifts to the agent (self-gifting)?"
    inputId="authority-selfGiftingAllowed"
  >
    <Select
      id="authority-selfGiftingAllowed"
      label="May the agent make gifts to the agent (self-gifting)?"
      bind:value={au.selfGiftingAllowed}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>
</Fieldset>
