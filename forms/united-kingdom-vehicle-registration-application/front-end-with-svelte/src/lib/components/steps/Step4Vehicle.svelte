<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import { TextInput } from '@lilydesignsystem/svelte-headless';
  import Select from '#lib/components/ui/Select.svelte';
  import DateInput from '#lib/components/ui/DateInput.svelte';
  import NumberInput from '#lib/components/ui/NumberInput.svelte';

  const v = assessment.data.vehicle;
</script>

<Fieldset legend="Step 4 of 7 — Vehicle">
  <p class="hint">
    Identify the vehicle. A first registration is given its number by the DVLA, so the registration
    number may be left blank.
  </p>

  <Field label="Registration number" inputId="vehicle-registrationNumber">
    <TextInput
      id="vehicle-registrationNumber"
      label="Registration number"
      bind:value={v.registrationNumber}
    />
  </Field>
  <p class="hint">Required for a V62. Leave blank for a first registration.</p>

  <Field label="Vehicle identification number (VIN)" inputId="vehicle-vehicleIdentificationNumber">
    <TextInput
      id="vehicle-vehicleIdentificationNumber"
      label="Vehicle identification number (VIN)"
      bind:value={v.vehicleIdentificationNumber}
    />
  </Field>
  <p class="hint">
    Also called the chassis number. From 1981 it has 17 characters, with no I, O, or Q.
  </p>

  <Field label="Engine number" inputId="vehicle-engineNumber">
    <TextInput id="vehicle-engineNumber" label="Engine number" bind:value={v.engineNumber} />
  </Field>

  <Field label="Make" inputId="vehicle-make">
    <TextInput id="vehicle-make" label="Make" bind:value={v.make} />
  </Field>

  <Field label="Model" inputId="vehicle-model">
    <TextInput id="vehicle-model" label="Model" bind:value={v.model} />
  </Field>

  <Field label="Colour" inputId="vehicle-colour">
    <TextInput id="vehicle-colour" label="Colour" bind:value={v.colour} />
  </Field>

  <Field label="Vehicle category" inputId="vehicle-vehicleCategory">
    <Select id="vehicle-vehicleCategory" label="Vehicle category" bind:value={v.vehicleCategory}>
      <option value="">— Select —</option>
      <option value="car">Car</option>
      <option value="motorcycle">Motorcycle</option>
      <option value="light-goods">Light goods vehicle</option>
      <option value="heavy-goods">Heavy goods vehicle</option>
      <option value="bus">Bus or coach</option>
      <option value="other">Other</option>
    </Select>
  </Field>

  <Field label="Fuel type" inputId="vehicle-fuelType">
    <Select id="vehicle-fuelType" label="Fuel type" bind:value={v.fuelType}>
      <option value="">— Select —</option>
      <option value="petrol">Petrol</option>
      <option value="diesel">Diesel</option>
      <option value="electric">Electric</option>
      <option value="hybrid">Hybrid</option>
      <option value="lpg">LPG</option>
      <option value="other">Other</option>
    </Select>
  </Field>

  <Field label="Engine capacity (cc)" inputId="vehicle-engineCapacityAsCc">
    <NumberInput
      id="vehicle-engineCapacityAsCc"
      label="Engine capacity (cc)"
      min={0}
      max={20000}
      bind:value={v.engineCapacityAsCc}
    />
  </Field>

  <Field label="Date of manufacture" inputId="vehicle-dateOfManufacture">
    <DateInput
      id="vehicle-dateOfManufacture"
      label="Date of manufacture"
      bind:value={v.dateOfManufacture}
    />
  </Field>

  <Field label="Date first used" inputId="vehicle-dateFirstUsed">
    <DateInput id="vehicle-dateFirstUsed" label="Date first used" bind:value={v.dateFirstUsed} />
  </Field>

  <Field
    label="Is the vehicle seriously damaged, so that it cannot be repaired?"
    inputId="vehicle-seriouslyDamaged"
  >
    <Select
      id="vehicle-seriouslyDamaged"
      label="Is the vehicle seriously damaged, so that it cannot be repaired?"
      bind:value={v.seriouslyDamaged}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>
  <p class="hint">A vehicle that cannot be repaired cannot be registered.</p>
</Fieldset>
