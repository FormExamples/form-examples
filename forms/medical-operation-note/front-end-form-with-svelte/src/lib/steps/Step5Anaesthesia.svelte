<script lang="ts">
  import { store } from '$lib/state.svelte.js';
  import Fieldset from '$lib/components/ui/Fieldset.svelte';
  import Field from '$lib/components/ui/Field.svelte';
  import TextInput from '$lib/components/ui/TextInput.svelte';
  import NumberInput from '$lib/components/ui/NumberInput.svelte';
  import Select from '$lib/components/ui/Select.svelte';
  import Hint from '$lib/components/ui/Hint.svelte';
</script>

<Fieldset legend="Step 5 — Anaesthesia">
  <div class="field-grid">
    <Field label="Type">
      <Select label="Type" bind:value={store.data.anaesthesia.type}>
        <option value="">—</option>
        <option value="ga">General (GA)</option>
        <option value="regional">Regional</option>
        <option value="neuraxial">Neuraxial</option>
        <option value="sedation">Sedation</option>
        <option value="mac">MAC</option>
        <option value="local">Local</option>
        <option value="combined-ga-regional">Combined GA + regional</option>
      </Select>
    </Field>
    <Field label="Airway">
      <Select label="Airway" bind:value={store.data.anaesthesia.airway}>
        <option value="">—</option>
        <option value="face-mask">Face mask</option>
        <option value="supraglottic">Supraglottic</option>
        <option value="ett">Endotracheal tube</option>
        <option value="awake-fibreoptic">Awake fibreoptic</option>
        <option value="surgical-airway">Surgical airway</option>
      </Select>
    </Field>
    <Field label="Induction agent">
      <TextInput label="Induction agent" bind:value={store.data.anaesthesia.inductionAgent} />
    </Field>
    <Field label="Maintenance agent">
      <TextInput label="Maintenance agent" bind:value={store.data.anaesthesia.maintenanceAgent} />
    </Field>
    <Field label="Neuromuscular blockade">
      <TextInput label="Neuromuscular blockade" bind:value={store.data.anaesthesia.neuromuscularBlockade} />
    </Field>
    <Field label="Regional block details">
      <TextInput label="Regional block details" bind:value={store.data.anaesthesia.regionalBlockDetails} />
    </Field>
    <Field label="Lines and monitoring" class="field-span-2">
      <TextInput label="Lines and monitoring" bind:value={store.data.anaesthesia.linesAndMonitoring} />
    </Field>
    <Field label="Crystalloid (mL)">
      <NumberInput label="Crystalloid (mL)" bind:value={store.data.anaesthesia.crystalloidMl} />
    </Field>
    <Field label="Colloid (mL)">
      <NumberInput label="Colloid (mL)" bind:value={store.data.anaesthesia.colloidMl} />
    </Field>
    <Field label="Blood (mL)">
      <NumberInput label="Blood (mL)" bind:value={store.data.anaesthesia.bloodMl} />
    </Field>
    <Field label="Anaesthetic events" class="field-span-2">
      <TextInput label="Anaesthetic events" bind:value={store.data.anaesthesia.events} />
      <Hint>
        Comma-separated tokens. Recognised: failed-intubation, awareness,
        anaphylaxis, malignant-hyperthermia, sux-apnoea, hypotension,
        hypertension, bronchospasm, laryngospasm.
      </Hint>
    </Field>
  </div>
</Fieldset>
