<script lang="ts">
  import { store } from '#lib/stores/assessment.svelte.js';
  import TextField from '#lib/components/ui/TextField.svelte';
  import SelectField from '#lib/components/ui/SelectField.svelte';
  import YesNoField from '#lib/components/ui/YesNoField.svelte';
</script>

<section>
  <h2 class="text-xl font-semibold mb-4">Step 9 — Recent events and surgery</h2>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <TextField label="Last surgery date" type="date" bind:value={store.data.recentEvents.lastSurgeryDate} />
    <TextField label="Surgical site" bind:value={store.data.recentEvents.lastSurgerySite} />
    <SelectField
      label="Cabin gas / pressure risk"
      bind:value={store.data.recentEvents.cabinGasRisk}
      options={[
        { value: 'none', label: 'None' },
        { value: 'intra-ocular-gas', label: 'Intra-ocular gas' },
        { value: 'intra-cranial-gas', label: 'Intra-cranial gas' },
        { value: 'intra-abdominal-gas', label: 'Intra-abdominal gas' },
        { value: 'plaster-cast', label: 'Plaster cast' },
        { value: 'pneumothorax', label: 'Pneumothorax' },
        { value: 'other', label: 'Other' },
      ]}
    />
    <YesNoField label="Recent fracture with cast in situ?" bind:value={store.data.recentEvents.recentFractureCast} />
    <TextField label="Most recent DVT date" type="date" bind:value={store.data.recentEvents.recentDvtDate} />
    <YesNoField label="Scuba diving within 24 h of departure?" bind:value={store.data.recentEvents.scubaDivingWithin24h} />
    <TextField label="Most recent stroke date" type="date" bind:value={store.data.recentEvents.recentStrokeDate} />
  </div>
</section>
