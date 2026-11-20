<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import NumberInput from '#lib/components/ui/NumberInput.svelte';

  const s = assessment.data.income;
</script>

<Fieldset legend="Step 4 of 8 — Household income">
  <p class="hint">
    Needed for the income-tested relief (senior, disability, circuit-breaker) where the state sets a
    limit.
  </p>

  <Field label="Total household income (whole US dollars)" inputId="income-householdIncomeDollars">
    <NumberInput
      id="income-householdIncomeDollars"
      label="Total household income (whole US dollars)"
      bind:value={s.householdIncomeDollars}
    />
  </Field>
  <p class="hint">All owners and resident spouses, for the income year below.</p>

  <Field label="Income year" inputId="income-incomeTaxYear">
    <NumberInput id="income-incomeTaxYear" label="Income year" bind:value={s.incomeTaxYear} />
  </Field>
</Fieldset>
