<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import { TextInput, TextAreaInput } from '@lilydesignsystem/svelte-headless';
  import Select from '#lib/components/ui/Select.svelte';

  const s = assessment.data.family;
</script>

<Fieldset legend="Step 5 of 6 — Guardians and funeral wishes">
  <p class="hint">
    Who looks after children under 18, and what the testator would like for their funeral.
  </p>

  <Field label="Does the testator have children under 18?" inputId="family-hasChildrenUnder18">
    <Select
      id="family-hasChildrenUnder18"
      label="Does the testator have children under 18?"
      bind:value={s.hasChildrenUnder18}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>

  <Field label="Guardian for children under 18" inputId="family-guardianName">
    <TextInput
      id="family-guardianName"
      label="Guardian for children under 18"
      bind:value={s.guardianName}
    />
  </Field>

  <Field label="Funeral wishes" inputId="family-funeralWishes">
    <Select id="family-funeralWishes" label="Funeral wishes" bind:value={s.funeralWishes}>
      <option value="">— Select —</option>
      <option value="burial">Burial</option>
      <option value="cremation">Cremation</option>
      <option value="no-preference">No preference</option>
      <option value="other">Other</option>
    </Select>
  </Field>

  <Field label="Funeral wishes — notes" inputId="family-funeralWishesNote">
    <TextAreaInput
      id="family-funeralWishesNote"
      label="Funeral wishes — notes"
      rows={3}
      bind:value={s.funeralWishesNote}
    />
  </Field>
</Fieldset>
