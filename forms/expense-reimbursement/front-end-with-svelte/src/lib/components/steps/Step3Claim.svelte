<script lang="ts">
  import Field from '#lib/components/ui/Field.svelte';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Select from '#lib/components/ui/Select.svelte';
  import {
    DateInput,
    NumberInput,
    TextAreaInput,
    TextInput
  } from '@lilydesignsystem/svelte-headless';
  import { claimStore } from '#lib/stores/result.svelte.js';
</script>

<Fieldset legend="3. Claim">
  <p class="hint">What the expenses were for.</p>

  <Field label="Claim date" inputId="claimDate" required>
    <DateInput
      id="claimDate"
      label="Claim date"
      bind:value={claimStore.data.claim.claimDate}
      required
    />
  </Field>

  <Field label="Claim title" inputId="claimTitle" required>
    <TextInput
      id="claimTitle"
      label="Claim title"
      placeholder="e.g. Resuscitation course travel"
      bind:value={claimStore.data.claim.title}
      required
    />
  </Field>

  <Field label="Period start" inputId="claimPeriodStart">
    <DateInput
      id="claimPeriodStart"
      label="Period start"
      bind:value={claimStore.data.claim.periodStart}
    />
  </Field>

  <Field label="Period end" inputId="claimPeriodEnd">
    <DateInput
      id="claimPeriodEnd"
      label="Period end"
      bind:value={claimStore.data.claim.periodEnd}
    />
  </Field>

  <Field label="Business purpose" inputId="claimBusinessPurpose" required>
    <TextAreaInput
      id="claimBusinessPurpose"
      label="Business purpose"
      placeholder="Why were these expenses needed for your work?"
      bind:value={claimStore.data.claim.businessPurpose}
      required
    />
  </Field>

  <Field label="Project or cost code" inputId="claimProjectOrCostCode">
    <TextInput
      id="claimProjectOrCostCode"
      label="Project or cost code"
      bind:value={claimStore.data.claim.projectOrCostCode}
    />
  </Field>

  <Field label="Claim currency" inputId="claimCurrency">
    <Select id="claimCurrency" label="Claim currency" bind:value={claimStore.data.claim.currency}>
      {#each ['GBP', 'EUR', 'USD', 'CHF', 'AUD', 'CAD'] as c (c)}
        <option value={c}>{c}</option>
      {/each}
    </Select>
  </Field>

  <Field label="Advance already received" inputId="claimAdvance">
    <NumberInput
      id="claimAdvance"
      label="Advance already received"
      min={0}
      step={0.01}
      bind:value={
        () => claimStore.data.claim.advanceReceivedAmount ?? undefined,
        (v) => (claimStore.data.claim.advanceReceivedAmount = v ?? null)
      }
    />
  </Field>
</Fieldset>
