<script lang="ts">
  import { store } from '$lib/stores/assessment.svelte.js';
  import TextField from '$lib/components/ui/TextField.svelte';
  import NumberField from '$lib/components/ui/NumberField.svelte';
  import SelectField from '$lib/components/ui/SelectField.svelte';
  import YesNoField from '$lib/components/ui/YesNoField.svelte';
</script>

<section>
  <h2 class="text-xl font-semibold mb-4">Step 12 — In-flight medical requirements</h2>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <YesNoField label="Supplemental oxygen required?" bind:value={store.data.inflightNeeds.requiresSupplementalOxygen} />
    <NumberField label="Oxygen flow rate" unit="L/min" min={0} max={15} step={0.5} bind:value={store.data.inflightNeeds.oxygenFlowRateLpm} />
    <SelectField
      label="Oxygen duration"
      bind:value={store.data.inflightNeeds.oxygenDuration}
      options={[
        { value: 'continuous', label: 'Continuous' },
        { value: 'as-required', label: 'As required' },
        { value: 'on-exertion', label: 'On exertion' },
        { value: 'sleep-only', label: 'Sleep only' },
      ]}
    />
    <YesNoField label="Portable oxygen concentrator (POC)?" bind:value={store.data.inflightNeeds.requiresPoc} />
    <TextField label="POC make and model" bind:value={store.data.inflightNeeds.pocMakeModel} />
    <NumberField label="POC battery duration" unit="hours" min={0} max={48} step={0.5} bind:value={store.data.inflightNeeds.pocBatteryHours} />
    <YesNoField label="Stretcher required?" bind:value={store.data.inflightNeeds.requiresStretcher} />
    <YesNoField label="Infant incubator required?" bind:value={store.data.inflightNeeds.requiresIncubator} />
    <YesNoField label="IV pump required?" bind:value={store.data.inflightNeeds.requiresIvPump} />
    <YesNoField label="Medical escort accompanying?" bind:value={store.data.inflightNeeds.requiresMedicalEscort} />
    <YesNoField label="Extra seat required?" bind:value={store.data.inflightNeeds.requiresExtraSeat} />
    <YesNoField label="Accessible lavatory required?" bind:value={store.data.inflightNeeds.requiresAccessibleLavatory} />
    <SelectField
      label="Wheelchair type"
      bind:value={store.data.inflightNeeds.wheelchairType}
      options={[
        { value: 'none', label: 'None' },
        { value: 'WCHR', label: 'WCHR (ramp)' },
        { value: 'WCHS', label: 'WCHS (steps)' },
        { value: 'WCHC', label: 'WCHC (cabin)' },
      ]}
    />
    <YesNoField label="Non-medical carer accompanying?" bind:value={store.data.inflightNeeds.accompanyingCarer} />
  </div>
</section>
