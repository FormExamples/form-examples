<script lang="ts">
  import { store } from '$lib/stores/assessment.svelte.js';
  import Fieldset from '$lib/components/ui/Fieldset.svelte';
  import Field from '$lib/components/ui/Field.svelte';
  import NumberInput from '$lib/components/ui/NumberInput.svelte';
  import Select from '$lib/components/ui/Select.svelte';
  import TextInput from '$lib/components/ui/TextInput.svelte';
  import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

  const sb = [
    ['stopbangSnoring', 'Loud snoring'],
    ['stopbangTired', 'Daytime tired'],
    ['stopbangObservedApnoea', 'Observed apnoea'],
    ['stopbangPressure', 'Treated for HTN'],
    ['stopbangBmiGt35', 'BMI > 35'],
    ['stopbangAgeGt50', 'Age > 50'],
    ['stopbangNeckGt40', 'Neck > 40 cm'],
    ['stopbangMale', 'Male'],
  ] as const;
</script>

<Fieldset legend="Step 4 — Airway assessment">
  <div class="field-grid">
    <Field label="Mallampati">
      <Select label="Mallampati" bind:value={store.data.airway.mallampatiClass}>
        <option value="">—</option>
        <option value="I">I</option>
        <option value="II">II</option>
        <option value="III">III</option>
        <option value="IV">IV</option>
      </Select>
    </Field>
    <Field label="Thyromental distance (cm)">
      <NumberInput label="Thyromental distance (cm)" step="0.1" bind:value={store.data.airway.thyromentalDistanceCm} />
    </Field>
    <Field label="Mouth opening (cm)">
      <NumberInput label="Mouth opening (cm)" step="0.1" bind:value={store.data.airway.mouthOpeningCm} />
    </Field>
    <Field label="Neck ROM">
      <Select label="Neck ROM" bind:value={store.data.airway.neckRom}>
        <option value="">—</option>
        <option value="full">Full</option>
        <option value="reduced">Reduced</option>
        <option value="severely-limited">Severely limited</option>
      </Select>
    </Field>
    <Field label="Dentition">
      <Select label="Dentition" bind:value={store.data.airway.dentition}>
        <option value="">—</option>
        <option value="good">Good</option>
        <option value="loose-teeth">Loose teeth</option>
        <option value="caps-crowns">Caps/crowns</option>
        <option value="edentulous">Edentulous</option>
        <option value="dentures">Dentures</option>
      </Select>
    </Field>
    <Field label="Prior difficult intubation">
      <Select label="Prior difficult intubation" bind:value={store.data.airway.priorDifficultIntubation}>
        <option value="">—</option>
        <option value="yes">Yes</option>
        <option value="no">No</option>
      </Select>
    </Field>
  </div>

  <h3 class="step-subhead">Surgical and anaesthetic history</h3>
  <div class="field-grid">
    <Field label="Previous surgeries" class="field-span-2">
      <TextAreaInput
        label="Previous surgeries"
        rows={2}
        bind:value={store.data.airway.previousSurgeries}
      />
    </Field>
    <Field label="Previous anaesthetic issues">
      <Select label="Previous anaesthetic issues" bind:value={store.data.airway.previousAnaestheticIssues}>
        <option value="">—</option>
        <option value="yes">Yes</option>
        <option value="no">No</option>
      </Select>
    </Field>
    <Field label="Previous anaesthetic issue details">
      <TextInput
        label="Previous anaesthetic issue details"
        bind:value={store.data.airway.previousAnaestheticIssuesDetails}
      />
    </Field>
    <Field label="Family history of anaesthetic complications">
      <Select
        label="Family history of anaesthetic complications"
        bind:value={store.data.airway.familyHistoryAnaestheticComplications}
      >
        <option value="">—</option>
        <option value="yes">Yes</option>
        <option value="no">No</option>
      </Select>
    </Field>
    <Field label="Family history details">
      <TextInput
        label="Family history details"
        bind:value={store.data.airway.familyHistoryAnaestheticComplicationsDetails}
      />
    </Field>
  </div>

  <h3 class="step-subhead">STOP-BANG</h3>
  <div class="field-grid field-grid-4">
    {#each sb as [key, label]}
      <Field {label}>
        <Select {label} bind:value={store.data.airway[key]}>
          <option value="">—</option>
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </Select>
      </Field>
    {/each}
  </div>
</Fieldset>
