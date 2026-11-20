<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import Select from '#lib/components/ui/Select.svelte';
  import DateInput from '#lib/components/ui/DateInput.svelte';

  const s = assessment.data.application;
</script>

<Fieldset legend="Step 1 of 8 — The application">
  <p class="hint">
    Which state will title the vehicle, what you are applying for, and how and when you acquired it.
  </p>

  <Field
    label="State that will issue the title"
    inputId="application-state"
    description="Nine states carry encoded rules; any other state uses the uniform default and a &quot;verify the state rule&quot; flag."
  >
    <Select id="application-state" label="State that will issue the title" bind:value={s.state}>
      <option value="">— Select —</option>
      <option value="AL">Alabama</option>
      <option value="AK">Alaska</option>
      <option value="AZ">Arizona</option>
      <option value="AR">Arkansas</option>
      <option value="CA">California</option>
      <option value="CO">Colorado</option>
      <option value="CT">Connecticut</option>
      <option value="DE">Delaware</option>
      <option value="DC">District of Columbia</option>
      <option value="FL">Florida</option>
      <option value="GA">Georgia</option>
      <option value="HI">Hawaii</option>
      <option value="ID">Idaho</option>
      <option value="IL">Illinois</option>
      <option value="IN">Indiana</option>
      <option value="IA">Iowa</option>
      <option value="KS">Kansas</option>
      <option value="KY">Kentucky</option>
      <option value="LA">Louisiana</option>
      <option value="ME">Maine</option>
      <option value="MD">Maryland</option>
      <option value="MA">Massachusetts</option>
      <option value="MI">Michigan</option>
      <option value="MN">Minnesota</option>
      <option value="MS">Mississippi</option>
      <option value="MO">Missouri</option>
      <option value="MT">Montana</option>
      <option value="NE">Nebraska</option>
      <option value="NV">Nevada</option>
      <option value="NH">New Hampshire</option>
      <option value="NJ">New Jersey</option>
      <option value="NM">New Mexico</option>
      <option value="NY">New York</option>
      <option value="NC">North Carolina</option>
      <option value="ND">North Dakota</option>
      <option value="OH">Ohio</option>
      <option value="OK">Oklahoma</option>
      <option value="OR">Oregon</option>
      <option value="PA">Pennsylvania</option>
      <option value="RI">Rhode Island</option>
      <option value="SC">South Carolina</option>
      <option value="SD">South Dakota</option>
      <option value="TN">Tennessee</option>
      <option value="TX">Texas</option>
      <option value="UT">Utah</option>
      <option value="VT">Vermont</option>
      <option value="VA">Virginia</option>
      <option value="WA">Washington</option>
      <option value="WV">West Virginia</option>
      <option value="WI">Wisconsin</option>
      <option value="WY">Wyoming</option>
    </Select>
  </Field>

  <Field label="Transaction type" inputId="application-transactionType">
    <Select
      id="application-transactionType"
      label="Transaction type"
      bind:value={s.transactionType}
    >
      <option value="">— Select —</option>
      <option value="title-and-registration">Title and registration</option>
      <option value="title-only">Title only</option>
      <option value="registration-only">Registration only (renewal or transfer of plates)</option>
    </Select>
  </Field>

  <Field label="New or used" inputId="application-vehicleCondition">
    <Select id="application-vehicleCondition" label="New or used" bind:value={s.vehicleCondition}>
      <option value="">— Select —</option>
      <option value="new">New (never titled)</option>
      <option value="used">Used</option>
    </Select>
  </Field>

  <Field label="How the vehicle was acquired" inputId="application-acquisitionMethod">
    <Select
      id="application-acquisitionMethod"
      label="How the vehicle was acquired"
      bind:value={s.acquisitionMethod}
    >
      <option value="">— Select —</option>
      <option value="dealer-purchase">Purchased from a dealer</option>
      <option value="private-purchase">Purchased from a private seller</option>
      <option value="gift">Gift</option>
      <option value="inheritance">Inheritance</option>
      <option value="other">Other</option>
    </Select>
  </Field>

  <Field
    label="Acquisition date"
    inputId="application-acquisitionDate"
    description="The date of sale or gift; most states set a deadline from this date."
  >
    <DateInput
      id="application-acquisitionDate"
      label="Acquisition date"
      bind:value={s.acquisitionDate}
    />
  </Field>

  <Field label="Application date" inputId="application-applicationDate">
    <DateInput
      id="application-applicationDate"
      label="Application date"
      bind:value={s.applicationDate}
    />
  </Field>

  <Field
    label="Was the vehicle last titled in another state?"
    inputId="application-outOfStateTransfer"
    description="An out-of-state vehicle needs a VIN verification and the other state's title."
  >
    <Select
      id="application-outOfStateTransfer"
      label="Was the vehicle last titled in another state?"
      bind:value={s.outOfStateTransfer}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>

  <Field label="State that last titled the vehicle" inputId="application-previousState">
    <Select
      id="application-previousState"
      label="State that last titled the vehicle"
      bind:value={s.previousState}
    >
      <option value="">— Select —</option>
      <option value="AL">Alabama</option>
      <option value="AK">Alaska</option>
      <option value="AZ">Arizona</option>
      <option value="AR">Arkansas</option>
      <option value="CA">California</option>
      <option value="CO">Colorado</option>
      <option value="CT">Connecticut</option>
      <option value="DE">Delaware</option>
      <option value="DC">District of Columbia</option>
      <option value="FL">Florida</option>
      <option value="GA">Georgia</option>
      <option value="HI">Hawaii</option>
      <option value="ID">Idaho</option>
      <option value="IL">Illinois</option>
      <option value="IN">Indiana</option>
      <option value="IA">Iowa</option>
      <option value="KS">Kansas</option>
      <option value="KY">Kentucky</option>
      <option value="LA">Louisiana</option>
      <option value="ME">Maine</option>
      <option value="MD">Maryland</option>
      <option value="MA">Massachusetts</option>
      <option value="MI">Michigan</option>
      <option value="MN">Minnesota</option>
      <option value="MS">Mississippi</option>
      <option value="MO">Missouri</option>
      <option value="MT">Montana</option>
      <option value="NE">Nebraska</option>
      <option value="NV">Nevada</option>
      <option value="NH">New Hampshire</option>
      <option value="NJ">New Jersey</option>
      <option value="NM">New Mexico</option>
      <option value="NY">New York</option>
      <option value="NC">North Carolina</option>
      <option value="ND">North Dakota</option>
      <option value="OH">Ohio</option>
      <option value="OK">Oklahoma</option>
      <option value="OR">Oregon</option>
      <option value="PA">Pennsylvania</option>
      <option value="RI">Rhode Island</option>
      <option value="SC">South Carolina</option>
      <option value="SD">South Dakota</option>
      <option value="TN">Tennessee</option>
      <option value="TX">Texas</option>
      <option value="UT">Utah</option>
      <option value="VT">Vermont</option>
      <option value="VA">Virginia</option>
      <option value="WA">Washington</option>
      <option value="WV">West Virginia</option>
      <option value="WI">Wisconsin</option>
      <option value="WY">Wyoming</option>
    </Select>
  </Field>
</Fieldset>
