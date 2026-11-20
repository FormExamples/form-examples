<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import { TextInput } from '@lilydesignsystem/svelte-headless';
  import Select from '#lib/components/ui/Select.svelte';
  import DateInput from '#lib/components/ui/DateInput.svelte';

  const d = assessment.data.decree;
</script>

<Fieldset legend="Step 6 of 6 — Decree and divorce certificate">
  <p class="hint">The final decree, name restoration, and the vital-records divorce certificate.</p>

  <Field label="Has the court entered the decree?" inputId="decree-decreeEntered">
    <Select
      id="decree-decreeEntered"
      label="Has the court entered the decree?"
      bind:value={d.decreeEntered}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>

  <Field label="Decree date" inputId="decree-decreeDate">
    <DateInput id="decree-decreeDate" label="Decree date" bind:value={d.decreeDate} />
  </Field>

  <Field label="Restore a former name in the decree?" inputId="decree-nameRestorationRequested">
    <Select
      id="decree-nameRestorationRequested"
      label="Restore a former name in the decree?"
      bind:value={d.nameRestorationRequested}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>

  <Field label="Former name to restore" inputId="decree-nameToRestore">
    <TextInput
      id="decree-nameToRestore"
      label="Former name to restore"
      bind:value={d.nameToRestore}
    />
  </Field>

  <Field
    label="Request a vital-records divorce certificate or certified decree?"
    inputId="decree-certificateRequested"
  >
    <Select
      id="decree-certificateRequested"
      label="Request a vital-records divorce certificate or certified decree?"
      bind:value={d.certificateRequested}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>
</Fieldset>
