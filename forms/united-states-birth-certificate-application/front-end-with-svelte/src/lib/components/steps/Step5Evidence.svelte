<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import Select from '#lib/components/ui/Select.svelte';

  const e = assessment.data.evidence;
</script>

<Fieldset legend="Step 5 of 6 — Identity and supporting documents">
  <p class="hint">
    Certified copies need a current government photo ID, and proof of relationship or authority
    where you are not the person named.
  </p>

  <Field label="Photo ID you will present" inputId="evidence-idType">
    <Select id="evidence-idType" label="Photo ID you will present" bind:value={e.idType}>
      <option value="">— Select —</option>
      <option value="state-driver-license">State driver license</option>
      <option value="state-id-card">State identification card</option>
      <option value="us-passport">US passport</option>
      <option value="military-id">Military ID</option>
      <option value="other-photo-id">Other government photo ID</option>
      <option value="none">No photo ID</option>
    </Select>
  </Field>

  <Field label="Is the ID current and unexpired?" inputId="evidence-idUnexpired">
    <Select
      id="evidence-idUnexpired"
      label="Is the ID current and unexpired?"
      bind:value={e.idUnexpired}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>

  <Field
    label="Do you enclose proof of your relationship to the person named?"
    inputId="evidence-proofOfRelationship"
  >
    <Select
      id="evidence-proofOfRelationship"
      label="Do you enclose proof of your relationship to the person named?"
      bind:value={e.proofOfRelationship}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>

  <Field
    label="Do you enclose a court order, guardianship letters, or agency authority?"
    inputId="evidence-authorityDocument"
  >
    <Select
      id="evidence-authorityDocument"
      label="Do you enclose a court order, guardianship letters, or agency authority?"
      bind:value={e.authorityDocument}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>

  <Field
    label="Do you enclose a notarized sworn statement of identity?"
    inputId="evidence-notarizedSwornStatement"
  >
    <Select
      id="evidence-notarizedSwornStatement"
      label="Do you enclose a notarized sworn statement of identity?"
      bind:value={e.notarizedSwornStatement}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>
</Fieldset>
