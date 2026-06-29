<script lang="ts">
  import { store } from '$lib/stores/assessment.svelte.js';
  import NumberField from '$lib/components/ui/NumberField.svelte';
  import YesNoField from '$lib/components/ui/YesNoField.svelte';
</script>

<section>
  <h2 class="text-xl font-semibold mb-4">Step 13 — Cabin medications and equipment</h2>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <label class="block md:col-span-2">
      <span class="text-sm text-base-content/80">Regular medications carried</span>
      <textarea rows="2" class="w-full border rounded px-2 py-1" bind:value={store.data.cabinMeds.regularMedications}></textarea>
    </label>
    <label class="block md:col-span-2">
      <span class="text-sm text-base-content/80">Controlled drugs (with documentation)</span>
      <textarea rows="2" class="w-full border rounded px-2 py-1" bind:value={store.data.cabinMeds.controlledDrugs}></textarea>
    </label>
    <YesNoField label="Dangerous-goods battery declaration?" bind:value={store.data.cabinMeds.dangerousGoodsBatteryDeclaration} />
    <YesNoField label="Sharps / syringes carried?" bind:value={store.data.cabinMeds.sharpsInCabin} />
    <YesNoField label="Refrigerated medication?" bind:value={store.data.cabinMeds.refrigeratedMedication} />
    <YesNoField label="Customs documentation available?" bind:value={store.data.cabinMeds.customsDocumentationAvailable} />
    <NumberField label="Haemoglobin" unit="g/L" min={20} max={250} bind:value={store.data.cabinMeds.haemoglobinGPerL} />
  </div>
</section>
