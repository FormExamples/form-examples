<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import Select from '#lib/components/ui/Select.svelte';

  const v = assessment.data.relationship;
</script>

<Fieldset legend="Step 5 of 6 — Relationship">
  <p class="hint">
    People within the prohibited degrees of relationship cannot marry or form a civil partnership.
  </p>

  <Field
    label="Are the parties closely related (within the prohibited degrees)?"
    inputId="relationship-closelyRelated"
  >
    <Select
      id="relationship-closelyRelated"
      label="Are the parties closely related (within the prohibited degrees)?"
      bind:value={v.closelyRelated}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>
</Fieldset>
