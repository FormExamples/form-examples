<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import StepCard from '#lib/components/ui/StepCard.svelte';
  import FormField from '#lib/components/ui/FormField.svelte';
  const input = 'input w-full';
  const cbLabel = 'flex items-center gap-2 text-sm text-base-content/80';
</script>

<StepCard step={10} title="Ocular health findings (optional)">
  <div class="grid grid-cols-1 md:grid-cols-2 gap-x-4">
    <FormField label="Slit-lamp right"><textarea class={input} rows="2" bind:value={assessment.data.ocularHealth.slitLampRight}></textarea></FormField>
    <FormField label="Slit-lamp left"><textarea class={input} rows="2" bind:value={assessment.data.ocularHealth.slitLampLeft}></textarea></FormField>
    <FormField label="Fundus right"><textarea class={input} rows="2" bind:value={assessment.data.ocularHealth.fundusRight}></textarea></FormField>
    <FormField label="Fundus left"><textarea class={input} rows="2" bind:value={assessment.data.ocularHealth.fundusLeft}></textarea></FormField>
    <FormField label="IOP right (mmHg)"><input class={input} type="number" step="0.1" min="0" max="80" bind:value={assessment.data.ocularHealth.intraocularPressureRightMmhg} /></FormField>
    <FormField label="IOP left (mmHg)"><input class={input} type="number" step="0.1" min="0" max="80" bind:value={assessment.data.ocularHealth.intraocularPressureLeftMmhg} /></FormField>
    <FormField label="Cup-to-disc ratio right"><input class={input} type="number" step="0.05" min="0" max="1" bind:value={assessment.data.ocularHealth.cupToDiscRatioRight} /></FormField>
    <FormField label="Cup-to-disc ratio left"><input class={input} type="number" step="0.05" min="0" max="1" bind:value={assessment.data.ocularHealth.cupToDiscRatioLeft} /></FormField>
  </div>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2 mb-4">
    <label class={cbLabel}><input type="checkbox" bind:checked={assessment.data.ocularHealth.octPerformed} /> OCT performed</label>
    <label class={cbLabel}><input type="checkbox" bind:checked={assessment.data.ocularHealth.fieldsPerformed} /> Visual fields performed</label>
    <label class={cbLabel}><input type="checkbox" bind:checked={assessment.data.ocularHealth.pathologyFlag} /> Pathology identified</label>
  </div>
  <FormField label="OCT findings"><textarea class={input} rows="2" bind:value={assessment.data.ocularHealth.octFindings}></textarea></FormField>
  <FormField label="Fields findings"><textarea class={input} rows="2" bind:value={assessment.data.ocularHealth.fieldsFindings}></textarea></FormField>
  <label class={cbLabel + ' mb-2'}>
    <input type="checkbox" bind:checked={assessment.data.ocularHealth.referOphthalmology} />
    Refer to ophthalmology
  </label>
  <FormField label="Referral reason"><textarea class={input} rows="2" bind:value={assessment.data.ocularHealth.referralReason}></textarea></FormField>
</StepCard>
