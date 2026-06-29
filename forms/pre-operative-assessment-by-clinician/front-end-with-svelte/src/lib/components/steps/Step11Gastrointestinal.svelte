<script lang="ts">
  import { store } from '$lib/stores/assessment.svelte.js';
  import Fieldset from '$lib/components/ui/Fieldset.svelte';
  import Field from '$lib/components/ui/Field.svelte';
  import Select from '$lib/components/ui/Select.svelte';
</script>

<Fieldset legend="Step 11 — Gastrointestinal">
  <div class="field-grid">
    <Field label="Abdominal exam">
      <Select label="Abdominal exam" bind:value={store.data.gastrointestinal.abdominalExam}>
        <option value="">—</option>
        <option value="normal">Normal</option>
        <option value="distended">Distended</option>
        <option value="tender">Tender</option>
        <option value="organomegaly">Organomegaly</option>
        <option value="other">Other</option>
      </Select>
    </Field>
    <Field label="Reflux">
      <Select label="Reflux" bind:value={store.data.gastrointestinal.refluxSymptoms}>
        <option value="">—</option>
        <option value="none">None</option>
        <option value="occasional">Occasional</option>
        <option value="frequent">Frequent</option>
        <option value="severe">Severe</option>
      </Select>
    </Field>
    <Field label="Hiatus hernia">
      <Select label="Hiatus hernia" bind:value={store.data.gastrointestinal.hiatusHernia}>
        <option value="">—</option>
        <option value="yes">Yes</option>
        <option value="no">No</option>
      </Select>
    </Field>
    <Field label="Fasting confirmed">
      <Select label="Fasting confirmed" bind:value={store.data.gastrointestinal.fastingConfirmed}>
        <option value="">—</option>
        <option value="yes">Yes</option>
        <option value="no">No</option>
      </Select>
    </Field>
    <Field label="Last solid food">
      <input
        class="text-input"
        type="datetime-local"
        aria-label="Last solid food"
        bind:value={store.data.gastrointestinal.lastSolidFoodAt}
      />
    </Field>
    <Field label="Last clear fluid">
      <input
        class="text-input"
        type="datetime-local"
        aria-label="Last clear fluid"
        bind:value={store.data.gastrointestinal.lastClearFluidAt}
      />
    </Field>
    <Field label="RSI needed?">
      <Select label="RSI needed?" bind:value={store.data.gastrointestinal.rapidSequenceInductionNeeded}>
        <option value="">—</option>
        <option value="yes">Yes</option>
        <option value="no">No</option>
      </Select>
    </Field>
  </div>
</Fieldset>
