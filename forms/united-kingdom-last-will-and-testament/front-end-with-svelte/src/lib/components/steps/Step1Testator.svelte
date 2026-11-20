<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import { TextInput, TextAreaInput } from '@lilydesignsystem/svelte-headless';
  import Select from '#lib/components/ui/Select.svelte';
  import DateInput from '#lib/components/ui/DateInput.svelte';

  const s = assessment.data.testator;
</script>

<Fieldset legend="Step 1 of 6 — The testator">
  <p class="hint">
    Who is making the will, whether they can (18 or over, capacity, free choice), and whether an
    earlier will or a coming marriage affects it.
  </p>

  <Field label="Testator — full legal name" inputId="testator-testatorName">
    <TextInput
      id="testator-testatorName"
      label="Testator — full legal name"
      placeholder="Full name as it will appear in the will"
      bind:value={s.testatorName}
    />
  </Field>

  <Field label="Date of birth" inputId="testator-dateOfBirth">
    <DateInput id="testator-dateOfBirth" label="Date of birth" bind:value={s.dateOfBirth} />
  </Field>

  <Field label="Address" inputId="testator-testatorAddress">
    <TextAreaInput
      id="testator-testatorAddress"
      label="Address"
      rows={3}
      placeholder="Postal address"
      bind:value={s.testatorAddress}
    />
  </Field>

  <Field label="Domicile (where your permanent home is)" inputId="testator-domicile">
    <Select
      id="testator-domicile"
      label="Domicile (where your permanent home is)"
      bind:value={s.domicile}
    >
      <option value="">— Select —</option>
      <option value="england-wales">England and Wales</option>
      <option value="scotland">Scotland</option>
      <option value="northern-ireland">Northern Ireland</option>
      <option value="other">Another country</option>
    </Select>
  </Field>

  <Field label="Marital status" inputId="testator-maritalStatus">
    <Select id="testator-maritalStatus" label="Marital status" bind:value={s.maritalStatus}>
      <option value="">— Select —</option>
      <option value="single">Single</option>
      <option value="married">Married</option>
      <option value="civil-partnership">In a civil partnership</option>
      <option value="cohabiting">Living with an unmarried partner</option>
      <option value="divorced-or-dissolved">Divorced or civil partnership dissolved</option>
      <option value="widowed">Widowed</option>
    </Select>
  </Field>

  <Field
    label="Do you expect to marry or form a civil partnership soon?"
    inputId="testator-marriageExpected"
  >
    <Select
      id="testator-marriageExpected"
      label="Do you expect to marry or form a civil partnership soon?"
      bind:value={s.marriageExpected}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>

  <Field
    label="Does the will say it is made in contemplation of that marriage or civil partnership?"
    inputId="testator-contemplationOfMarriageClause"
  >
    <Select
      id="testator-contemplationOfMarriageClause"
      label="Does the will say it is made in contemplation of that marriage or civil partnership?"
      bind:value={s.contemplationOfMarriageClause}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>

  <Field
    label="Does the testator have mental capacity to make a will?"
    inputId="testator-hasMentalCapacity"
  >
    <Select
      id="testator-hasMentalCapacity"
      label="Does the testator have mental capacity to make a will?"
      bind:value={s.hasMentalCapacity}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>

  <Field
    label="Is the testator making the will freely, with no pressure or undue influence?"
    inputId="testator-madeVoluntarily"
  >
    <Select
      id="testator-madeVoluntarily"
      label="Is the testator making the will freely, with no pressure or undue influence?"
      bind:value={s.madeVoluntarily}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>

  <Field label="Earlier will" inputId="testator-previousWill">
    <Select id="testator-previousWill" label="Earlier will" bind:value={s.previousWill}>
      <option value="">— Select —</option>
      <option value="none">No earlier will</option>
      <option value="exists">An earlier will exists</option>
      <option value="unsure">Not sure</option>
    </Select>
  </Field>

  <Field
    label="Does this will revoke all earlier wills and codicils?"
    inputId="testator-revocationClause"
  >
    <Select
      id="testator-revocationClause"
      label="Does this will revoke all earlier wills and codicils?"
      bind:value={s.revocationClause}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>
</Fieldset>
