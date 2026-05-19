<script lang="ts">
  import Field from '$lib/components/ui/Field.svelte';
  import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
  import { store } from '$lib/store.svelte.js';
  import type { PeriodDurationUnit, PeriodType } from '$lib/types.js';

  const typeOptions: { value: PeriodType; label: string }[] = [
    { value: 'duration', label: 'Duration (value + unit)' },
    { value: 'from_to', label: 'From / to dates' },
  ];

  const unitOptions: { value: PeriodDurationUnit; label: string }[] = [
    { value: 'days', label: 'days' },
    { value: 'weeks', label: 'weeks' },
    { value: 'months', label: 'months' },
  ];

  const isDuration = $derived(store.data.periodType === 'duration');
  const isFromTo = $derived(store.data.periodType === 'from_to');
</script>

<section aria-labelledby="step8-heading">
  <h2 id="step8-heading" class="text-xl font-semibold mb-4">Step 8 — Period</h2>
  <Field id="period-type" label="Period type">
    <RadioGroup
      id="period-type"
      name="periodType"
      options={typeOptions}
      bind:value={store.data.periodType}
    />
  </Field>

  {#if isDuration}
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
      <Field id="period-duration-value" label="Duration value">
        <input
          id="period-duration-value"
          type="number"
          min="0"
          class="w-full border rounded px-2 py-1"
          bind:value={store.data.periodDurationValue}
        />
      </Field>
      <Field id="period-duration-unit" label="Duration unit">
        <RadioGroup
          id="period-duration-unit"
          name="periodDurationUnit"
          options={unitOptions}
          bind:value={store.data.periodDurationUnit}
        />
      </Field>
    </div>
  {/if}

  {#if isFromTo}
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
      <Field id="period-from" label="From">
        <input
          id="period-from"
          type="date"
          class="w-full border rounded px-2 py-1"
          bind:value={store.data.periodFrom}
        />
      </Field>
      <Field id="period-to" label="To">
        <input
          id="period-to"
          type="date"
          class="w-full border rounded px-2 py-1"
          bind:value={store.data.periodTo}
        />
      </Field>
    </div>
  {/if}
</section>
