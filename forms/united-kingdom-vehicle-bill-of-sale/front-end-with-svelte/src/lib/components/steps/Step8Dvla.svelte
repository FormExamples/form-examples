<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import Select from '#lib/components/ui/Select.svelte';

  const p = assessment.data.dvla;
</script>

<Fieldset legend="Step 8 of 9 — Telling DVLA">
  <p class="hint">
    The seller must tell DVLA about the sale, and the buyer keeps the V5C/2 new keeper section until
    the new V5C arrives. The buyer must tax the vehicle before driving it, because tax does not
    transfer.
  </p>

  <Field
    label="Has the seller given the buyer the V5C/2 new keeper section?"
    inputId="dvla-newKeeperSlipGiven"
  >
    <Select
      id="dvla-newKeeperSlipGiven"
      label="Has the seller given the buyer the V5C/2 new keeper section?"
      bind:value={p.newKeeperSlipGiven}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>

  <Field label="How has DVLA been told of the sale?" inputId="dvla-dvlaNotification">
    <Select
      id="dvla-dvlaNotification"
      label="How has DVLA been told of the sale?"
      bind:value={p.dvlaNotification}
    >
      <option value="">— Select —</option>
      <option value="online">Told DVLA online</option>
      <option value="post">Told DVLA by post (V5C)</option>
      <option value="not-yet">Not yet told</option>
    </Select>
  </Field>
</Fieldset>
