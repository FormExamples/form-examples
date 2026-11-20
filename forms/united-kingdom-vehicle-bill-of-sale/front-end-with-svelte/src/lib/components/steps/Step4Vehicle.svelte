<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import { TextInput } from '@lilydesignsystem/svelte-headless';
  import Select from '#lib/components/ui/Select.svelte';
  import NumberInput from '#lib/components/ui/NumberInput.svelte';

  const p = assessment.data.vehicle;
</script>

<Fieldset legend="Step 4 of 9 — The vehicle">
  <p class="hint">Identify the vehicle exactly as shown on the V5C and on the vehicle itself.</p>

  <Field label="Registration number" inputId="vehicle-registration">
    <TextInput
      id="vehicle-registration"
      label="Registration number"
      placeholder="e.g. AB12 CDE"
      bind:value={p.registration}
    />
  </Field>

  <Field label="Make" inputId="vehicle-make">
    <TextInput id="vehicle-make" label="Make" placeholder="e.g. Ford" bind:value={p.make} />
  </Field>

  <Field label="Model" inputId="vehicle-model">
    <TextInput id="vehicle-model" label="Model" placeholder="e.g. Focus" bind:value={p.model} />
  </Field>

  <Field label="Colour" inputId="vehicle-colour">
    <TextInput id="vehicle-colour" label="Colour" bind:value={p.colour} />
  </Field>

  <Field label="Vehicle identification number (VIN)" inputId="vehicle-vin">
    <TextInput
      id="vehicle-vin"
      label="Vehicle identification number (VIN)"
      placeholder="e.g. WF0XXXGCDXAB12345"
      bind:value={p.vin}
    />
  </Field>

  <Field label="Year first registered" inputId="vehicle-firstRegisteredYear">
    <NumberInput
      id="vehicle-firstRegisteredYear"
      label="Year first registered"
      bind:value={p.firstRegisteredYear}
    />
  </Field>

  <Field label="Fuel type" inputId="vehicle-fuelType">
    <Select id="vehicle-fuelType" label="Fuel type" bind:value={p.fuelType}>
      <option value="">— Select —</option>
      <option value="petrol">Petrol</option>
      <option value="diesel">Diesel</option>
      <option value="hybrid">Hybrid</option>
      <option value="electric">Electric</option>
      <option value="other">Other</option>
    </Select>
  </Field>

  <Field label="Mileage at sale (miles)" inputId="vehicle-mileage">
    <NumberInput id="vehicle-mileage" label="Mileage at sale (miles)" bind:value={p.mileage} />
  </Field>

  <Field label="Mileage accuracy" inputId="vehicle-mileageAccuracy">
    <Select id="vehicle-mileageAccuracy" label="Mileage accuracy" bind:value={p.mileageAccuracy}>
      <option value="">— Select —</option>
      <option value="recorded">Recorded reading from the odometer</option>
      <option value="not-known">Not known (odometer unreliable or replaced)</option>
    </Select>
  </Field>
</Fieldset>
