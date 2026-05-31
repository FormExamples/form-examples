<script lang="ts">
  import { store } from '$lib/state.svelte.js';
  import Fieldset from '$lib/components/ui/Fieldset.svelte';
  import Field from '$lib/components/ui/Field.svelte';
  import TextInput from '$lib/components/ui/TextInput.svelte';
  import NumberInput from '$lib/components/ui/NumberInput.svelte';
  import Select from '$lib/components/ui/Select.svelte';
</script>

<Fieldset legend="Step 6 — Position, prep and approach">
  <div class="field-grid">
    <Field label="Patient position">
      <Select label="Patient position" bind:value={store.data.positionPrepApproach.patientPosition}>
        <option value="">—</option>
        <option value="supine">Supine</option>
        <option value="prone">Prone</option>
        <option value="lateral">Lateral</option>
        <option value="lithotomy">Lithotomy</option>
        <option value="beach-chair">Beach chair</option>
        <option value="jack-knife">Jack-knife</option>
      </Select>
    </Field>
    <Field label="Pressure-area protection">
      <TextInput
        label="Pressure-area protection"
        bind:value={store.data.positionPrepApproach.pressureAreaProtection}
      />
    </Field>
    <Field label="Prep solution">
      <Select label="Prep solution" bind:value={store.data.positionPrepApproach.prepSolution}>
        <option value="">—</option>
        <option value="chlorhexidine">Chlorhexidine</option>
        <option value="povidone-iodine">Povidone-iodine</option>
        <option value="alcohol">Alcohol-only</option>
        <option value="other">Other</option>
      </Select>
    </Field>
    <Field label="Drapes">
      <TextInput label="Drapes" bind:value={store.data.positionPrepApproach.drapes} />
    </Field>
    <Field label="Surgical approach" class="field-span-2">
      <TextInput
        label="Surgical approach"
        bind:value={store.data.positionPrepApproach.surgicalApproach}
      />
    </Field>
    <Field label="Incision type">
      <TextInput label="Incision type" bind:value={store.data.positionPrepApproach.incisionType} />
    </Field>
    <Field label="Incision length (cm)">
      <NumberInput
        label="Incision length (cm)"
        step="0.1"
        bind:value={store.data.positionPrepApproach.incisionLengthCm}
      />
    </Field>
    <Field label="Table tilt">
      <TextInput label="Table tilt" bind:value={store.data.positionPrepApproach.tableTilt} />
    </Field>
    <Field label="Tourniquet site">
      <TextInput
        label="Tourniquet site"
        bind:value={store.data.positionPrepApproach.tourniquetSite}
      />
    </Field>
    <Field label="Tourniquet pressure (mmHg)">
      <NumberInput
        label="Tourniquet pressure (mmHg)"
        bind:value={store.data.positionPrepApproach.tourniquetPressureMmHg}
      />
    </Field>
    <Field label="Tourniquet time on">
      <input
        class="time-input"
        type="time"
        aria-label="Tourniquet time on"
        bind:value={store.data.positionPrepApproach.tourniquetTimeOnAt}
      />
    </Field>
    <Field label="Tourniquet time off">
      <input
        class="time-input"
        type="time"
        aria-label="Tourniquet time off"
        bind:value={store.data.positionPrepApproach.tourniquetTimeOffAt}
      />
    </Field>
  </div>
</Fieldset>
