<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import Select from '#lib/components/ui/Select.svelte';

  const u = assessment.data.authority;
</script>

<Fieldset legend="Step 3 of 6 — Authority">
  <p class="hint">
    When the agent's power begins, medical-record access, mental health decisions, organ donation,
    and earlier documents.
  </p>

  <Field label="When does the agent's authority begin?" inputId="authority-effectiveWhen">
    <Select
      id="authority-effectiveWhen"
      label="When does the agent's authority begin?"
      bind:value={u.effectiveWhen}
    >
      <option value="">— Select —</option>
      <option value="immediately">Immediately on signing</option>
      <option value="upon-incapacity">Only when I cannot decide for myself</option>
    </Select>
  </Field>
  <Field
    label="Who decides that the principal cannot decide?"
    inputId="authority-incapacityDeterminedBy"
  >
    <Select
      id="authority-incapacityDeterminedBy"
      label="Who decides that the principal cannot decide?"
      bind:value={u.incapacityDeterminedBy}
    >
      <option value="">— Select —</option>
      <option value="one-physician">One physician</option>
      <option value="two-physicians">Two physicians</option>
      <option value="other">Another method stated in the document</option>
    </Select>
  </Field>
  <Field
    label="Includes a HIPAA release so the agent can see records?"
    inputId="authority-hipaaRelease"
  >
    <Select
      id="authority-hipaaRelease"
      label="Includes a HIPAA release so the agent can see records?"
      bind:value={u.hipaaRelease}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>
  <p class="hint">HIPAA authorization, 45 CFR 164.508.</p>
  <Field
    label="Agent may decide on mental health treatment?"
    inputId="authority-mentalHealthAuthority"
  >
    <Select
      id="authority-mentalHealthAuthority"
      label="Agent may decide on mental health treatment?"
      bind:value={u.mentalHealthAuthority}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>
  <Field label="Organ and tissue donation" inputId="authority-organDonation">
    <Select
      id="authority-organDonation"
      label="Organ and tissue donation"
      bind:value={u.organDonation}
    >
      <option value="">— Select —</option>
      <option value="any-needs">Any needed organs and tissues</option>
      <option value="transplant-only">Transplant or therapy only</option>
      <option value="research-only">Research only</option>
      <option value="none">No donation</option>
      <option value="not-addressed">Not addressed</option>
    </Select>
  </Field>
  <Field label="Earlier health care powers of attorney" inputId="authority-priorDirectiveStatus">
    <Select
      id="authority-priorDirectiveStatus"
      label="Earlier health care powers of attorney"
      bind:value={u.priorDirectiveStatus}
    >
      <option value="">— Select —</option>
      <option value="none-existing">I have no earlier health care power of attorney</option>
      <option value="revokes-prior">This document revokes my earlier one</option>
      <option value="prior-remains">An earlier one remains in force</option>
    </Select>
  </Field>
</Fieldset>
