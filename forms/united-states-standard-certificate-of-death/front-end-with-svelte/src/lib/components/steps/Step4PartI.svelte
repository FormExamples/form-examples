<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import { TextInput } from '@lilydesignsystem/svelte-headless';

  const partI = assessment.data.partI;
</script>

<Fieldset legend="Step 4 of 11 — Part I: cause of death chain">
  <p class="hint">
    Enter the chain of events leading directly to death, the immediate cause on line (a), each line
    due to the line below it, with the underlying cause on the lowest line used. Write every term in
    full; no abbreviations except HIV and AIDS. A mechanism such as cardiac arrest must never stand
    alone.
  </p>

  <Field label="Line (a): immediate cause" inputId="partI-causeIaCondition">
    <TextInput
      id="partI-causeIaCondition"
      label="Line (a): immediate cause"
      placeholder="e.g. Aspiration pneumonia"
      bind:value={partI.causeIaCondition}
    />
  </Field>

  <Field
    label="Line (a): approximate interval between onset and death"
    inputId="partI-causeIaInterval"
  >
    <TextInput
      id="partI-causeIaInterval"
      label="Line (a): approximate interval between onset and death"
      placeholder="e.g. 3 days"
      bind:value={partI.causeIaInterval}
    />
  </Field>

  <Field label="Line (b): due to, or as a consequence of" inputId="partI-causeIbCondition">
    <TextInput
      id="partI-causeIbCondition"
      label="Line (b): due to, or as a consequence of"
      placeholder="e.g. Ischemic stroke of the left middle cerebral artery"
      bind:value={partI.causeIbCondition}
    />
  </Field>

  <Field
    label="Line (b): approximate interval between onset and death"
    inputId="partI-causeIbInterval"
  >
    <TextInput
      id="partI-causeIbInterval"
      label="Line (b): approximate interval between onset and death"
      placeholder="e.g. 2 weeks"
      bind:value={partI.causeIbInterval}
    />
  </Field>

  <Field label="Line (c): due to, or as a consequence of" inputId="partI-causeIcCondition">
    <TextInput
      id="partI-causeIcCondition"
      label="Line (c): due to, or as a consequence of"
      placeholder="e.g. Atrial fibrillation"
      bind:value={partI.causeIcCondition}
    />
  </Field>

  <Field
    label="Line (c): approximate interval between onset and death"
    inputId="partI-causeIcInterval"
  >
    <TextInput
      id="partI-causeIcInterval"
      label="Line (c): approximate interval between onset and death"
      placeholder="e.g. 6 years"
      bind:value={partI.causeIcInterval}
    />
  </Field>

  <Field
    label="Line (d): due to, or as a consequence of (underlying cause)"
    inputId="partI-causeIdCondition"
  >
    <TextInput
      id="partI-causeIdCondition"
      label="Line (d): due to, or as a consequence of (underlying cause)"
      placeholder="e.g. Rheumatic mitral valve stenosis"
      bind:value={partI.causeIdCondition}
    />
  </Field>

  <Field
    label="Line (d): approximate interval between onset and death"
    inputId="partI-causeIdInterval"
  >
    <TextInput
      id="partI-causeIdInterval"
      label="Line (d): approximate interval between onset and death"
      placeholder="e.g. 30 years"
      bind:value={partI.causeIdInterval}
    />
  </Field>
</Fieldset>
