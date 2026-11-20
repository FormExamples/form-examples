<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import { TextInput } from '@lilydesignsystem/svelte-headless';
  import Select from '#lib/components/ui/Select.svelte';

  const s = assessment.data.executors;
</script>

<Fieldset legend="Step 3 of 6 — Executors">
  <p class="hint">
    The people who carry out the will. At least one is needed; two is usual. They must be 18 or over
    and willing to act.
  </p>

  <Field label="First executor — name" inputId="executors-executorFirstName">
    <TextInput
      id="executors-executorFirstName"
      label="First executor — name"
      bind:value={s.executorFirstName}
    />
  </Field>

  <Field label="First executor — relationship" inputId="executors-executorFirstRelationship">
    <TextInput
      id="executors-executorFirstRelationship"
      label="First executor — relationship"
      bind:value={s.executorFirstRelationship}
    />
  </Field>

  <Field label="Second executor — name" inputId="executors-executorSecondName">
    <TextInput
      id="executors-executorSecondName"
      label="Second executor — name"
      bind:value={s.executorSecondName}
    />
  </Field>

  <Field label="Second executor — relationship" inputId="executors-executorSecondRelationship">
    <TextInput
      id="executors-executorSecondRelationship"
      label="Second executor — relationship"
      bind:value={s.executorSecondRelationship}
    />
  </Field>

  <Field
    label="Is every executor 18 or over and willing to act?"
    inputId="executors-executorsAdultConfirmed"
  >
    <Select
      id="executors-executorsAdultConfirmed"
      label="Is every executor 18 or over and willing to act?"
      bind:value={s.executorsAdultConfirmed}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>
</Fieldset>
