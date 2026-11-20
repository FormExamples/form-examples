<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import Select from '#lib/components/ui/Select.svelte';
  import NumberInput from '#lib/components/ui/NumberInput.svelte';

  const e = assessment.data.evidence;
</script>

<Fieldset legend="Step 5 of 7 — Supporting evidence">
  <p class="hint">
    The documents sent with a first registration: newness, approval, MOT, insurance, and build
    evidence.
  </p>

  <Field label="Certificate of newness enclosed?" inputId="evidence-certificateOfNewnessProvided">
    <Select
      id="evidence-certificateOfNewnessProvided"
      label="Certificate of newness enclosed?"
      bind:value={e.certificateOfNewnessProvided}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>
  <p class="hint">For a new vehicle. An import sends a declaration of newness.</p>

  <Field label="Vehicle approval evidence" inputId="evidence-typeApproval">
    <Select
      id="evidence-typeApproval"
      label="Vehicle approval evidence"
      bind:value={e.typeApproval}
    >
      <option value="">— Select —</option>
      <option value="ecwvta"
        >European Community Whole Vehicle Type Approval (certificate of conformity)</option
      >
      <option value="gb-type-approval">Great Britain type approval certificate</option>
      <option value="ni-type-approval">Northern Ireland type approval certificate</option>
      <option value="iva">Individual Vehicle Approval (IVA) certificate</option>
      <option value="msva">Motorcycle Single Vehicle Approval (MSVA) certificate</option>
      <option value="exempt-over-10-years">Exempt: vehicle is 10 years old or more</option>
      <option value="none">No type-approval evidence</option>
    </Select>
  </Field>
  <p class="hint">Needed for a vehicle under 10 years old, unless exempt.</p>

  <Field label="MOT certificate" inputId="evidence-motStatus">
    <Select id="evidence-motStatus" label="MOT certificate" bind:value={e.motStatus}>
      <option value="">— Select —</option>
      <option value="valid">Valid MOT certificate enclosed</option>
      <option value="not-required">Not required</option>
      <option value="missing">No MOT certificate</option>
    </Select>
  </Field>
  <p class="hint">Needed for a used vehicle over 3 years old (over 4 in Northern Ireland).</p>

  <Field label="Insurance" inputId="evidence-insuranceStatus">
    <Select id="evidence-insuranceStatus" label="Insurance" bind:value={e.insuranceStatus}>
      <option value="">— Select —</option>
      <option value="in-force">Insurance in force (certificate or cover note)</option>
      <option value="none">No insurance</option>
    </Select>
  </Field>
  <p class="hint">
    Insurance evidence is sent when registering to a Northern Ireland address; every vehicle must be
    insured before it is driven.
  </p>

  <Field
    label="Build evidence enclosed (rebuilt or kit vehicle)?"
    inputId="evidence-buildEvidenceProvided"
  >
    <Select
      id="evidence-buildEvidenceProvided"
      label="Build evidence enclosed (rebuilt or kit vehicle)?"
      bind:value={e.buildEvidenceProvided}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>

  <Field label="Number of donor vehicles" inputId="evidence-donorVehicleCount">
    <NumberInput
      id="evidence-donorVehicleCount"
      label="Number of donor vehicles"
      min={0}
      max={50}
      bind:value={e.donorVehicleCount}
    />
  </Field>
</Fieldset>
