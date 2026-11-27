<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import Select from '#lib/components/ui/Select.svelte';
  import NumberInput from '#lib/components/ui/NumberInput.svelte';
  import { TextInput } from '@lilydesignsystem/svelte-headless';

  const d = assessment.data.history;

  const organOptions = [
    { value: 'kidney', label: 'Kidney only' },
    { value: 'kidney-pancreas', label: 'Kidney / pancreas' },
    { value: 'pancreas', label: 'Pancreas only' }
  ];
</script>

<Fieldset legend="Step 2 of 7 · Organ and sensitization history">
  <p class="hint">
    Organ required, and previous transplants, transfusions and pregnancies. Enter 0 for none; leave
    blank only if unknown.
  </p>

  <Field label="Organ required" required inputId="history-organRequired">
    <Select id="history-organRequired" label="Organ required" required bind:value={d.organRequired}>
      <option value="">— Select —</option>
      {#each organOptions as opt (opt.value)}
        <option value={opt.value}>{opt.label}</option>
      {/each}
    </Select>
  </Field>

  <div class="field-grid">
    <Field label="Previous transplants (number)" inputId="history-previousTransplantCount">
      <NumberInput
        id="history-previousTransplantCount"
        label="Previous transplants (number)"
        min={0}
        max={20}
        bind:value={d.previousTransplantCount}
      />
    </Field>
    <Field label="Transplant dates" inputId="history-previousTransplantDates">
      <TextInput
        id="history-previousTransplantDates"
        label="Transplant dates"
        bind:value={d.previousTransplantDates}
      />
    </Field>
  </div>

  <div class="field-grid">
    <Field label="Transfusions (number)" inputId="history-transfusionCount">
      <NumberInput
        id="history-transfusionCount"
        label="Transfusions (number)"
        min={0}
        max={500}
        bind:value={d.transfusionCount}
      />
    </Field>
    <Field label="Transfusion dates" inputId="history-transfusionDates">
      <TextInput
        id="history-transfusionDates"
        label="Transfusion dates"
        bind:value={d.transfusionDates}
      />
    </Field>
  </div>

  <div class="field-grid">
    <Field label="Pregnancies (number)" inputId="history-pregnancyCount">
      <NumberInput
        id="history-pregnancyCount"
        label="Pregnancies (number)"
        min={0}
        max={30}
        bind:value={d.pregnancyCount}
      />
    </Field>
    <Field label="Pregnancy dates" inputId="history-pregnancyDates">
      <TextInput
        id="history-pregnancyDates"
        label="Pregnancy dates"
        bind:value={d.pregnancyDates}
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
    .field-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
