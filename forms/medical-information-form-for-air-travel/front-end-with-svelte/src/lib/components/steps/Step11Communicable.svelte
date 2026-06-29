<script lang="ts">
  import { store } from '$lib/stores/assessment.svelte.js';
  import TextField from '$lib/components/ui/TextField.svelte';
  import SelectField from '$lib/components/ui/SelectField.svelte';
  import YesNoField from '$lib/components/ui/YesNoField.svelte';
</script>

<section>
  <h2 class="text-xl font-semibold mb-4">Step 11 — Communicable disease screening</h2>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <SelectField
      label="Communicable-disease status"
      bind:value={store.data.communicable.communicableDiseaseStatus}
      options={[
        { value: 'none', label: 'None' },
        { value: 'infectious', label: 'Infectious' },
        { value: 'convalescent', label: 'Convalescent' },
        { value: 'cleared', label: 'Cleared' },
      ]}
    />
    <TextField label="Last symptom date" type="date" bind:value={store.data.communicable.lastSymptomDate} />
    <YesNoField label="Isolation required?" bind:value={store.data.communicable.isolationRequired} />
    <TextField label="Vaccination status" bind:value={store.data.communicable.vaccinationStatus} />
    <TextField label="Current antimicrobials" bind:value={store.data.communicable.currentAntimicrobials} />
  </div>
</section>
