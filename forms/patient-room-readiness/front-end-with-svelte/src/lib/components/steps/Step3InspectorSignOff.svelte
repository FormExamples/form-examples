<script lang="ts">
  import { store } from '#lib/stores/checklist.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import TextInput from '#lib/components/ui/TextInput.svelte';
  import EmailInput from '#lib/components/ui/EmailInput.svelte';
  import DateInput from '#lib/components/ui/DateInput.svelte';
  import TimeInput from '#lib/components/ui/TimeInput.svelte';
</script>

<Fieldset legend="Step 3 — Inspector & sign-off">
  <p class="hint">Who inspected the room, and when.</p>

  <div class="field-grid">
    <Field
      label="Inspector name"
      inputId="step-3-inspector-name"
      error={store.errors['step-3-inspector-name']}
    >
      <TextInput
        id="step-3-inspector-name"
        label="Inspector name"
        bind:value={store.data.inspector.name}
        aria-invalid={store.errors['step-3-inspector-name'] ? 'true' : undefined}
      />
    </Field>
    <Field label="Inspector email" inputId="step-3-inspector-email">
      <EmailInput
        id="step-3-inspector-email"
        label="Inspector email"
        bind:value={store.data.inspector.email}
      />
    </Field>
    <Field label="Inspection date" inputId="step-3-inspection-date">
      <DateInput
        id="step-3-inspection-date"
        label="Inspection date"
        bind:value={store.data.inspection.date}
      />
    </Field>
    <Field label="Inspection time" inputId="step-3-inspection-time">
      <TimeInput
        id="step-3-inspection-time"
        label="Inspection time"
        bind:value={store.data.inspection.time}
      />
    </Field>
  </div>
</Fieldset>

<style>
  .field-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1rem;
  }
  @media (max-width: 640px) {
    .field-grid { grid-template-columns: 1fr; }
  }
</style>
