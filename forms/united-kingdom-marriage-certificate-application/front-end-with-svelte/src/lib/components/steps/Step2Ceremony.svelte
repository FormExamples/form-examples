<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import { TextInput } from '@lilydesignsystem/svelte-headless';
  import Select from '#lib/components/ui/Select.svelte';
  import DateInput from '#lib/components/ui/DateInput.svelte';
  import NumberInput from '#lib/components/ui/NumberInput.svelte';

  const v = assessment.data.ceremony;
</script>

<Fieldset legend="Step 2 of 6 — The ceremony">
  <p class="hint">
    The planned ceremony: at least 29 days after notice and within 12 months of it, with at least
    two witnesses.
  </p>

  <Field label="Type of ceremony" inputId="ceremony-ceremonyType">
    <Select id="ceremony-ceremonyType" label="Type of ceremony" bind:value={v.ceremonyType}>
      <option value="">— Select —</option>
      <option value="civil-register-office">Civil ceremony at a register office</option>
      <option value="civil-approved-premises"
        >Civil ceremony at approved premises (hotel, stately home, etc.)</option
      >
      <option value="religious-registered-building"
        >Religious ceremony in a registered building</option
      >
      <option value="anglican">Church of England or Church in Wales ceremony</option>
    </Select>
  </Field>

  <Field label="Ceremony date" inputId="ceremony-ceremonyDate">
    <DateInput id="ceremony-ceremonyDate" label="Ceremony date" bind:value={v.ceremonyDate} />
  </Field>

  <Field label="Ceremony venue" inputId="ceremony-venueName">
    <TextInput
      id="ceremony-venueName"
      label="Ceremony venue"
      placeholder="Name and address of the final venue"
      bind:value={v.venueName}
    />
  </Field>

  <Field label="Is the final venue confirmed?" inputId="ceremony-venueConfirmed">
    <Select
      id="ceremony-venueConfirmed"
      label="Is the final venue confirmed?"
      bind:value={v.venueConfirmed}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>

  <Field label="Number of witnesses" inputId="ceremony-witnessCount">
    <NumberInput
      id="ceremony-witnessCount"
      label="Number of witnesses"
      min={0}
      bind:value={v.witnessCount}
    />
  </Field>
</Fieldset>
