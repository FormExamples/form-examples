<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import { TextAreaInput } from '@lilydesignsystem/svelte-headless';
  import Select from '#lib/components/ui/Select.svelte';
  import NumberInput from '#lib/components/ui/NumberInput.svelte';

  const c = assessment.data.children;
</script>

<Fieldset legend="Step 5 of 7 — Children">
  <p class="hint">
    Arrangements for children under 18. The court does not decide these as part of the divorce
    unless there is a dispute.
  </p>

  <Field label="Are there children of the family under 18?" inputId="children-childrenUnder18">
    <Select
      id="children-childrenUnder18"
      label="Are there children of the family under 18?"
      bind:value={c.childrenUnder18}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>

  <Field label="Number of children under 18" inputId="children-childrenCount">
    <NumberInput
      id="children-childrenCount"
      label="Number of children under 18"
      min={0}
      max={30}
      bind:value={c.childrenCount}
    />
  </Field>

  <Field label="Arrangements for the children" inputId="children-childrenArrangements">
    <Select
      id="children-childrenArrangements"
      label="Arrangements for the children"
      bind:value={c.childrenArrangements}
    >
      <option value="">— Select —</option>
      <option value="agreed">Agreed</option>
      <option value="not-agreed">Not agreed</option>
      <option value="undecided">Undecided</option>
    </Select>
  </Field>

  <Field label="Note on the children arrangements" inputId="children-childrenNote">
    <TextAreaInput
      id="children-childrenNote"
      label="Note on the children arrangements"
      rows={3}
      bind:value={c.childrenNote}
    />
  </Field>
</Fieldset>
