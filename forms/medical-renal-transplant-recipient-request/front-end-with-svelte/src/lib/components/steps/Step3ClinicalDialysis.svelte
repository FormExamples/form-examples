<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import Select from '#lib/components/ui/Select.svelte';
  import { CheckboxInput, TextInput, TextAreaInput } from '@lilydesignsystem/svelte-headless';

  const d = assessment.data.clinical;

  const aboOptions = [
    { value: 'a', label: 'A' },
    { value: 'b', label: 'B' },
    { value: 'ab', label: 'AB' },
    { value: 'o', label: 'O' },
    { value: 'unknown', label: 'Unknown' }
  ];

  const dialysisOptions = [
    { value: 'unit-haemodialysis', label: 'Unit haemodialysis' },
    { value: 'capd', label: 'CAPD' },
    { value: 'home-peritoneal-dialysis', label: 'Home peritoneal dialysis' },
    { value: 'pre-dialysis', label: 'Pre-dialysis' },
    { value: 'failing-transplant', label: 'Failing transplant' }
  ];
</script>

<Fieldset legend="Step 3 of 7 · Clinical information and dialysis">
  <p class="hint">What the laboratory needs to interpret the result.</p>

  <div class="field-grid">
    <label class="bool-field">
      <CheckboxInput
        id="clinical-autoimmuneDisease"
        label="Autoimmune disease"
        bind:checked={d.autoimmuneDisease}
      />
      <span>Autoimmune disease</span>
    </label>
    <label class="bool-field">
      <CheckboxInput
        id="clinical-virologyRisk"
        label="Virology risk"
        bind:checked={d.virologyRisk}
      />
      <span>Virology risk</span>
    </label>
  </div>

  <Field label="Immunosuppression" inputId="clinical-immunosuppression">
    <TextInput
      id="clinical-immunosuppression"
      label="Immunosuppression"
      bind:value={d.immunosuppression}
    />
  </Field>

  <Field label="Additional clinical information" inputId="clinical-clinicalInformation">
    <TextAreaInput
      id="clinical-clinicalInformation"
      label="Additional clinical information"
      rows={3}
      bind:value={d.clinicalInformation}
    />
  </Field>

  <Field label="Recipient ABO group" inputId="clinical-recipientAboGroup">
    <Select
      id="clinical-recipientAboGroup"
      label="Recipient ABO group"
      bind:value={d.recipientAboGroup}
    >
      <option value="">— Select —</option>
      {#each aboOptions as opt (opt.value)}
        <option value={opt.value}>{opt.label}</option>
      {/each}
    </Select>
  </Field>

  <h3 class="subhead">Dialysis</h3>

  <div class="field-grid">
    <Field label="Mode of dialysis" inputId="clinical-dialysisMode">
      <Select id="clinical-dialysisMode" label="Mode of dialysis" bind:value={d.dialysisMode}>
        <option value="">— Select —</option>
        {#each dialysisOptions as opt (opt.value)}
          <option value={opt.value}>{opt.label}</option>
        {/each}
      </Select>
    </Field>
    <Field label="Dialysis unit" inputId="clinical-dialysisUnitName">
      <TextInput
        id="clinical-dialysisUnitName"
        label="Dialysis unit"
        bind:value={d.dialysisUnitName}
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
  .subhead {
    margin: 1rem 0 0.25rem;
    font-weight: 600;
  }
  .bool-field {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
</style>
