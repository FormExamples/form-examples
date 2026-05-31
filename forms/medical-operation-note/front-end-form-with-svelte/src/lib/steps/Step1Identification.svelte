<script lang="ts">
  import { store } from '$lib/state.svelte.js';
  import Fieldset from '$lib/components/ui/Fieldset.svelte';
  import Field from '$lib/components/ui/Field.svelte';
  import TextInput from '$lib/components/ui/TextInput.svelte';
  import Select from '$lib/components/ui/Select.svelte';
</script>

<Fieldset legend="Step 1 — Operation identification">
  <div class="field-grid">
    <Field label="Hospital" inputId="step-1-hospital" error={store.errors['step-1-hospital']}>
      <TextInput
        id="step-1-hospital"
        label="Hospital"
        bind:value={store.data.operation.hospital}
        aria-invalid={store.errors['step-1-hospital'] ? 'true' : undefined}
      />
    </Field>
    <Field label="Theatre / OR number" inputId="step-1-theatre-number" error={store.errors['step-1-theatre-number']}>
      <TextInput
        id="step-1-theatre-number"
        label="Theatre / OR number"
        bind:value={store.data.operation.theatreNumber}
        aria-invalid={store.errors['step-1-theatre-number'] ? 'true' : undefined}
      />
    </Field>
    <Field label="List type">
      <Select label="List type" bind:value={store.data.operation.listType}>
        <option value="">—</option>
        <option value="elective">Elective</option>
        <option value="cepod">CEPOD / emergency</option>
        <option value="trauma">Trauma</option>
        <option value="obstetric">Obstetric</option>
        <option value="day-case">Day case</option>
        <option value="endoscopy">Endoscopy</option>
      </Select>
    </Field>
    <Field label="Case start (date / time)">
      <input
        class="text-input"
        type="datetime-local"
        aria-label="Case start (date / time)"
        bind:value={store.data.operation.caseStartAt}
      />
    </Field>
    <Field label="Anaesthesia start">
      <input
        class="text-input"
        type="datetime-local"
        aria-label="Anaesthesia start"
        bind:value={store.data.operation.anaesthesiaStartAt}
      />
    </Field>
    <Field label="Knife to skin">
      <input
        class="text-input"
        type="datetime-local"
        aria-label="Knife to skin"
        bind:value={store.data.operation.knifeToSkinAt}
      />
    </Field>
    <Field label="End of surgery">
      <input
        class="text-input"
        type="datetime-local"
        aria-label="End of surgery"
        bind:value={store.data.operation.endOfSurgeryAt}
      />
    </Field>
    <Field label="Case end">
      <input
        class="text-input"
        type="datetime-local"
        aria-label="Case end"
        bind:value={store.data.operation.caseEndAt}
      />
    </Field>
  </div>
</Fieldset>
