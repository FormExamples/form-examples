<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import { TextInput } from '@lilydesignsystem/svelte-headless';
  import Select from '#lib/components/ui/Select.svelte';
  import DateInput from '#lib/components/ui/DateInput.svelte';

  const x = assessment.data.execution;
  const d = assessment.data.distribution;
</script>

<Fieldset legend="Step 5 of 6 — Signing and witnesses">
  <p class="hint">
    How the document is signed. Witness and notary rules come from the principal's state.
  </p>

  <Field label="Signature date" inputId="execution-signatureDate">
    <DateInput id="execution-signatureDate" label="Signature date" bind:value={x.signatureDate} />
  </Field>
  <Field label="Signing method" inputId="execution-executionMethod">
    <Select id="execution-executionMethod" label="Signing method" bind:value={x.executionMethod}>
      <option value="">— Select —</option>
      <option value="two-witnesses">Two witnesses</option>
      <option value="one-witness">One witness</option>
      <option value="notary">Notary acknowledgment</option>
      <option value="witnesses-and-notary">Witnesses and notary</option>
    </Select>
  </Field>
  <Field
    label="Signed (or signature acknowledged) in the presence of the witnesses or notary?"
    inputId="execution-witnessesPresent"
  >
    <Select
      id="execution-witnessesPresent"
      label="Signed (or signature acknowledged) in the presence of the witnesses or notary?"
      bind:value={x.witnessesPresent}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>
  <Field label="Witness 1 — name" inputId="execution-witness1Name">
    <TextInput id="execution-witness1Name" label="Witness 1 — name" bind:value={x.witness1Name} />
  </Field>
  <Field label="Witness 1 is related to the principal?" inputId="execution-witness1IsRelative">
    <Select
      id="execution-witness1IsRelative"
      label="Witness 1 is related to the principal?"
      bind:value={x.witness1IsRelative}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>
  <Field label="Witness 1 would inherit from the principal?" inputId="execution-witness1IsHeir">
    <Select
      id="execution-witness1IsHeir"
      label="Witness 1 would inherit from the principal?"
      bind:value={x.witness1IsHeir}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>
  <Field label="Witness 1 is the agent?" inputId="execution-witness1IsAgent">
    <Select
      id="execution-witness1IsAgent"
      label="Witness 1 is the agent?"
      bind:value={x.witness1IsAgent}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>
  <Field
    label="Witness 1 is the principal's provider or facility staff?"
    inputId="execution-witness1IsProvider"
  >
    <Select
      id="execution-witness1IsProvider"
      label="Witness 1 is the principal's provider or facility staff?"
      bind:value={x.witness1IsProvider}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>
  <Field label="Witness 2 — name" inputId="execution-witness2Name">
    <TextInput id="execution-witness2Name" label="Witness 2 — name" bind:value={x.witness2Name} />
  </Field>
  <Field label="Witness 2 is related to the principal?" inputId="execution-witness2IsRelative">
    <Select
      id="execution-witness2IsRelative"
      label="Witness 2 is related to the principal?"
      bind:value={x.witness2IsRelative}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>
  <Field label="Witness 2 would inherit from the principal?" inputId="execution-witness2IsHeir">
    <Select
      id="execution-witness2IsHeir"
      label="Witness 2 would inherit from the principal?"
      bind:value={x.witness2IsHeir}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>
  <Field label="Witness 2 is the agent?" inputId="execution-witness2IsAgent">
    <Select
      id="execution-witness2IsAgent"
      label="Witness 2 is the agent?"
      bind:value={x.witness2IsAgent}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>
  <Field
    label="Witness 2 is the principal's provider or facility staff?"
    inputId="execution-witness2IsProvider"
  >
    <Select
      id="execution-witness2IsProvider"
      label="Witness 2 is the principal's provider or facility staff?"
      bind:value={x.witness2IsProvider}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>
  <Field label="Notary — name" inputId="execution-notaryName">
    <TextInput id="execution-notaryName" label="Notary — name" bind:value={x.notaryName} />
  </Field>
  <Field
    label="Is the principal a resident of a skilled nursing facility?"
    inputId="execution-principalInSkilledNursingFacility"
  >
    <Select
      id="execution-principalInSkilledNursingFacility"
      label="Is the principal a resident of a skilled nursing facility?"
      bind:value={x.principalInSkilledNursingFacility}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>
  <Field
    label="Did a patient advocate or ombudsman sign as a witness?"
    inputId="execution-ombudsmanSigned"
  >
    <Select
      id="execution-ombudsmanSigned"
      label="Did a patient advocate or ombudsman sign as a witness?"
      bind:value={x.ombudsmanSigned}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>
  <p class="hint">California requires this for skilled nursing facility residents.</p>
  <Field label="Copy given to the agent?" inputId="distribution-copyToAgent">
    <Select
      id="distribution-copyToAgent"
      label="Copy given to the agent?"
      bind:value={d.copyToAgent}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>
  <Field label="Copy given to the principal's physician?" inputId="distribution-copyToPhysician">
    <Select
      id="distribution-copyToPhysician"
      label="Copy given to the principal's physician?"
      bind:value={d.copyToPhysician}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>
  <Field label="Copy given to the successor agents?" inputId="distribution-copyToSuccessor">
    <Select
      id="distribution-copyToSuccessor"
      label="Copy given to the successor agents?"
      bind:value={d.copyToSuccessor}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>
  <Field
    label="Copy brought to the hospital or care facility?"
    inputId="distribution-copyToFacility"
  >
    <Select
      id="distribution-copyToFacility"
      label="Copy brought to the hospital or care facility?"
      bind:value={d.copyToFacility}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>
  <p class="hint">
    Federal law (Patient Self-Determination Act) requires providers to ask whether you have a
    directive.
  </p>
</Fieldset>
