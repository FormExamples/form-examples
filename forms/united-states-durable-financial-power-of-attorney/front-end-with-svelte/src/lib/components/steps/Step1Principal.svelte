<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import { TextInput } from '@lilydesignsystem/svelte-headless';
  import Select from '#lib/components/ui/Select.svelte';
  import DateInput from '#lib/components/ui/DateInput.svelte';

  const p = assessment.data.principal;
</script>

<Fieldset legend="Step 1 of 6 — Principal and governing state">
  <p class="hint">
    Who is giving the power and where it will be signed. Execution formalities vary by state.
  </p>

  <Field label="Principal full legal name" inputId="principal-principalName">
    <TextInput
      id="principal-principalName"
      label="Principal full legal name"
      placeholder="As on government ID"
      bind:value={p.principalName}
    />
  </Field>
  <Field label="Principal date of birth" inputId="principal-dateOfBirth">
    <DateInput
      id="principal-dateOfBirth"
      label="Principal date of birth"
      bind:value={p.dateOfBirth}
    />
  </Field>
  <Field label="Governing state" inputId="principal-state">
    <Select id="principal-state" label="Governing state" bind:value={p.state}>
      <option value="">— Select —</option>
      <option value="AL">Alabama (AL)</option>
      <option value="AK">Alaska (AK)</option>
      <option value="AZ">Arizona (AZ)</option>
      <option value="AR">Arkansas (AR)</option>
      <option value="CA">California (CA)</option>
      <option value="CO">Colorado (CO)</option>
      <option value="CT">Connecticut (CT)</option>
      <option value="DE">Delaware (DE)</option>
      <option value="DC">District of Columbia (DC)</option>
      <option value="FL">Florida (FL)</option>
      <option value="GA">Georgia (GA)</option>
      <option value="HI">Hawaii (HI)</option>
      <option value="ID">Idaho (ID)</option>
      <option value="IL">Illinois (IL)</option>
      <option value="IN">Indiana (IN)</option>
      <option value="IA">Iowa (IA)</option>
      <option value="KS">Kansas (KS)</option>
      <option value="KY">Kentucky (KY)</option>
      <option value="LA">Louisiana (LA)</option>
      <option value="ME">Maine (ME)</option>
      <option value="MD">Maryland (MD)</option>
      <option value="MA">Massachusetts (MA)</option>
      <option value="MI">Michigan (MI)</option>
      <option value="MN">Minnesota (MN)</option>
      <option value="MS">Mississippi (MS)</option>
      <option value="MO">Missouri (MO)</option>
      <option value="MT">Montana (MT)</option>
      <option value="NE">Nebraska (NE)</option>
      <option value="NV">Nevada (NV)</option>
      <option value="NH">New Hampshire (NH)</option>
      <option value="NJ">New Jersey (NJ)</option>
      <option value="NM">New Mexico (NM)</option>
      <option value="NY">New York (NY)</option>
      <option value="NC">North Carolina (NC)</option>
      <option value="ND">North Dakota (ND)</option>
      <option value="OH">Ohio (OH)</option>
      <option value="OK">Oklahoma (OK)</option>
      <option value="OR">Oregon (OR)</option>
      <option value="PA">Pennsylvania (PA)</option>
      <option value="RI">Rhode Island (RI)</option>
      <option value="SC">South Carolina (SC)</option>
      <option value="SD">South Dakota (SD)</option>
      <option value="TN">Tennessee (TN)</option>
      <option value="TX">Texas (TX)</option>
      <option value="UT">Utah (UT)</option>
      <option value="VT">Vermont (VT)</option>
      <option value="VA">Virginia (VA)</option>
      <option value="WA">Washington (WA)</option>
      <option value="WV">West Virginia (WV)</option>
      <option value="WI">Wisconsin (WI)</option>
      <option value="WY">Wyoming (WY)</option>
    </Select>
  </Field>
  <Field label="Principal address" inputId="principal-principalAddress">
    <TextInput
      id="principal-principalAddress"
      label="Principal address"
      bind:value={p.principalAddress}
    />
  </Field>
  <Field label="Capacity to sign confirmed?" inputId="principal-capacityConfirmed">
    <Select
      id="principal-capacityConfirmed"
      label="Capacity to sign confirmed?"
      bind:value={p.capacityConfirmed}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>
</Fieldset>
