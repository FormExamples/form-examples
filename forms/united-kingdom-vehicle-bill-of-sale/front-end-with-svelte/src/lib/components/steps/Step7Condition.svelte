<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import { TextAreaInput } from '@lilydesignsystem/svelte-headless';
  import Select from '#lib/components/ui/Select.svelte';

  const p = assessment.data.condition;
</script>

<Fieldset legend="Step 7 of 9 — Condition and description">
  <p class="hint">
    In a private sale the vehicle is usually sold as seen, but the seller must still describe it
    honestly.
  </p>

  <Field label="Sale terms" inputId="condition-saleTerms">
    <Select id="condition-saleTerms" label="Sale terms" bind:value={p.saleTerms}>
      <option value="">— Select —</option>
      <option value="sold-as-seen">Sold as seen</option>
      <option value="warranty-given">Warranty given</option>
    </Select>
  </Field>

  <Field label="Known faults disclosed by the seller" inputId="condition-knownFaults">
    <TextAreaInput
      id="condition-knownFaults"
      label="Known faults disclosed by the seller"
      rows={3}
      placeholder="e.g. Slight oil leak; scratch on the rear bumper"
      bind:value={p.knownFaults}
    />
  </Field>

  <Field
    label="Does the vehicle match the advert and what the seller said?"
    inputId="condition-descriptionMatchesAdvert"
  >
    <Select
      id="condition-descriptionMatchesAdvert"
      label="Does the vehicle match the advert and what the seller said?"
      bind:value={p.descriptionMatchesAdvert}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>
</Fieldset>
