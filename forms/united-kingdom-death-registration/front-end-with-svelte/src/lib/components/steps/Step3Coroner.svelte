<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import Select from '#lib/components/ui/Select.svelte';

  const p = assessment.data.coroner;
</script>

<Fieldset legend="Step 3 of 6 — Coroner">
  <p class="hint">
    Some deaths are reported to a coroner. Registration then waits for the coroner’s certificate.
  </p>

  <Field label="Has the death been reported to a coroner?" inputId="coroner-referredToCoroner">
    <Select
      id="coroner-referredToCoroner"
      label="Has the death been reported to a coroner?"
      bind:value={p.referredToCoroner}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>
  <Field label="Stage of the coroner’s involvement" inputId="coroner-coronerStage">
    <Select
      id="coroner-coronerStage"
      label="Stage of the coroner’s involvement"
      bind:value={p.coronerStage}
    >
      <option value="">— Select —</option>
      <option value="investigating">Coroner investigating</option>
      <option value="post-mortem">Post-mortem ordered</option>
      <option value="inquest-opened">Inquest opened</option>
      <option value="released-no-inquest">Released - no inquest needed</option>
      <option value="inquest-concluded">Inquest concluded</option>
    </Select>
  </Field>
  <Field
    label="Has the registrar received the coroner’s certificate?"
    inputId="coroner-coronerCertificateReceived"
  >
    <Select
      id="coroner-coronerCertificateReceived"
      label="Has the registrar received the coroner’s certificate?"
      bind:value={p.coronerCertificateReceived}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>
  <p class="hint">Form CN2 when there is no inquest, or the certificate after an inquest.</p>
</Fieldset>
