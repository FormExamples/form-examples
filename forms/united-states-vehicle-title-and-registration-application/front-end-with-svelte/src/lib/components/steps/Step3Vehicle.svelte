<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import { TextInput } from '@lilydesignsystem/svelte-headless';
  import Select from '#lib/components/ui/Select.svelte';
  import NumberInput from '#lib/components/ui/NumberInput.svelte';

  const s = assessment.data.vehicle;
</script>

<Fieldset legend="Step 3 of 8 — The vehicle">
  <p class="hint">
    The VIN and the description. The VIN is checked for length, permitted characters, and the
    position-9 check digit.
  </p>

  <Field
    label="Vehicle identification number (VIN)"
    inputId="vehicle-vin"
    description="17 characters for a model year 1981 or later; the letters I, O, and Q are never used."
  >
    <TextInput id="vehicle-vin" label="Vehicle identification number (VIN)" bind:value={s.vin} />
  </Field>

  <Field label="Model year" inputId="vehicle-modelYear">
    <NumberInput
      id="vehicle-modelYear"
      label="Model year"
      min={1900}
      max={2100}
      bind:value={s.modelYear}
    />
  </Field>

  <Field label="Make" inputId="vehicle-make">
    <TextInput id="vehicle-make" label="Make" bind:value={s.make} />
  </Field>

  <Field label="Model" inputId="vehicle-model">
    <TextInput id="vehicle-model" label="Model" bind:value={s.model} />
  </Field>

  <Field label="Body type" inputId="vehicle-bodyType">
    <TextInput id="vehicle-bodyType" label="Body type" bind:value={s.bodyType} />
  </Field>

  <Field label="Vehicle class" inputId="vehicle-vehicleClass">
    <Select id="vehicle-vehicleClass" label="Vehicle class" bind:value={s.vehicleClass}>
      <option value="">— Select —</option>
      <option value="passenger">Passenger car</option>
      <option value="light-truck">Light truck, SUV, or van</option>
      <option value="heavy-truck">Heavy truck</option>
      <option value="motorcycle">Motorcycle</option>
      <option value="trailer">Trailer</option>
      <option value="motorhome">Motorhome</option>
    </Select>
  </Field>

  <Field label="Fuel type" inputId="vehicle-fuelType">
    <Select id="vehicle-fuelType" label="Fuel type" bind:value={s.fuelType}>
      <option value="">— Select —</option>
      <option value="gasoline">Gasoline</option>
      <option value="diesel">Diesel</option>
      <option value="electric">Electric</option>
      <option value="hybrid">Hybrid or plug-in hybrid</option>
      <option value="other">Other</option>
    </Select>
  </Field>

  <Field label="Gross vehicle weight rating (GVWR), pounds" inputId="vehicle-gvwrLbs">
    <NumberInput
      id="vehicle-gvwrLbs"
      label="Gross vehicle weight rating (GVWR), pounds"
      min={0}
      max={200000}
      bind:value={s.gvwrLbs}
    />
  </Field>

  <Field label="Color" inputId="vehicle-color">
    <TextInput id="vehicle-color" label="Color" bind:value={s.color} />
  </Field>
</Fieldset>
