<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import { TextAreaInput } from '@lilydesignsystem/svelte-headless';
  import Select from '#lib/components/ui/Select.svelte';

  const partII = assessment.data.partII;
</script>

<Fieldset legend="Step 5 of 11 — Part II and autopsy">
  <p class="hint">
    Other significant conditions that contributed to death but did not result in the underlying
    cause given in Part I, and whether an autopsy was done.
  </p>

  <Field
    label="Part II: other significant conditions contributing to death"
    inputId="partII-partIiConditions"
  >
    <TextAreaInput
      id="partII-partIiConditions"
      label="Part II: other significant conditions contributing to death"
      rows={3}
      placeholder="e.g. Type 2 diabetes mellitus; chronic kidney disease stage 3"
      bind:value={partII.partIiConditions}
    />
  </Field>

  <Field label="Was an autopsy performed?" inputId="partII-autopsyPerformed">
    <Select
      id="partII-autopsyPerformed"
      label="Was an autopsy performed?"
      bind:value={partII.autopsyPerformed}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>

  <Field
    label="Were autopsy findings available to complete the cause of death?"
    inputId="partII-autopsyFindingsAvailable"
  >
    <Select
      id="partII-autopsyFindingsAvailable"
      label="Were autopsy findings available to complete the cause of death?"
      bind:value={partII.autopsyFindingsAvailable}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>
</Fieldset>
