<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import Select from '#lib/components/ui/Select.svelte';

  const i = assessment.data.instrument;
</script>

<Fieldset legend="Step 2 of 6 — Durability and effectiveness">
  <p class="hint">
    Texas and California need express durability wording. Florida does not allow a springing power.
  </p>

  <Field
    label="Does the authority survive the principal’s later incapacity (durable)?"
    inputId="instrument-durableStatement"
  >
    <Select
      id="instrument-durableStatement"
      label="Does the authority survive the principal’s later incapacity (durable)?"
      bind:value={i.durableStatement}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>
  <Field label="When does the power take effect?" inputId="instrument-effectiveness">
    <Select
      id="instrument-effectiveness"
      label="When does the power take effect?"
      bind:value={i.effectiveness}
    >
      <option value="">— Select —</option>
      <option value="immediate">Immediately on signing</option>
      <option value="springing">Springing: only on a later event, such as incapacity</option>
    </Select>
  </Field>
  <Field label="Who determines a springing event?" inputId="instrument-springingTrigger">
    <Select
      id="instrument-springingTrigger"
      label="Who determines a springing event?"
      bind:value={i.springingTrigger}
    >
      <option value="">— Select —</option>
      <option value="physician-certification">Physician certification of incapacity</option>
      <option value="named-person-declaration">Declaration by a named person</option>
      <option value="court-determination">Court determination</option>
    </Select>
  </Field>
  <Field
    label="Statutory notice or warning text included?"
    inputId="instrument-statutoryNoticeIncluded"
  >
    <Select
      id="instrument-statutoryNoticeIncluded"
      label="Statutory notice or warning text included?"
      bind:value={i.statutoryNoticeIncluded}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>
</Fieldset>
