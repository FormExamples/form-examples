<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import Select from '#lib/components/ui/Select.svelte';

  const manner = assessment.data.manner;
</script>

<Fieldset legend="Step 6 of 11 — Manner of death, tobacco and pregnancy">
  <p class="hint">
    Manner of death, tobacco use, and pregnancy status. Anything other than natural is a medical
    examiner or coroner case.
  </p>

  <Field label="Manner of death" inputId="manner-mannerOfDeath">
    <Select id="manner-mannerOfDeath" label="Manner of death" bind:value={manner.mannerOfDeath}>
      <option value="">— Select —</option>
      <option value="natural">Natural</option>
      <option value="accident">Accident</option>
      <option value="suicide">Suicide</option>
      <option value="homicide">Homicide</option>
      <option value="pending-investigation">Pending investigation</option>
      <option value="could-not-be-determined">Could not be determined</option>
    </Select>
  </Field>

  <Field label="Did tobacco use contribute to death?" inputId="manner-tobaccoUseContributed">
    <Select
      id="manner-tobaccoUseContributed"
      label="Did tobacco use contribute to death?"
      bind:value={manner.tobaccoUseContributed}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="probably">Probably</option>
      <option value="no">No</option>
      <option value="unknown">Unknown</option>
    </Select>
  </Field>

  <Field
    label="Pregnancy status (required for a female aged 10 to 54)"
    inputId="manner-pregnancyStatus"
  >
    <Select
      id="manner-pregnancyStatus"
      label="Pregnancy status (required for a female aged 10 to 54)"
      bind:value={manner.pregnancyStatus}
    >
      <option value="">— Select —</option>
      <option value="not-applicable">Not applicable (male, or female outside the age band)</option>
      <option value="not-pregnant-within-past-year">Not pregnant within the past year</option>
      <option value="pregnant-at-time-of-death">Pregnant at time of death</option>
      <option value="not-pregnant-but-pregnant-within-42-days">
        Not pregnant, but pregnant within 42 days of death
      </option>
      <option value="not-pregnant-but-pregnant-43-days-to-1-year">
        Not pregnant, but pregnant 43 days to 1 year before death
      </option>
      <option value="unknown">Unknown if pregnant within the past year</option>
    </Select>
  </Field>
</Fieldset>
