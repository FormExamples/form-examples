<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import { TextInput } from '@lilydesignsystem/svelte-headless';
  import Select from '#lib/components/ui/Select.svelte';
  import DateInput from '#lib/components/ui/DateInput.svelte';

  const p = assessment.data.testator;
</script>

<Fieldset legend="Step 1 of 6 — Testator and state">
  <p class="hint">
    Who is making the will, which state's law applies, and whether the testator has capacity.
    Capacity needs age 18 or older and a sound mind.
  </p>

  <Field label="State of domicile" inputId="testator-state">
    <Select id="testator-state" label="State of domicile" bind:value={p.state}>
      <option value="">— Select —</option>
      <option value="CA">California (CA)</option>
      <option value="FL">Florida (FL)</option>
      <option value="IL">Illinois (IL)</option>
      <option value="NY">New York (NY)</option>
      <option value="OH">Ohio (OH)</option>
      <option value="PA">Pennsylvania (PA)</option>
      <option value="TX">Texas (TX)</option>
      <option value="WA">Washington (WA)</option>
    </Select>
  </Field>

  <Field label="Testator — full legal name" inputId="testator-testatorName">
    <TextInput
      id="testator-testatorName"
      label="Testator — full legal name"
      placeholder="Full legal name"
      bind:value={p.testatorName}
    />
  </Field>

  <Field label="Testator — date of birth" inputId="testator-dateOfBirth">
    <DateInput
      id="testator-dateOfBirth"
      label="Testator — date of birth"
      bind:value={p.dateOfBirth}
    />
  </Field>

  <Field label="Is the testator of sound mind?" inputId="testator-soundMind">
    <Select id="testator-soundMind" label="Is the testator of sound mind?" bind:value={p.soundMind}>
      <option value="">— Select —</option>
      <option value="yes">Yes, of sound mind</option>
      <option value="uncertain">Uncertain</option>
      <option value="no">No</option>
    </Select>
  </Field>

  <Field label="Undue influence concern" inputId="testator-undueInfluenceConcern">
    <Select
      id="testator-undueInfluenceConcern"
      label="Undue influence concern"
      bind:value={p.undueInfluenceConcern}
    >
      <option value="">— Select —</option>
      <option value="none">No concern</option>
      <option value="possible">Possible undue influence</option>
    </Select>
  </Field>

  <Field label="Marital status" inputId="testator-maritalStatus">
    <Select id="testator-maritalStatus" label="Marital status" bind:value={p.maritalStatus}>
      <option value="">— Select —</option>
      <option value="single">Single</option>
      <option value="married">Married</option>
      <option value="divorced">Divorced</option>
      <option value="widowed">Widowed</option>
    </Select>
  </Field>
</Fieldset>
