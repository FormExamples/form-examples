<script lang="ts">
  import { store } from '#lib/stores/assessment.svelte.js';
  import { YES_NO_OPTIONS } from '#lib/engine/utils.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import NumberInput from '#lib/components/ui/NumberInput.svelte';
  import Select from '#lib/components/ui/Select.svelte';
  import { DateInput } from '@lilydesignsystem/svelte-headless';
</script>

<Fieldset legend="Step 6 of 8 — Period" id="step-6-legend">
  <p class="hint">
    The period the advice covers (rules R-04, R-08, R-09). Give an end date or a duration in days.
  </p>
  <div class="field-grid">
    <Field label="From" inputId="step-6-period-from">
      <DateInput
        id="step-6-period-from"
        label="From"
        bind:value={() => store.data.periodFrom ?? '', (v) => (store.data.periodFrom = v || null)}
      />
    </Field>
    <Field label="To" inputId="step-6-period-to">
      <DateInput
        id="step-6-period-to"
        label="To"
        bind:value={() => store.data.periodTo ?? '', (v) => (store.data.periodTo = v || null)}
      />
    </Field>
  </div>
  <Field label="Duration in days (when there is no end date)" inputId="step-6-duration-days">
    <NumberInput
      id="step-6-duration-days"
      label="Duration in days"
      min={1}
      bind:value={store.data.periodDurationDays}
    />
  </Field>
  <Field label="Reassessment needed" inputId="step-6-reassessment">
    <Select
      id="step-6-reassessment"
      label="Reassessment needed"
      bind:value={store.data.reassessmentRequired}
    >
      <option value="">— Select —</option>
      {#each YES_NO_OPTIONS as o (o.value)}
        <option value={o.value}>{o.label}</option>
      {/each}
    </Select>
  </Field>
</Fieldset>
