<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import { TextInput } from '@lilydesignsystem/svelte-headless';
  import Select from '#lib/components/ui/Select.svelte';

  const p = assessment.data.purpose;
</script>

<Fieldset legend="Step 3 of 6 — Relationship and purpose">
  <p class="hint">
    Who you are to the person named and what the certificate is for. Most states restrict certified
    copies to people with a direct and tangible interest.
  </p>

  <Field label="Your relationship to the person named" inputId="purpose-relationship">
    <Select
      id="purpose-relationship"
      label="Your relationship to the person named"
      bind:value={p.relationship}
    >
      <option value="">— Select —</option>
      <option value="self">Myself (the person named)</option>
      <option value="parent">Parent named on the certificate</option>
      <option value="legal-guardian">Legal guardian</option>
      <option value="legal-representative">Legal representative (attorney)</option>
      <option value="spouse">Spouse</option>
      <option value="child">Adult child</option>
      <option value="sibling">Sibling</option>
      <option value="grandparent">Grandparent</option>
      <option value="grandchild">Grandchild</option>
      <option value="government-agency">Government agency</option>
      <option value="other">Other (no direct relationship)</option>
    </Select>
  </Field>

  <Field label="Purpose of the certificate" inputId="purpose-purpose">
    <Select id="purpose-purpose" label="Purpose of the certificate" bind:value={p.purpose}>
      <option value="">— Select —</option>
      <option value="passport">US passport</option>
      <option value="real-id">REAL ID driver license</option>
      <option value="school">School enrollment</option>
      <option value="employment">Employment</option>
      <option value="benefits">Benefits or Social Security</option>
      <option value="genealogy">Genealogy or family history</option>
      <option value="foreign-use">Use in another country</option>
      <option value="other">Other</option>
    </Select>
  </Field>

  <Field
    label="Will the certificate be used in another country (apostille)?"
    inputId="purpose-needsApostille"
  >
    <Select
      id="purpose-needsApostille"
      label="Will the certificate be used in another country (apostille)?"
      bind:value={p.needsApostille}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>

  <Field label="Destination country" inputId="purpose-apostilleCountry">
    <TextInput
      id="purpose-apostilleCountry"
      label="Destination country"
      placeholder="Only if an apostille is needed"
      bind:value={p.apostilleCountry}
    />
  </Field>
</Fieldset>
