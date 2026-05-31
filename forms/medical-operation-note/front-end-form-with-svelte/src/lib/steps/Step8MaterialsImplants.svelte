<script lang="ts">
  import { store } from '$lib/state.svelte.js';
  import Fieldset from '$lib/components/ui/Fieldset.svelte';
  import Field from '$lib/components/ui/Field.svelte';
  import TextInput from '$lib/components/ui/TextInput.svelte';
  import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
  import Select from '$lib/components/ui/Select.svelte';
</script>

<Fieldset legend="Step 8 — Materials, implants and prostheses">
  <div class="field-grid">
    <Field label="Sutures (type, gauge, count)">
      <TextInput label="Sutures" bind:value={store.data.materialsImplants.sutures} />
    </Field>
    <Field label="Staples">
      <TextInput label="Staples" bind:value={store.data.materialsImplants.staples} />
    </Field>
    <Field label="Clips">
      <TextInput label="Clips" bind:value={store.data.materialsImplants.clips} />
    </Field>
    <Field label="Mesh">
      <TextInput label="Mesh" bind:value={store.data.materialsImplants.mesh} />
    </Field>
    <Field label="Screws / plates">
      <TextInput label="Screws / plates" bind:value={store.data.materialsImplants.screwsPlates} />
    </Field>
    <Field label="Prosthetic joints">
      <TextInput label="Prosthetic joints" bind:value={store.data.materialsImplants.prostheticJoints} />
    </Field>
    <Field label="Vascular grafts">
      <TextInput label="Vascular grafts" bind:value={store.data.materialsImplants.vascularGrafts} />
    </Field>
    <Field label="Manufacturer">
      <TextInput label="Manufacturer" bind:value={store.data.materialsImplants.manufacturer} />
    </Field>
    <Field label="Lot / serial / batch / expiry" class="field-span-2">
      <TextAreaInput
        label="Lot / serial / batch / expiry"
        rows={2}
        bind:value={store.data.materialsImplants.lotSerialBatchExpiry}
      />
    </Field>
    <Field label="Registry submitted">
      <Select label="Registry submitted" bind:value={store.data.materialsImplants.registrySubmitted}>
        <option value="">—</option>
        <option value="yes">Yes</option>
        <option value="no">No / pending</option>
      </Select>
    </Field>
  </div>
</Fieldset>
