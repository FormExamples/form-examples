<script lang="ts">
  import { store } from '#lib/stores/assessment.svelte.js';
  import { METHOD_OPTIONS } from '#lib/engine/utils.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import Select from '#lib/components/ui/Select.svelte';
  import { DateInput } from '@lilydesignsystem/svelte-headless';
</script>

<Fieldset legend="Step 2 of 8 — Assessment" id="step-2-legend">
  <p class="hint">When and how the employee was assessed (rule R-01).</p>
  <div class="field-grid">
    <Field label="Assessment date" inputId="step-2-assessment-date">
      <DateInput
        id="step-2-assessment-date"
        label="Assessment date"
        bind:value={
          () => store.data.assessmentDate ?? '', (v) => (store.data.assessmentDate = v || null)
        }
      />
    </Field>
    <Field label="Assessment method" inputId="step-2-assessment-method">
      <Select
        id="step-2-assessment-method"
        label="Assessment method"
        bind:value={store.data.assessmentMethod}
      >
        <option value="">— Select —</option>
        {#each METHOD_OPTIONS as o (o.value)}
          <option value={o.value}>{o.label}</option>
        {/each}
      </Select>
    </Field>
  </div>
</Fieldset>
