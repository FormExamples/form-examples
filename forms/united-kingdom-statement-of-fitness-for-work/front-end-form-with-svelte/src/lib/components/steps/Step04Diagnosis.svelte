<script lang="ts">
  import Field from '$lib/components/ui/Field.svelte';
  import TextArea from '$lib/components/ui/TextArea.svelte';
  import YesNoToggle from '$lib/components/ui/YesNoToggle.svelte';
  import { store } from '$lib/store.svelte.js';
  import { DIAGNOSIS_CATEGORIES } from '$lib/types.js';
</script>

<section aria-labelledby="step4-heading">
  <h2 id="step4-heading" class="text-xl font-semibold mb-4">Step 4 — Diagnosis</h2>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <Field id="diagnosis-text" label="Condition (free text)">
      <TextArea
        id="diagnosis-text"
        name="diagnosisText"
        rows={3}
        placeholder="Describe the medical condition."
        bind:value={store.data.diagnosisText}
      />
    </Field>
    <div class="grid grid-cols-1 gap-4">
      <Field id="diagnosis-snomed-code" label="SNOMED CT code (optional)">
        <input
          id="diagnosis-snomed-code"
          type="text"
          class="w-full border rounded px-2 py-1"
          bind:value={store.data.diagnosisSnomedCode}
        />
      </Field>
      <Field id="diagnosis-snomed-display" label="SNOMED CT display (optional)">
        <input
          id="diagnosis-snomed-display"
          type="text"
          class="w-full border rounded px-2 py-1"
          bind:value={store.data.diagnosisSnomedDisplay}
        />
      </Field>
    </div>
    <Field id="diagnosis-category" label="Diagnosis category">
      <select
        id="diagnosis-category"
        class="w-full border rounded px-2 py-1"
        bind:value={store.data.diagnosisCategory}
      >
        <option value="">—</option>
        {#each DIAGNOSIS_CATEGORIES as c (c.value)}
          <option value={c.value}>{c.label}</option>
        {/each}
      </select>
    </Field>
    <Field
      id="condition-first-recorded"
      label="Condition first recorded date"
      hint="Used to evaluate the 3-month / first-6-months policy rule."
    >
      <input
        id="condition-first-recorded"
        type="date"
        class="w-full border rounded px-2 py-1"
        bind:value={store.data.conditionFirstRecordedDate}
      />
    </Field>
    <Field id="auto-disability" label="Automatic disability (HIV / cancer / MS)?" hint="Equality Act 2010 s.6.">
      <YesNoToggle
        id="auto-disability"
        name="isAutomaticDisability"
        bind:value={store.data.isAutomaticDisability}
      />
    </Field>
    <Field
      id="is-non-medical"
      label="Is the reason non-medical?"
      hint="Fit notes cannot be issued for non-medical problems (DWP policy 3.6)."
    >
      <YesNoToggle
        id="is-non-medical"
        name="isNonMedical"
        bind:value={store.data.isNonMedical}
      />
    </Field>
  </div>
</section>
