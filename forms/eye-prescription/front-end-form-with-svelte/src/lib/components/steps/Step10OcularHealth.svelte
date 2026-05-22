<script lang="ts">
  import { store } from '$lib/stores/prescription.svelte.js';
  import StepCard from '$lib/components/ui/StepCard.svelte';
  import FormField from '$lib/components/ui/FormField.svelte';
  const input = 'block w-full rounded border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500';
  const cbLabel = 'flex items-center gap-2 text-sm text-slate-700';
</script>

<StepCard step={10} title="Ocular health findings (optional)">
  <div class="grid grid-cols-1 md:grid-cols-2 gap-x-4">
    <FormField label="Slit-lamp right"><textarea class={input} rows="2" bind:value={store.data.ocularHealth.slitLampRight}></textarea></FormField>
    <FormField label="Slit-lamp left"><textarea class={input} rows="2" bind:value={store.data.ocularHealth.slitLampLeft}></textarea></FormField>
    <FormField label="Fundus right"><textarea class={input} rows="2" bind:value={store.data.ocularHealth.fundusRight}></textarea></FormField>
    <FormField label="Fundus left"><textarea class={input} rows="2" bind:value={store.data.ocularHealth.fundusLeft}></textarea></FormField>
    <FormField label="IOP right (mmHg)"><input class={input} type="number" step="0.1" min="0" max="80" bind:value={store.data.ocularHealth.intraocularPressureRightMmhg} /></FormField>
    <FormField label="IOP left (mmHg)"><input class={input} type="number" step="0.1" min="0" max="80" bind:value={store.data.ocularHealth.intraocularPressureLeftMmhg} /></FormField>
    <FormField label="Cup-to-disc ratio right"><input class={input} type="number" step="0.05" min="0" max="1" bind:value={store.data.ocularHealth.cupToDiscRatioRight} /></FormField>
    <FormField label="Cup-to-disc ratio left"><input class={input} type="number" step="0.05" min="0" max="1" bind:value={store.data.ocularHealth.cupToDiscRatioLeft} /></FormField>
  </div>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2 mb-4">
    <label class={cbLabel}><input type="checkbox" bind:checked={store.data.ocularHealth.octPerformed} /> OCT performed</label>
    <label class={cbLabel}><input type="checkbox" bind:checked={store.data.ocularHealth.fieldsPerformed} /> Visual fields performed</label>
    <label class={cbLabel}><input type="checkbox" bind:checked={store.data.ocularHealth.pathologyFlag} /> Pathology identified</label>
  </div>
  <FormField label="OCT findings"><textarea class={input} rows="2" bind:value={store.data.ocularHealth.octFindings}></textarea></FormField>
  <FormField label="Fields findings"><textarea class={input} rows="2" bind:value={store.data.ocularHealth.fieldsFindings}></textarea></FormField>
  <label class={cbLabel + ' mb-2'}>
    <input type="checkbox" bind:checked={store.data.ocularHealth.referOphthalmology} />
    Refer to ophthalmology
  </label>
  <FormField label="Referral reason"><textarea class={input} rows="2" bind:value={store.data.ocularHealth.referralReason}></textarea></FormField>
</StepCard>
