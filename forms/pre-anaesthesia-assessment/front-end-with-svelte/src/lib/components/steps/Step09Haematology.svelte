<script lang="ts">
  import { store } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import TextInput from '#lib/components/ui/TextInput.svelte';
  import NumberInput from '#lib/components/ui/NumberInput.svelte';
  import Select from '#lib/components/ui/Select.svelte';
</script>

<Fieldset legend="Step 9 — Haematology and coagulation">
  <div class="field-grid field-grid-3">
    <Field label="Hb (g/L)">
      <NumberInput label="Hb (g/L)" bind:value={store.data.haematology.hbGL} />
    </Field>
    <Field label="Platelets (x10^9/L)">
      <NumberInput label="Platelets (x10^9/L)" bind:value={store.data.haematology.platelets109L} />
    </Field>
    <Field label="INR">
      <NumberInput label="INR" step="0.01" bind:value={store.data.haematology.inr} />
    </Field>
    <Field label="APTT (s)">
      <NumberInput label="APTT (s)" step="0.1" bind:value={store.data.haematology.apttSeconds} />
    </Field>
    <Field label="On anticoagulant?">
      <Select label="On anticoagulant?" bind:value={store.data.haematology.onAnticoagulant}>
        <option value="">—</option>
        <option value="yes">Yes</option>
        <option value="no">No</option>
      </Select>
    </Field>
    <Field label="Anticoag type">
      <Select label="Anticoag type" bind:value={store.data.haematology.anticoagulantType}>
        <option value="">—</option>
        <option value="warfarin">Warfarin</option>
        <option value="apixaban">Apixaban</option>
        <option value="rivaroxaban">Rivaroxaban</option>
        <option value="edoxaban">Edoxaban</option>
        <option value="dabigatran">Dabigatran</option>
        <option value="lmwh">LMWH</option>
        <option value="aspirin">Aspirin</option>
        <option value="clopidogrel">Clopidogrel</option>
        <option value="none">None</option>
      </Select>
    </Field>
    <Field label="Hold plan" class="field-span-3">
      <TextInput label="Hold plan" bind:value={store.data.haematology.anticoagulantHoldPlan} />
    </Field>
    <Field label="Group and save">
      <Select label="Group and save" bind:value={store.data.haematology.groupAndSave}>
        <option value="">—</option>
        <option value="not-required">Not required</option>
        <option value="ordered">Ordered</option>
        <option value="valid">Valid</option>
        <option value="expired">Expired</option>
      </Select>
    </Field>
    <Field label="Crossmatch units">
      <NumberInput label="Crossmatch units" bind:value={store.data.haematology.crossmatchUnits} />
    </Field>
  </div>
</Fieldset>
