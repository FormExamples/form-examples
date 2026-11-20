<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import { TextInput } from '@lilydesignsystem/svelte-headless';
  import Select from '#lib/components/ui/Select.svelte';

  const p = assessment.data.informant;
</script>

<Fieldset legend="Step 4 of 6 — The informant">
  <p class="hint">
    Only a qualified informant can register the death: a relative, a person present at the death,
    the occupier of the premises, or the person arranging the funeral.
  </p>

  <Field label="Informant — full name" inputId="informant-informantName">
    <TextInput
      id="informant-informantName"
      label="Informant — full name"
      placeholder="Person who will register the death"
      bind:value={p.informantName}
    />
  </Field>
  <Field
    label="Why is this person qualified to register?"
    inputId="informant-informantRelationship"
  >
    <Select
      id="informant-informantRelationship"
      label="Why is this person qualified to register?"
      bind:value={p.informantRelationship}
    >
      <option value="">— Select —</option>
      <option value="relative-present-at-death">Relative present at the death</option>
      <option value="relative-in-attendance">Relative in attendance during the last illness</option>
      <option value="relative-in-district">Relative living in the registration district</option>
      <option value="person-present-at-death">Person present at the death</option>
      <option value="occupier-of-premises">Occupier of the premises where the death occurred</option
      >
      <option value="person-arranging-funeral">Person arranging the funeral</option>
      <option value="not-qualified"
        >None of these (for example a friend or neighbour not otherwise involved)</option
      >
    </Select>
  </Field>
  <Field label="Informant address" inputId="informant-informantAddress">
    <TextInput
      id="informant-informantAddress"
      label="Informant address"
      placeholder="Postal address"
      bind:value={p.informantAddress}
    />
  </Field>
</Fieldset>
