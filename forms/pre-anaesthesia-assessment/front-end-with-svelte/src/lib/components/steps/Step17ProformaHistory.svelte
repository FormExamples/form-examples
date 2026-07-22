<script lang="ts">
  import Field from '$lib/components/ui/Field.svelte';
  import Fieldset from '$lib/components/ui/Fieldset.svelte';
  import TextInput from '$lib/components/ui/TextInput.svelte';
  import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
  import DateInput from '$lib/components/ui/DateInput.svelte';

  import { store } from '$lib/stores/assessment.svelte.js';

  const h = store.data.proformaHeader;
  const pa = store.data.previousAnaesthesiaChecklist;
  const ad = store.data.addictionSubstanceAbuse;

  const previousAnaesthesiaItems = [
    ['anaestheticDifficulty', 'Anaesthetic difficulty'],
    ['abnormalReaction', 'Abnormal reaction'],
    ['ponv', 'PONV'],
    ['malignantHyperpyrexia', 'Malignant hyperpyrexia'],
    ['difficultIntubation', 'Difficult intubation'],
    ['difficultSpinalOrEpidural', 'Difficult spinal or epidural'],
  ] as const;

  const addictionItems = [
    ['alcohol', 'Alcohol'],
    ['smoking', 'Smoking'],
    ['fastScore3OrMore', 'FAST score 3 or more'],
    ['betel', 'Betel'],
    ['drugs', 'Drugs'],
    ['other', 'Other'],
  ] as const;
</script>

<Fieldset legend="Step 17 — Pre-anaesthesia proforma: header and history">
  <div class="field-grid">
    <Field label="Department">
      <TextInput label="Department" bind:value={h.department} />
    </Field>
    <Field label="Date of registration">
      <DateInput label="Date of registration" bind:value={h.registrationDate} />
    </Field>
    <Field label="Pre-op diagnosis" class="field-span-2">
      <TextAreaInput label="Pre-op diagnosis" rows={2} bind:value={h.preOpDiagnosis} />
    </Field>
  </div>

  <h3 class="step-subhead">Previous anaesthesia history</h3>
  <div class="field-grid field-grid-3">
    {#each previousAnaesthesiaItems as [key, label]}
      <label class="checkbox-label"><input type="checkbox" class="checkbox-input" bind:checked={pa[key]} /> {label}</label>
    {/each}
  </div>

  <h3 class="step-subhead">Addiction / substance abuse</h3>
  <div class="field-grid field-grid-3">
    {#each addictionItems as [key, label]}
      <label class="checkbox-label"><input type="checkbox" class="checkbox-input" bind:checked={ad[key]} /> {label}</label>
    {/each}
  </div>
  {#if ad.other}
    <Field label="Please provide details" inputId="addictionOtherDetails">
      <TextInput id="addictionOtherDetails" label="Please provide details" bind:value={ad.otherDetails} />
    </Field>
  {/if}
</Fieldset>
