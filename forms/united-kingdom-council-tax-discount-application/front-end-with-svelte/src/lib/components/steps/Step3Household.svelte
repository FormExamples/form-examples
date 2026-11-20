<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import { Button, TextInput } from '@lilydesignsystem/svelte-headless';
  import Select from '#lib/components/ui/Select.svelte';
  import DateInput from '#lib/components/ui/DateInput.svelte';

  const h = assessment.data.household;

  function addOccupant() {
    h.occupants.push({ name: '', birthDate: null, status: '', evidenceHeld: '' });
  }

  function removeOccupant(index: number) {
    h.occupants.splice(index, 1);
  }
</script>

<Fieldset legend="Step 3 of 5 — Household">
  <p class="hint">
    Everyone else who lives in the property. Disregarded people (students, severely mentally
    impaired people, apprentices, under 18s and others) do not count when working out the discount.
  </p>

  <Field label="Does anyone other than you live in the property?" inputId="household-othersLive">
    <Select
      id="household-othersLive"
      label="Does anyone other than you live in the property?"
      bind:value={h.othersLive}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>

  {#if h.othersLive === 'yes'}
    {#each h.occupants as occupant, index (index)}
      <fieldset class="fieldset">
        <legend class="fieldset-legend">Occupant {index + 1}</legend>
        <Field label="Full name" inputId="occupant-{index}-name">
          <TextInput
            id="occupant-{index}-name"
            label="Full name"
            placeholder="Name of the occupant"
            bind:value={occupant.name}
          />
        </Field>
        <Field label="Date of birth" inputId="occupant-{index}-birthDate">
          <DateInput
            id="occupant-{index}-birthDate"
            label="Date of birth"
            bind:value={occupant.birthDate}
          />
        </Field>
        <Field label="Status" inputId="occupant-{index}-status">
          <Select id="occupant-{index}-status" label="Status" bind:value={occupant.status}>
            <option value="">— Select —</option>
            <option value="counted-adult">Adult (counts)</option>
            <option value="full-time-student">Full-time student</option>
            <option value="severely-mentally-impaired">Severely mentally impaired</option>
            <option value="under-18">Under 18</option>
            <option value="apprentice">Apprentice</option>
            <option value="education-18-19">Aged 18 or 19 in full-time education</option>
            <option value="live-in-carer">Live-in carer</option>
            <option value="care-leaver">Care leaver</option>
            <option value="other-disregarded">Other disregarded person</option>
          </Select>
        </Field>
        <Field label="Evidence held for this status?" inputId="occupant-{index}-evidenceHeld">
          <Select
            id="occupant-{index}-evidenceHeld"
            label="Evidence held for this status?"
            bind:value={occupant.evidenceHeld}
          >
            <option value="">— Select —</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </Select>
        </Field>
        <Button type="button" data-variant="secondary" onclick={() => removeOccupant(index)}>
          Remove occupant {index + 1}
        </Button>
      </fieldset>
    {/each}
    <Button type="button" data-variant="secondary" onclick={addOccupant}>Add an occupant</Button>
  {/if}
</Fieldset>
