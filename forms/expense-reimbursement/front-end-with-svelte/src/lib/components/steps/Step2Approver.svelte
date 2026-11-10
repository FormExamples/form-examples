<script lang="ts">
  import Field from '#lib/components/ui/Field.svelte';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Select from '#lib/components/ui/Select.svelte';
  import { EmailInput, TextInput } from '@lilydesignsystem/svelte-headless';
  import { claimStore } from '#lib/stores/result.svelte.js';
</script>

<Fieldset legend="2. Approver">
  <p class="hint">The manager who will review the claim.</p>

  <Field label="Approver name" inputId="managerName" required>
    <TextInput
      id="managerName"
      label="Approver name"
      placeholder="e.g. Priya Shah"
      bind:value={claimStore.data.manager.name}
      required
    />
  </Field>

  <Field label="Role" inputId="managerRole">
    <Select id="managerRole" label="Role" bind:value={claimStore.data.manager.role}>
      <option value="">Select…</option>
      <option value="line-manager">Line manager</option>
      <option value="budget-holder">Budget holder</option>
      <option value="finance">Finance</option>
      <option value="senior-manager">Senior manager</option>
      <option value="other">Other</option>
    </Select>
  </Field>

  <Field label="Job title" inputId="managerJobTitle">
    <TextInput
      id="managerJobTitle"
      label="Job title"
      bind:value={claimStore.data.manager.jobTitle}
    />
  </Field>

  <Field label="Department" inputId="managerDepartment">
    <TextInput
      id="managerDepartment"
      label="Department"
      bind:value={claimStore.data.manager.department}
    />
  </Field>

  <Field label="Email" inputId="managerEmail">
    <EmailInput id="managerEmail" label="Email" bind:value={claimStore.data.manager.email} />
  </Field>
</Fieldset>
