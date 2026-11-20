<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import { TextAreaInput, TextInput } from '@lilydesignsystem/svelte-headless';
  import DateInput from '#lib/components/ui/DateInput.svelte';

  const m = assessment.data.mother;
</script>

<Fieldset legend="Step 2 of 5 — The mother">
  <p class="hint">The mother is the person who gave birth to the child.</p>

  <Field label="Mother's full name" inputId="mother-motherName">
    <TextInput id="mother-motherName" label="Mother's full name" bind:value={m.motherName} />
  </Field>

  <Field label="Mother's maiden surname" inputId="mother-motherMaidenSurname">
    <TextInput
      id="mother-motherMaidenSurname"
      label="Mother's maiden surname"
      bind:value={m.motherMaidenSurname}
    />
  </Field>

  <Field label="Mother's date of birth" inputId="mother-motherDateOfBirth">
    <DateInput
      id="mother-motherDateOfBirth"
      label="Mother's date of birth"
      bind:value={m.motherDateOfBirth}
    />
  </Field>

  <Field label="Mother's place of birth" inputId="mother-motherPlaceOfBirth">
    <TextInput
      id="mother-motherPlaceOfBirth"
      label="Mother's place of birth"
      placeholder="Town and country"
      bind:value={m.motherPlaceOfBirth}
    />
  </Field>

  <Field label="Mother's occupation" inputId="mother-motherOccupation">
    <TextInput
      id="mother-motherOccupation"
      label="Mother's occupation"
      bind:value={m.motherOccupation}
    />
  </Field>

  <Field label="Mother's usual address" inputId="mother-motherAddress">
    <TextAreaInput
      id="mother-motherAddress"
      label="Mother's usual address"
      rows={3}
      bind:value={m.motherAddress}
    />
  </Field>
</Fieldset>
