<script lang="ts">
  import Field from '#lib/components/ui/Field.svelte';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import { EmailInput, TelInput, TextInput } from '@lilydesignsystem/svelte-headless';
  import { claimStore } from '#lib/stores/result.svelte.js';
</script>

<Fieldset legend="1. Worker">
  <p class="hint">Who paid the expense and wants to be repaid.</p>

  <Field label="Your name" inputId="workerName" required>
    <TextInput
      id="workerName"
      label="Your name"
      placeholder="e.g. Amara Adeyemi"
      bind:value={claimStore.data.worker.name}
      required
    />
  </Field>

  <Field label="Job title" inputId="workerJobTitle">
    <TextInput
      id="workerJobTitle"
      label="Job title"
      placeholder="e.g. Staff nurse"
      bind:value={claimStore.data.worker.jobTitle}
    />
  </Field>

  <Field label="Department / team" inputId="workerDepartment">
    <TextInput
      id="workerDepartment"
      label="Department / team"
      placeholder="e.g. Cardiology"
      bind:value={claimStore.data.worker.department}
    />
  </Field>

  <Field label="Employee reference" inputId="workerEmployeeReference">
    <TextInput
      id="workerEmployeeReference"
      label="Employee reference"
      bind:value={claimStore.data.worker.employeeReference}
    />
  </Field>

  <Field label="Cost centre" inputId="workerCostCentre">
    <TextInput
      id="workerCostCentre"
      label="Cost centre"
      bind:value={claimStore.data.worker.costCentre}
    />
  </Field>

  <Field label="Email" inputId="workerEmail">
    <EmailInput id="workerEmail" label="Email" bind:value={claimStore.data.worker.email} />
  </Field>

  <Field label="Phone" inputId="workerPhone">
    <TelInput id="workerPhone" label="Phone" bind:value={claimStore.data.worker.phone} />
  </Field>
</Fieldset>
