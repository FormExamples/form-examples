<script lang="ts">
  import { store } from '#lib/stores/checklist.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import TextInput from '#lib/components/ui/TextInput.svelte';
</script>

<Fieldset legend="Step 1 — Location">
  <p class="hint">Identify the building and room being inspected.</p>

  <div class="field-grid">
    <Field
      label="Building name/number"
      inputId="step-1-building-name-or-number"
      error={store.errors['step-1-building-name-or-number']}
    >
      <TextInput
        id="step-1-building-name-or-number"
        label="Building name/number"
        bind:value={store.data.location.buildingNameOrNumber}
        aria-invalid={store.errors['step-1-building-name-or-number'] ? 'true' : undefined}
      />
    </Field>
    <Field
      label="Room name/number"
      inputId="step-1-room-name-or-number"
      error={store.errors['step-1-room-name-or-number']}
    >
      <TextInput
        id="step-1-room-name-or-number"
        label="Room name/number"
        bind:value={store.data.location.roomNameOrNumber}
        aria-invalid={store.errors['step-1-room-name-or-number'] ? 'true' : undefined}
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
