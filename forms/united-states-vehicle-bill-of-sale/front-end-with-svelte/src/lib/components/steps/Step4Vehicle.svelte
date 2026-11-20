<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import { TextInput } from '@lilydesignsystem/svelte-headless';
  import Select from '#lib/components/ui/Select.svelte';
  import NumberInput from '#lib/components/ui/NumberInput.svelte';

  const p = assessment.data.vehicle;
</script>

<Fieldset legend="Step 4 of 7 — Vehicle">
  <p class="hint">
    Year, make, model, body type, and Vehicle Identification Number as they appear on the title, and
    the title brand.
  </p>

  <Field label="Model year" inputId="vehicle-year">
    <NumberInput id="vehicle-year" label="Model year" min={1900} bind:value={p.year} />
  </Field>

  <Field label="Make" inputId="vehicle-make">
    <TextInput id="vehicle-make" label="Make" placeholder="e.g. Honda" bind:value={p.make} />
  </Field>

  <Field label="Model" inputId="vehicle-model">
    <TextInput id="vehicle-model" label="Model" placeholder="e.g. Accord" bind:value={p.model} />
  </Field>

  <Field label="Body type" inputId="vehicle-bodyType">
    <TextInput
      id="vehicle-bodyType"
      label="Body type"
      placeholder="e.g. sedan, pickup, SUV"
      bind:value={p.bodyType}
    />
  </Field>

  <Field label="Vehicle Identification Number (VIN)" inputId="vehicle-vin">
    <TextInput
      id="vehicle-vin"
      label="Vehicle Identification Number (VIN)"
      placeholder="17-character VIN"
      bind:value={p.vin}
    />
  </Field>
  <p class="hint">17 characters for a 1981 or newer vehicle; never I, O, or Q.</p>

  <Field label="Color" inputId="vehicle-color">
    <TextInput id="vehicle-color" label="Color" bind:value={p.color} />
  </Field>

  <Field label="Certificate of title number" inputId="vehicle-titleNumber">
    <TextInput
      id="vehicle-titleNumber"
      label="Certificate of title number"
      bind:value={p.titleNumber}
    />
  </Field>

  <Field label="Title brand" inputId="vehicle-titleBrand">
    <Select id="vehicle-titleBrand" label="Title brand" bind:value={p.titleBrand}>
      <option value="">— Select —</option>
      <option value="clean">Clean (no brand)</option>
      <option value="salvage">Salvage</option>
      <option value="rebuilt">Rebuilt or reconstructed</option>
      <option value="flood">Flood damage</option>
      <option value="lemon">Lemon-law buyback</option>
      <option value="junk">Junk or non-repairable</option>
      <option value="unknown">Unknown</option>
    </Select>
  </Field>
  <p class="hint">
    A salvage, rebuilt, flood, lemon-law, or junk brand must be disclosed to the buyer.
  </p>

  <Field label="Gross vehicle weight rating over 16,000 pounds?" inputId="vehicle-gvwrOver16000">
    <Select
      id="vehicle-gvwrOver16000"
      label="Gross vehicle weight rating over 16,000 pounds?"
      bind:value={p.gvwrOver16000}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>
  <p class="hint">Heavy vehicles are exempt from the federal odometer disclosure.</p>

  <Field label="Self-propelled?" inputId="vehicle-selfPropelled">
    <Select id="vehicle-selfPropelled" label="Self-propelled?" bind:value={p.selfPropelled}>
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>
  <p class="hint">
    A trailer is not self-propelled and is exempt from the federal odometer disclosure.
  </p>
</Fieldset>
