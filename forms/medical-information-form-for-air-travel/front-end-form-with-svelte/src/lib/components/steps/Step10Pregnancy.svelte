<script lang="ts">
  import { store } from '$lib/stores/assessment.svelte.js';
  import TextField from '$lib/components/ui/TextField.svelte';
  import NumberField from '$lib/components/ui/NumberField.svelte';
  import SelectField from '$lib/components/ui/SelectField.svelte';
  import YesNoField from '$lib/components/ui/YesNoField.svelte';
</script>

<section>
  <h2 class="text-xl font-semibold mb-4">Step 10 — Pregnancy and obstetric history</h2>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <YesNoField label="Currently pregnant?" bind:value={store.data.pregnancy.isPregnant} />
    <NumberField label="Gestation weeks" min={0} max={45} bind:value={store.data.pregnancy.gestationWeeks} />
    <SelectField
      label="Pregnancy type"
      bind:value={store.data.pregnancy.pregnancyType}
      options={[
        { value: 'singleton', label: 'Singleton' },
        { value: 'twins', label: 'Twins' },
        { value: 'multiple', label: 'Multiple' },
      ]}
    />
    <label class="block md:col-span-2">
      <span class="text-sm text-slate-700">Pregnancy complications</span>
      <textarea rows="2" class="w-full border rounded px-2 py-1" bind:value={store.data.pregnancy.pregnancyComplications}></textarea>
    </label>
    <TextField label="Expected delivery date" type="date" bind:value={store.data.pregnancy.expectedDeliveryDate} />
    <TextField label="Obstetrician contact" bind:value={store.data.pregnancy.obstetricianContact} />
  </div>
</section>
