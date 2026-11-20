<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import { TextInput, TextAreaInput } from '@lilydesignsystem/svelte-headless';
  import Select from '#lib/components/ui/Select.svelte';
  import NumberInput from '#lib/components/ui/NumberInput.svelte';

  const s = assessment.data.estate;
</script>

<Fieldset legend="Step 2 of 6 — The estate">
  <p class="hint">
    Roughly what is owned, where, and the inheritance tax position. The nil-rate band is £325,000,
    and the residence nil-rate band adds up to £175,000 when a home is left to children or
    grandchildren.
  </p>

  <Field label="Approximate value of the estate" inputId="estate-estateValueBand">
    <Select
      id="estate-estateValueBand"
      label="Approximate value of the estate"
      bind:value={s.estateValueBand}
    >
      <option value="">— Select —</option>
      <option value="under-325k">Under £325,000</option>
      <option value="325k-500k">£325,000 to £500,000</option>
      <option value="500k-2m">£500,000 to £2 million</option>
      <option value="over-2m">Over £2 million</option>
    </Select>
  </Field>

  <Field label="Does the estate include a home?" inputId="estate-ownsHome">
    <Select id="estate-ownsHome" label="Does the estate include a home?" bind:value={s.ownsHome}>
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>

  <Field
    label="Is the home left to children or grandchildren?"
    inputId="estate-homeToDirectDescendants"
  >
    <Select
      id="estate-homeToDirectDescendants"
      label="Is the home left to children or grandchildren?"
      bind:value={s.homeToDirectDescendants}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>

  <Field label="Share of the net estate left to charity (%)" inputId="estate-charityGiftPercent">
    <NumberInput
      id="estate-charityGiftPercent"
      label="Share of the net estate left to charity (%)"
      min={0}
      max={100}
      step={0.01}
      bind:value={s.charityGiftPercent}
    />
  </Field>

  <Field
    label="Is any property outside England and Wales?"
    inputId="estate-estateOtherJurisdictions"
  >
    <Select
      id="estate-estateOtherJurisdictions"
      label="Is any property outside England and Wales?"
      bind:value={s.estateOtherJurisdictions}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>

  <Field label="Property outside England and Wales" inputId="estate-otherJurisdictionsDetail">
    <TextInput
      id="estate-otherJurisdictionsDetail"
      label="Property outside England and Wales"
      placeholder="e.g. holiday flat in Spain"
      bind:value={s.otherJurisdictionsDetail}
    />
  </Field>

  <Field label="Specific gifts" inputId="estate-specificGiftsNotes">
    <TextAreaInput
      id="estate-specificGiftsNotes"
      label="Specific gifts"
      rows={3}
      placeholder="e.g. my watch to my brother"
      bind:value={s.specificGiftsNotes}
    />
  </Field>
</Fieldset>
