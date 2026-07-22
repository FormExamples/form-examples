<script lang="ts">
  import { store } from '$lib/stores/metrics.svelte.js';
  import Fieldset from '$lib/components/ui/Fieldset.svelte';
  import Field from '$lib/components/ui/Field.svelte';
  import TextInput from '$lib/components/ui/TextInput.svelte';
  import NumberInput from '$lib/components/ui/NumberInput.svelte';
</script>

<Fieldset legend="Step 1 — Reporting period">
  <p class="hint">
    Record the hospital or site, the reporting period (month and year), and
    the name of the person compiling this report.
  </p>

  <div class="field-grid">
    <Field label="Hospital / site name" inputId="hospitalName">
      <TextInput
        id="hospitalName"
        label="Hospital / site name"
        bind:value={store.data.reportingPeriod.hospitalName}
      />
    </Field>
    <Field label="Prepared by" inputId="preparedByName">
      <TextInput
        id="preparedByName"
        label="Prepared by"
        bind:value={store.data.reportingPeriod.preparedByName}
      />
    </Field>
    <Field label="Period month" inputId="periodMonth" description="1-12">
      <NumberInput
        id="periodMonth"
        label="Period month"
        min={1}
        max={12}
        step={1}
        bind:value={store.data.reportingPeriod.periodMonth}
      />
    </Field>
    <Field label="Period year" inputId="periodYear">
      <NumberInput
        id="periodYear"
        label="Period year"
        min={2000}
        max={2100}
        step={1}
        bind:value={store.data.reportingPeriod.periodYear}
      />
    </Field>
  </div>
</Fieldset>

<style>
  .field-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1rem;
  }
  @media (max-width: 640px) {
    .field-grid { grid-template-columns: 1fr; }
  }
</style>
